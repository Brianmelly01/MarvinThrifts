/**
 * M-Pesa Daraja API Integration
 * 
 * To get credentials:
 * 1. Visit https://developer.safaricom.co.ke
 * 2. Create an account and log in
 * 3. Create a new app and get Consumer Key + Consumer Secret
 * 4. Get your Shortcode and Passkey from the portal
 * 5. Set MPESA_ENVIRONMENT to "sandbox" for testing, "production" for live
 * 
 * For local testing, use ngrok to expose your localhost:
 * ngrok http 3000
 * Then set MPESA_CALLBACK_URL to your ngrok URL + /api/payments/mpesa/callback
 */

const MPESA_BASE_URL =
  process.env.MPESA_ENVIRONMENT === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'

interface MpesaTokenResponse {
  access_token: string
  expires_in: string
}

interface StkPushResponse {
  MerchantRequestID: string
  CheckoutRequestID: string
  ResponseCode: string
  ResponseDescription: string
  CustomerMessage: string
}

interface StkQueryResponse {
  ResponseCode: string
  ResponseDescription: string
  MerchantRequestID: string
  CheckoutRequestID: string
  ResultCode: string
  ResultDesc: string
}

/**
 * Get OAuth access token from Safaricom
 */
export async function getMpesaToken(): Promise<string> {
  const consumerKey = process.env.MPESA_CONSUMER_KEY
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET

  if (!consumerKey || !consumerSecret) {
    throw new Error('M-Pesa credentials not configured. Set MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET in .env.local')
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')

  const response = await fetch(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get M-Pesa token: ${response.statusText}`)
  }

  const data: MpesaTokenResponse = await response.json()
  return data.access_token
}

/**
 * Generate M-Pesa password (base64 of shortcode + passkey + timestamp)
 */
function generatePassword(timestamp: string): string {
  const shortcode = process.env.MPESA_SHORTCODE || ''
  const passkey = process.env.MPESA_PASSKEY || ''
  const str = `${shortcode}${passkey}${timestamp}`
  return Buffer.from(str).toString('base64')
}

/**
 * Get current timestamp in YYYYMMDDHHMMSS format
 */
function getTimestamp(): string {
  return new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, '')
    .slice(0, 14)
}

/**
 * Initiate STK Push (prompt customer to pay on their phone)
 */
export async function initiateSTKPush(params: {
  phone: string      // format: 254XXXXXXXXX
  amount: number     // in KSh
  orderId: string
  orderNumber: string
  description: string
}): Promise<StkPushResponse> {
  const { phone, amount, orderId, orderNumber, description } = params

  const shortcode = process.env.MPESA_SHORTCODE
  const callbackUrl = process.env.MPESA_CALLBACK_URL

  if (!shortcode || !callbackUrl) {
    throw new Error('M-Pesa shortcode or callback URL not configured')
  }

  const token = await getMpesaToken()
  const timestamp = getTimestamp()
  const password = generatePassword(timestamp)

  // Normalize phone: ensure it starts with 254
  const normalizedPhone = phone.replace(/^(\+254|0)/, '254')

  const body = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.ceil(amount), // M-Pesa requires whole numbers
    PartyA: normalizedPhone,
    PartyB: shortcode,
    PhoneNumber: normalizedPhone,
    CallBackURL: callbackUrl,
    AccountReference: orderNumber,
    TransactionDesc: description,
  }

  const response = await fetch(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`STK Push failed: ${error}`)
  }

  return response.json()
}

/**
 * Query STK Push status
 */
export async function queryStkPush(checkoutRequestId: string): Promise<StkQueryResponse> {
  const shortcode = process.env.MPESA_SHORTCODE

  if (!shortcode) {
    throw new Error('M-Pesa shortcode not configured')
  }

  const token = await getMpesaToken()
  const timestamp = getTimestamp()
  const password = generatePassword(timestamp)

  const body = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestId,
  }

  const response = await fetch(`${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`STK Query failed: ${error}`)
  }

  return response.json()
}

/**
 * Parse M-Pesa callback body
 */
export interface MpesaCallbackBody {
  Body: {
    stkCallback: {
      MerchantRequestID: string
      CheckoutRequestID: string
      ResultCode: number
      ResultDesc: string
      CallbackMetadata?: {
        Item: Array<{
          Name: string
          Value?: string | number
        }>
      }
    }
  }
}

export function parseMpesaCallback(body: MpesaCallbackBody): {
  success: boolean
  checkoutRequestId: string
  merchantRequestId: string
  resultCode: number
  resultDesc: string
  mpesaReceiptNo?: string
  amount?: number
  phone?: string
  transactionDate?: string
} {
  const callback = body.Body.stkCallback
  const success = callback.ResultCode === 0

  let mpesaReceiptNo: string | undefined
  let amount: number | undefined
  let phone: string | undefined
  let transactionDate: string | undefined

  if (success && callback.CallbackMetadata) {
    for (const item of callback.CallbackMetadata.Item) {
      if (item.Name === 'MpesaReceiptNumber') mpesaReceiptNo = String(item.Value)
      if (item.Name === 'Amount') amount = Number(item.Value)
      if (item.Name === 'PhoneNumber') phone = String(item.Value)
      if (item.Name === 'TransactionDate') transactionDate = String(item.Value)
    }
  }

  return {
    success,
    checkoutRequestId: callback.CheckoutRequestID,
    merchantRequestId: callback.MerchantRequestID,
    resultCode: callback.ResultCode,
    resultDesc: callback.ResultDesc,
    mpesaReceiptNo,
    amount,
    phone,
    transactionDate,
  }
}
