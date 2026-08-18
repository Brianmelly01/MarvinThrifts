import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Size Guide — Find Your Perfect Fit',
  description: 'Shoe sizing guide for EU, UK, US, and CM measurements. Find your perfect size at Marvin Thrifts.',
}

const sizeChart = [
  { eu: '38', uk: '5', us_m: '6', us_w: '7.5', cm: '24' },
  { eu: '38.5', uk: '5.5', us_m: '6.5', us_w: '8', cm: '24.5' },
  { eu: '39', uk: '6', us_m: '7', us_w: '8.5', cm: '25' },
  { eu: '40', uk: '6.5', us_m: '7.5', us_w: '9', cm: '25.5' },
  { eu: '40.5', uk: '7', us_m: '8', us_w: '9.5', cm: '26' },
  { eu: '41', uk: '7.5', us_m: '8.5', us_w: '10', cm: '26.5' },
  { eu: '42', uk: '8', us_m: '9', us_w: '10.5', cm: '27' },
  { eu: '42.5', uk: '8.5', us_m: '9.5', us_w: '11', cm: '27.5' },
  { eu: '43', uk: '9', us_m: '10', us_w: '11.5', cm: '28' },
  { eu: '44', uk: '9.5', us_m: '10.5', us_w: '12', cm: '28.5' },
  { eu: '44.5', uk: '10', us_m: '11', us_w: '12.5', cm: '29' },
  { eu: '45', uk: '10.5', us_m: '11.5', us_w: '13', cm: '29.5' },
  { eu: '45.5', uk: '11', us_m: '12', us_w: '13.5', cm: '30' },
  { eu: '46', uk: '11.5', us_m: '12.5', us_w: '14', cm: '30.5' },
  { eu: '47', uk: '12', us_m: '13', us_w: '14.5', cm: '31' },
]

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px]">
      <div className="bg-[#0A0A0A] py-14">
        <div className="container-brand">
          <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3">Sizing Help</div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-white leading-none">SIZE GUIDE.</h1>
        </div>
      </div>

      <div className="container-brand py-12">
        <div className="max-w-3xl">
          {/* How to measure */}
          <div className="bg-white border border-[#E5E5E5] p-8 mb-8">
            <h2 className="font-bold text-lg mb-4">How to measure your foot</h2>
            <ol className="space-y-3 text-sm text-[#525252]">
              <li className="flex gap-3"><span className="w-6 h-6 bg-[#C9A84C] text-white text-xs flex items-center justify-center shrink-0 rounded-full font-bold">1</span>Place your foot on a piece of paper and trace the outline.</li>
              <li className="flex gap-3"><span className="w-6 h-6 bg-[#C9A84C] text-white text-xs flex items-center justify-center shrink-0 rounded-full font-bold">2</span>Measure from the heel to the longest toe in centimetres.</li>
              <li className="flex gap-3"><span className="w-6 h-6 bg-[#C9A84C] text-white text-xs flex items-center justify-center shrink-0 rounded-full font-bold">3</span>Use the CM column in the table below to find your size.</li>
              <li className="flex gap-3"><span className="w-6 h-6 bg-[#C9A84C] text-white text-xs flex items-center justify-center shrink-0 rounded-full font-bold">4</span>If you&apos;re between sizes, we recommend going up half a size.</li>
            </ol>
            <div className="mt-4 p-3 bg-[#F5F4F0] border-l-2 border-[#C9A84C] text-sm text-[#525252]">
              <strong>Tip:</strong> Measure in the afternoon — feet naturally swell slightly during the day. Always measure both feet and use the larger measurement.
            </div>
          </div>

          {/* Size chart */}
          <div className="bg-white border border-[#E5E5E5] overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-[#E5E5E5]">
              <h2 className="font-bold">International Size Conversion</h2>
              <p className="text-[0.72rem] text-[#737373] mt-0.5">All sizes are approximate. Sizing varies slightly between brands.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0A0A0A] text-white">
                    {['EU', 'UK', 'US Men\'s', 'US Women\'s', 'CM'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[0.65rem] font-semibold tracking-[0.1em] uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F5]">
                  {sizeChart.map((row, i) => (
                    <tr key={row.eu} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                      <td className="px-4 py-2.5 font-semibold">{row.eu}</td>
                      <td className="px-4 py-2.5 text-[#525252]">{row.uk}</td>
                      <td className="px-4 py-2.5 text-[#525252]">{row.us_m}</td>
                      <td className="px-4 py-2.5 text-[#525252]">{row.us_w}</td>
                      <td className="px-4 py-2.5 text-[#C9A84C] font-medium">{row.cm} cm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Brand notes */}
          <div className="bg-white border border-[#E5E5E5] p-8">
            <h2 className="font-bold text-lg mb-5">Brand-specific notes</h2>
            <div className="space-y-4">
              {[
                { brand: 'Nike / Jordan', note: 'Generally true to size. Air Force 1 runs slightly large — some prefer to size down half.' },
                { brand: 'Adidas', note: 'Runs slightly narrow. Wide-footed wearers may prefer half a size up. Ultra Boost runs small.' },
                { brand: 'New Balance', note: 'True to size for most models. 550 and 574 run true. 2002R can run slightly large.' },
                { brand: 'Converse', note: 'Runs large. Most people size down 1 full size from their regular shoe size.' },
                { brand: 'Vans', note: 'Runs large. Size down half to a full size. Slip-ons run especially large.' },
              ].map(({ brand, note }) => (
                <div key={brand} className="flex gap-4 pb-4 border-b border-[#F2F2F2] last:border-0 last:pb-0">
                  <div className="text-[0.65rem] font-bold uppercase tracking-wide text-[#0A0A0A] w-28 shrink-0 pt-0.5">{brand}</div>
                  <div className="text-sm text-[#525252]">{note}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#737373] mb-3">Still not sure about your size?</p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000'}?text=${encodeURIComponent("Hi! I need help finding my size.")}`}
              target="_blank" rel="noopener noreferrer"
              className="btn bg-[#25D366] hover:bg-[#20BD5C] text-white"
            >
              Ask us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
