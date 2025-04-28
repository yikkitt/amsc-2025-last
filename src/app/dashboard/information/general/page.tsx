import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'General Information - AMSC 2025',
  description: 'General information for AMSC 2025 exhibitors',
}

export default function GeneralInformationPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">Section 1: General Information</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <p className="mb-6">
          This handbook acts as a guide to aid exhibitor's planning for the AMSC 2025. It contains important information and details which will need your attention leading up 
          to this fair. Please pay special attention to the forms and submission deadlines. Should you have any queries relating to your participation at this fair, please do 
          not hesitate to contact the relevant party directly.
        </p>
        
        <h2 className="text-xl font-bold mb-4 text-white bg-blue-800 -mx-6 px-6 py-3">Exhibition Important Contacts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="font-bold text-gray-900 mb-3">THE ORGANIZER/MANAGEMENT</h3>
            <p className="text-gray-800 mb-1">Deltus Sdn Bhd</p>
            <p className="text-gray-700 mb-1">Unit C-2-22, DaMen USJ Komersial, Persiaran Kewajipan, Usj 1, 47500 Subang Jaya, Selangor</p>
            <p className="text-gray-700 mb-1">Attn: Gary Chai, Director</p>
            <p className="text-gray-700 mb-1">Tel: 6016 538 9292</p>
            <p className="text-gray-700">Email: <a href="mailto:garychai@thedeltus.com" className="text-blue-600 hover:underline">garychai@thedeltus.com</a></p>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-3">OFFICIAL CONTRACTOR</h3>
            <p className="text-gray-800 mb-1">Blue Circle Plus Sdn Bhd</p>
            <p className="text-gray-700 mb-1">B-3-10, Block B, Ativo Plaza, Jalan PJU 9/1, Damansara Avenue, 52200 Kuala Lumpur</p>
            <p className="text-gray-700 mb-1">Attn: Mr. KM Chia</p>
            <p className="text-gray-700 mb-1">Tel: 6012 971 1393</p>
            <p className="text-gray-700">Email: <a href="mailto:kmchia@bcpgroup.com.my" className="text-blue-600 hover:underline">kmchia@bcpgroup.com.my</a></p>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-3">THE ORGANIZER/MANAGEMENT</h3>
            <p className="text-gray-800 mb-1">THE MALAYSIAN SOCIETY OF AESTHETIC MEDICINE (MSAM)</p>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-3">FREIGHT FORWARDER</h3>
            <p className="text-gray-800 mb-1">WIZER & SPICK SDN BHD</p>
            <p className="text-gray-700 mb-1">1-60, Jalan PUJ 3/7, Taman Perindustrian Puncak Jalil, 43300 Seri Kembangan, Selangor</p>
            <p className="text-gray-700 mb-1">Attn: Ms Shary</p>
            <p className="text-gray-700 mb-1">Tel: 603-8941 2402</p>
            <p className="text-gray-700">Email: <a href="mailto:shary@wizer-spick.com" className="text-blue-600 hover:underline">shary@wizer-spick.com</a></p>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-3">VENUE</h3>
            <p className="text-gray-800 mb-1">Kuala Lumpur Convention Centre</p>
            <p className="text-gray-700 mb-1">Kuala Lumpur City Centre, 50088 Kuala Lumpur</p>
            <p className="text-gray-700 mb-1">Attn: Exhibition Services</p>
            <p className="text-gray-700 mb-1">Tel: 603-2333 2888            </p>
            <p className="text-gray-700">Email: <a href="mailto:exhservices@klccconvention.com" className="text-blue-600 hover:underline">exhservices@klccconvention.com</a></p>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-3">EMERGENCY CONTACT</h3>
            <p className="text-gray-800 mb-1">Kuala Lumpur Convention Centre</p>
            <p className="text-gray-700 mb-1">Kuala Lumpur City Centre, 50088 Kuala Lumpur</p>
            <p className="text-gray-700 mb-1">Attn: Safety Department</p>
            <p className="text-gray-700 mb-1">Tel: 603–2382 8922</p>
            <p className="text-gray-700">Email: <a href="mailto:whistle@klccconventioncentre.com" className="text-blue-600 hover:underline">whistle@klccconventioncentre.com</a></p>
          </div>
        </div>
      </div>
    </div>
  )
} 