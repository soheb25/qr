import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { PassDetails } from '../types';

interface Props {
  data: PassDetails;
  viewUrl: string;
}

const DefaultGujaratLogo: React.FC = () => (
  <div 
    className="w-16 h-16 rounded-full flex items-center justify-center p-0.5 shadow-sm"
    style={{ backgroundColor: '#ffffff', borderColor: '#9ca3af', borderWidth: '1px', borderStyle: 'solid' }}
  >
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Outer Circle */}
      <circle cx="50" cy="50" r="48" fill="#155e43" stroke="#d4af37" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="38" fill="#ffffff" stroke="#d4af37" strokeWidth="1" />
      
      {/* Golden emblem center */}
      <path
        d="M 38,36 C 40,30 48,26 55,28 C 62,30 66,35 64,42 C 62,48 66,54 64,62 C 61,68 53,70 46,67 C 40,63 37,56 39,48 C 37,43 35,40 38,36 Z"
        fill="#da9100"
      />
      
      {/* Circular Text simulation */}
      <path id="circleText" d="M 16,50 A 34,34 0 1,1 84,50" fill="none" />
      <text fill="#ffffff" fontSize="5.5" fontWeight="bold" letterSpacing="0.5">
        <textPath href="#circleText" startOffset="50%" textAnchor="middle">
          GEOLOGY & MINING GUJARAT
        </textPath>
      </text>
    </svg>
  </div>
);

// Helper function to render '-' when a field is empty, null, undefined or string 'null'
const fmt = (val: any): React.ReactNode => {
  if (val === null || val === undefined) return '-';
  if (typeof val === 'string') {
    const s = val.trim();
    if (!s || s.toLowerCase() === 'null' || s.toLowerCase() === 'undefined') return '-';
    return s;
  }
  return val;
};

export const PassTemplate: React.FC<Props> = ({ data, viewUrl }) => {
  return (
    <div 
      className="w-[210mm] min-h-[297mm] mx-auto p-4 font-sans text-sm print:p-0 print:m-0"
      style={{
        backgroundColor: '#ffffff',
        color: '#000000',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact'
      } as React.CSSProperties}
    >
      <div 
        className="flex"
        style={{ borderColor: '#000000', borderWidth: '1px', borderStyle: 'solid' }}
      >
        
        {/* LEFT MAIN SECTION (62% width) */}
        <div 
          className="w-[62%] flex flex-col"
          style={{ borderRight: '1px solid #000000' }}
        >
          
          {/* Header of Left Main Section */}
          <div 
            className="flex"
            style={{ borderBottom: '1px solid #000000' }}
          >
            {/* Logo Cell */}
            <div 
              className="w-[190px] flex-shrink-0 p-2 flex items-center justify-center"
              style={{ borderRight: '1px solid #000000', backgroundColor: '#ffffff' }}
            >
              {data.logoDataUrl ? (
                <img 
                  src={data.logoDataUrl} 
                  alt="Logo" 
                  className="w-16 h-16 object-contain rounded-full p-0.5" 
                  style={{ backgroundColor: '#ffffff', border: '1px solid #9ca3af' }}
                />
              ) : (
                <DefaultGujaratLogo />
              )}
            </div>

            {/* Center Header Titles Column */}
            <div className="flex-1 flex flex-col">
              {/* Cyan Header Banner */}
              <div 
                className="h-[29px] flex items-center justify-center font-bold text-[13px]"
                style={{ backgroundColor: '#b0e2ec', color: '#000000', borderBottom: '1px solid #000000' }}
              >
                QR Code based - DC Pass
              </div>
              
              {/* Department Titles */}
              <div 
                className="p-1.5 flex flex-col justify-center text-center font-bold flex-1"
                style={{ backgroundColor: '#ffffff', color: '#000000' }}
              >
                <h1 className="text-[14px] font-bold leading-tight">Commissioner of Geology and Mining</h1>
                <h2 className="text-[13px] font-bold leading-tight">Industries and Mines Department</h2>
                <h3 className="text-[12px] font-bold leading-tight">(Government of Gujarat)</h3>
              </div>
            </div>
          </div>

          {/* Data Rows of Left Main Section */}
          {[
            { label: 'Copy For:', value: fmt(data.driver || 'Driver') },
            { label: 'Stockist Code', value: fmt(data.stockistCode) },
            { label: 'DC Pass No.', value: fmt(data.dcPassNo) },
            { label: 'Pass Issued on', value: fmt(data.passIssuedOn) },
            { 
              label: 'QR Code', 
              value: (
                <div className="flex justify-center p-1">
                  <QRCodeSVG value={viewUrl} size={110} />
                </div>
              ) 
            },
            { 
              label: 'Vehicle No. / (Carrier) Type', 
              value: fmt([data.vehicleNo, data.carrierType].filter(Boolean).join(' / ')) 
            },
            { 
              label: 'Mineral Name - Grade', 
              value: fmt(data.mineralName && data.grade ? `${data.mineralName} (${data.grade})` : data.mineralName || data.grade) 
            },
            { label: 'Net Weight in MT', value: fmt(data.netWeight) },
            { label: 'Registered Concession Holder Name', value: fmt(data.concessionHolderName) },
            { label: 'Source of Place', value: fmt(data.sourceOfPlace) },
            { label: 'Name of Purchaser', value: fmt(data.nameOfPurchaser) },
            { label: 'Destination Address', value: fmt(data.destinationAddress) },
            { label: 'Distance in Km', value: fmt(data.distanceInKm) },
            { label: 'Journey Start Date', value: fmt(data.journeyStartDate) },
            { label: 'Journey End Date', value: fmt(data.journeyEndDate) },
            { label: 'Expected Journey Route', value: fmt(data.expectedJourneyRoute) },
            { label: 'Journey Duration Time', value: fmt(data.journeyDuration) },
            { label: 'Name of Check Post in Route', value: fmt(data.nameOfCheckPost) },
            { label: 'Driver Name', value: fmt(data.driverName) },
            { label: 'Driver\'s Licence No.', value: fmt(data.driverLicenceNo) },
            { label: 'Driver Mobile Number', value: fmt(data.driverMobileNumber) },
            { label: 'PAN Number / GSTIN', value: fmt(data.panNumberGstin) },
            { label: 'Electronic Identification Device ( GPS Tracking Device) Details', value: fmt(data.electronicDeviceDetails) },
            { label: 'Transporter Name', value: fmt(data.transporterName) },
            { label: 'Buyer Mobile Number', value: fmt(data.buyerMobileNumber) },
          ].map((row, index, arr) => (
            <div 
              key={index} 
              className="flex"
              style={{ borderBottom: index !== arr.length - 1 ? '1px solid #000000' : 'none' }}
            >
              <div 
                className="w-[190px] flex-shrink-0 p-1 font-bold text-[12px] leading-tight flex items-center"
                style={{ borderRight: '1px solid #000000', color: '#000000' }}
              >
                {row.label}
              </div>
              <div 
                className="flex-1 p-1 text-[12px] leading-tight break-words flex items-center"
                style={{ color: '#000000' }}
              >
                {row.value}
              </div>
            </div>
          ))}

        </div>

        {/* RIGHT MAIN SECTION (38% width) */}
        <div className="w-[38%] flex flex-col">
          
          {/* Header Banner: "અગત્યની સુચનાઓ" */}
          <div 
            className="h-[29px] flex items-center justify-center font-bold text-[15px]"
            style={{ backgroundColor: '#f3f4f6', color: '#000000', borderBottom: '1px solid #000000' }}
          >
            અગત્યની સુચનાઓ
          </div>

          {/* Instructions Content & Digital Signature */}
          <div 
            className="p-2 flex-1 flex flex-col justify-between text-[11px] leading-tight"
            style={{ color: '#000000' }}
          >
            <div className="space-y-2">
              <p>
                <span className="font-semibold">(1) દરેક વાહન ચાલકે ડીસી પાસની ડીજીટલ સીગ્નેચર વેલીડ કોપીની પ્રીન્ટ આઉટ સાથે રાખવાની રહેશે. આ ઉપરાંત ડીસી પાસની કોપી પીડીએફ સ્વરૂપે ડાઉનલોડ અથવા મોબાઈલ માં ઓપન કરી પોતાની સાથે મુસાફરી દરમિયાન અવશ્ય રાખવાની રહેશે.</span>
              </p>
              <p className="text-[10.5px]">
                Every vehicle driver will have to carry a printout of the digitally signed valid copy of the DC Pass. In addition, a copy of the DC Pass must be downloaded in PDF format or opened on the mobile and kept with him during the journey.
              </p>

              <p>
                <span className="font-semibold">(2) દરેક વાહન ચાલકે ડીસી પાસ માં દર્શાવ્યા મુજબના રૂટ ઉપર જ મુસાફરી કરવાની રહેશે અને ડીસી પાસમાં દર્શાવેલ સ્થળ ઉપર જ ખનીજ પહોંચાડવાનું રહેશે.</span>
              </p>
              <p className="text-[10.5px]">
                Every vehicle driver will have to travel only on the route mentioned in the DC pass and will have to deliver the minerals only to the place mentioned in the DC pass.
              </p>

              <p>
                <span className="font-semibold">(3) મુસાફરી દરમિયાન જો કોઈ અધિકારી ડીસી પાસ ચેક કરવા માંગે તો પોતાના મોબાઈલમાં આવેલ મેસેજ બતાવવાનો રહેશે જેમાં મેસેજ નું હેડર અથવા સેન્ડર આઇડી CGMGUJ છે તેવું બતાવવાનું રહેશે. ડ્રાઇવરે ચેકિંગ અધિકારીને સ્કેનિંગ માટે પોતાના મોબાઇલમાંથી QR કોડ પણ બતાવવો પડશે. ચેકિંગ કરનાર અધિકારી સ્વતંત્ર રીતે પોતાના મોબાઈલથી આ QR કોડને સ્કેન કરી અને ડીસી પાસની ખરાઈ કરી શકશે.</span>
              </p>
              <p className="text-[10.5px]">
                If an officer wants to check the DC pass during travel, driver will have to show the message received on driver's mobile in which the header or sender ID of the message is CGMGUJ. Driver must have to show the QR Code from his mobile for scanning purpose to the checking officer. The checking officer can also independently scan this QR code with his mobile and verify the DC pass.
              </p>

              <p>
                <span className="font-semibold">(4) આ PDF ડાઉનલોડ સમયે ડિજિટલ સહી કરવામાં આવે છે. સહીની તારીખ/સમય પાસ જારી કરવાના સમય તથા અન્ય નકલો કરતાં અલગ હોઈ શકે છે.</span>
              </p>
              <p className="text-[10.5px]">
                This PDF is digitally signed at the time of download. The signature date/time may differ from the pass issue date/time and other copies of this PDF.
              </p>
            </div>

            {/* Digital Signature & Verification Badge */}
            <div 
              className="mt-4 pt-2"
              style={{ borderTop: '1px solid #d1d5db' }}
            >
              <div className="font-bold text-[13px] mb-1" style={{ color: '#000000' }}>
                Signature Not Verified
              </div>
              
              <div className="relative flex items-start gap-2 my-1">
                {/* Yellow Question Mark Badge */}
                <div className="flex-shrink-0 w-7 h-9 flex items-center justify-center bg-transparent">
                  <span 
                    className="text-3xl font-extrabold select-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
                    style={{ color: '#facc15' }}
                  >
                    ?
                  </span>
                </div>
                
                <div className="text-[10.5px] leading-tight" style={{ color: '#111827' }}>
                  <div>Digitally Signed by :</div>
                  <div className="font-semibold">District Geologist , PANCHMAHAL</div>
                  <div>{data.passIssuedOn ? `${data.passIssuedOn.split(' ')[0]} 17:48:40+0530` : '27/08/2026 17:48:40+0530'}</div>
                </div>
              </div>

              {/* Bottom Small QR Code */}
              <div className="mt-4 flex flex-col items-center justify-center">
                <QRCodeSVG value={viewUrl} size={45} />
                <div className="text-[8.5px] mt-1 text-center font-medium" style={{ color: '#374151' }}>
                  For GeoMine Application users (CGM Officers) only
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
