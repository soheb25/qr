import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { PassDetails } from '../types';
import { CGM_LOGO_BASE64 } from '../assets/cgmLogo';

interface Props {
  data: PassDetails;
  viewUrl: string;
}

// Helper function to render '-' when field is blank, empty or null
const fmt = (val: any): React.ReactNode => {
  if (val === null || val === undefined) return '-';
  if (typeof val === 'string') {
    const s = val.trim();
    if (!s || s.toLowerCase() === 'null' || s.toLowerCase() === 'undefined') return '-';
    return s;
  }
  return val || '-';
};

// Helper to extract District name for digital signature
const getDistrict = (source?: string): string => {
  if (!source) return 'PANCHMAHAL';
  const parts = source.split('/');
  const candidate = parts[0]?.trim();
  return candidate || 'PANCHMAHAL';
};

// Helper for digital signature timestamp
const getSignatureDate = (dateStr?: string): string => {
  if (!dateStr) return '27/08/2026 17:48:40+0530';
  const parts = dateStr.trim().split(' ');
  const datePart = parts[0] || '27/08/2026';
  return `${datePart} 17:48:40+0530`;
};

export const PassTemplate: React.FC<Props> = ({ data, viewUrl }) => {
  // Ordered rows for Section 1 (Rows 1 to 21)
  const section1Rows = [
    { label: 'Copy For:', value: data.driver || 'Driver' },
    { label: 'Stockist Code', value: fmt(data.stockistCode) },
    { label: 'DC Pass No.', value: fmt(data.dcPassNo) },
    { label: 'Pass Issued on', value: fmt(data.passIssuedOn) },
    { 
      label: 'QR Code', 
      value: (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3px 0' }}>
          <QRCodeSVG value={viewUrl} size={106} />
        </div>
      ),
      isQr: true
    },
    { 
      label: 'Vehicle No. / (Carrier) Type', 
      value: [data.vehicleNo, data.carrierType].filter(Boolean).join(' / ') || '-'
    },
    { 
      label: 'Mineral Name - Grade', 
      value: (data.mineralName && data.grade ? `${data.mineralName} (${data.grade})` : data.mineralName || data.grade) || '-'
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
    { label: "Driver's Licence No.", value: fmt(data.driverLicenceNo) },
    { label: 'Driver Mobile Number', value: fmt(data.driverMobileNumber) },
  ];

  // Ordered rows for Section 2 (Rows 22 to 25)
  const section2Rows = [
    { label: 'PAN Number / GSTIN', value: fmt(data.panNumberGstin) },
    { label: 'Electronic Identification Device ( GPS Tracking Device) Details', value: fmt(data.electronicDeviceDetails) },
    { label: 'Transporter Name', value: fmt(data.transporterName) },
    { label: 'Buyer Mobile Number', value: fmt(data.buyerMobileNumber) },
  ];

  return (
    <div 
      id="pass-template-container"
      style={{
        width: '794px',
        minWidth: '794px',
        maxWidth: '794px',
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '16px',
        boxSizing: 'border-box',
        margin: '0 auto',
        fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact'
      }}
    >
      {/* Outer Border Box enclosing all sections */}
      <div 
        style={{ 
          width: '762px', 
          border: '1.5px solid #000000', 
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          backgroundColor: '#ffffff'
        }}
      >
        {/* ========================================================================= */}
        {/* SECTION 1: Top Header & Rows 1 to 21 + Instructions (1) to (4)           */}
        {/* ========================================================================= */}
        <div 
          style={{ 
            display: 'flex', 
            width: '100%', 
            borderBottom: '1.5px solid #000000',
            boxSizing: 'border-box'
          }}
        >
          {/* Section 1 Left: Header (Logo + Titles) & Rows 1 to 21 (472px) */}
          <div 
            style={{ 
              width: '472px', 
              borderRight: '1.5px solid #000000', 
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header Row: Logo (226px) + Department Titles (246px) */}
            <div 
              style={{ 
                display: 'flex', 
                borderBottom: '1px solid #000000',
                boxSizing: 'border-box',
                height: '76px'
              }}
            >
              {/* Column 1: Fixed Official CGM Gujarat Logo */}
              <div 
                style={{ 
                  width: '226px', 
                  flexShrink: 0,
                  borderRight: '1px solid #000000', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: '3px',
                  boxSizing: 'border-box',
                  backgroundColor: '#ffffff'
                }}
              >
                <img 
                  src={CGM_LOGO_BASE64} 
                  alt="Commissioner of Geology & Mining Gujarat" 
                  style={{ width: '68px', height: '68px', objectFit: 'contain', display: 'block' }} 
                />
              </div>

              {/* Column 2: Cyan Banner + Department Titles */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                {/* Cyan Header Banner */}
                <div 
                  style={{ 
                    height: '25px', 
                    backgroundColor: '#add8e6', 
                    color: '#000000', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 'bold', 
                    fontSize: '11.5px', 
                    borderBottom: '1px solid #000000',
                    boxSizing: 'border-box'
                  }}
                >
                  QR Code based - DC Pass
                </div>
                {/* Department Titles */}
                <div 
                  style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    padding: '2px 4px',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ fontSize: '11.5px', fontWeight: 'bold', lineHeight: '1.25' }}>
                    Commissioner of Geology and Mining
                  </div>
                  <div style={{ fontSize: '10.5px', fontWeight: 'bold', lineHeight: '1.25' }}>
                    Industries and Mines Department
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: 'bold', lineHeight: '1.25' }}>
                    (Government of Gujarat)
                  </div>
                </div>
              </div>
            </div>

            {/* Rows 1 to 21 */}
            {section1Rows.map((row, idx) => (
              <div 
                key={idx}
                style={{ 
                  display: 'flex', 
                  width: '100%',
                  borderBottom: idx === section1Rows.length - 1 ? 'none' : '1px solid #000000',
                  boxSizing: 'border-box',
                  minHeight: row.isQr ? '112px' : '20px'
                }}
              >
                {/* Row Label (Column 1: 226px) */}
                <div 
                  style={{ 
                    width: '226px', 
                    flexShrink: 0,
                    borderRight: '1px solid #000000', 
                    padding: '2.5px 6px', 
                    fontWeight: 'bold', 
                    fontSize: '9.5px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: '#000000',
                    lineHeight: '1.25',
                    boxSizing: 'border-box'
                  }}
                >
                  {row.label}
                </div>

                {/* Row Value (Column 2: 246px) */}
                <div 
                  style={{ 
                    flex: 1,
                    padding: '2.5px 6px', 
                    fontSize: '9.5px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: '#000000', 
                    wordBreak: 'break-word',
                    lineHeight: '1.25',
                    boxSizing: 'border-box'
                  }}
                >
                  {row.value}
                </div>
              </div>
            ))}
          </div>

          {/* Section 1 Right: Column 3 Instructions (290px) */}
          <div 
            style={{ 
              width: '290px', 
              boxSizing: 'border-box',
              display: 'flex', 
              flexDirection: 'column', 
              backgroundColor: '#ffffff'
            }}
          >
            {/* Header Banner: અગત્યની સુચનાઓ */}
            <div 
              style={{ 
                height: '25px', 
                backgroundColor: '#ffffff', 
                borderBottom: '1px solid #000000', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 'bold', 
                fontSize: '12.5px',
                color: '#000000',
                boxSizing: 'border-box'
              }}
            >
              અગત્યની સુચનાઓ
            </div>

            {/* Instructions List (spans Rows 1 to 21 cleanly with natural paragraph spacing) */}
            <div 
              style={{ 
                padding: '7px 8px', 
                color: '#000000',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {/* Instruction 1 */}
              <div>
                <div style={{ fontSize: '9.5px', fontWeight: 'bold', lineHeight: '1.3' }}>
                  (1) દરેક વાહન ચાલકે ડીસી પાસની ડીજીટલ સીગ્નેચર વેલીડ કોપીની પ્રીન્ટ આઉટ સાથે રાખવાની રહેશે. આ ઉપરાંત ડીસી પાસની કોપી પીડીએફ સ્વરૂપે ડાઉનલોડ અથવા મોબાઈલ માં ઓપન કરી પોતાની સાથે મુસાફરી દરમિયાન અવશ્ય રાખવાની રહેશે.
                </div>
                <div style={{ fontSize: '9px', lineHeight: '1.25', marginTop: '2px', color: '#111827' }}>
                  Every vehicle driver will have to carry a printout of the digitally signed valid copy of the DC Pass. In addition, a copy of the DC Pass must be downloaded in PDF format or opened on the mobile and kept with him during the journey.
                </div>
              </div>

              {/* Instruction 2 */}
              <div>
                <div style={{ fontSize: '9.5px', fontWeight: 'bold', lineHeight: '1.3' }}>
                  (2) દરેક વાહન ચાલકે ડીસી પાસ માં દર્શાવ્યા મુજબના રૂટ ઉપર જ મુસાફરી કરવાની રહેશે અને ડીસી પાસમાં દર્શાવેલ સ્થળ ઉપર જ ખનીજ પહોંચાડવાનું રહેશે.
                </div>
                <div style={{ fontSize: '9px', lineHeight: '1.25', marginTop: '2px', color: '#111827' }}>
                  Every vehicle driver will have to travel only on the route mentioned in the DC pass and will have to deliver the minerals only to the place mentioned in the DC pass.
                </div>
              </div>

              {/* Instruction 3 */}
              <div>
                <div style={{ fontSize: '9.5px', fontWeight: 'bold', lineHeight: '1.3' }}>
                  (3) મુસાફરી દરમિયાન જો કોઈ અધિકારી ડીસી પાસ ચેક કરવા માંગે તો પોતાના મોબાઈલમાં આવેલ મેસેજ બતાવવાનો રહેશે જેમાં મેસેજ નું હેડર અથવા સેન્ડર આઇડી CGMGUJ છે તેવું બતાવવાનું રહેશે. ડ્રાઇવરે ચેકિંગ અધિકારીને સ્કેનિંગ માટે પોતાના મોબાઈલમાંથી QR કોડ પણ બતાવવો પડશે. ચેકિંગ કરનાર અધિકારી સ્વતંત્ર રીતે પોતાના મોબાઈલથી આ QR કોડને સ્કેન કરી અને ડીસી પાસની ખરાઈ કરી શકશે.
                </div>
                <div style={{ fontSize: '9px', lineHeight: '1.25', marginTop: '2px', color: '#111827' }}>
                  If an officer wants to check the DC pass during travel, driver will have to show the message received on driver's mobile in which the header or sender ID of the message is CGMGUJ. Driver must have to show the QR Code from his mobile for scanning purpose to the checking officer. The checking officer can also independently scan this QR code with his mobile and verify the DC pass.
                </div>
              </div>

              {/* Instruction 4 */}
              <div>
                <div style={{ fontSize: '9.5px', fontWeight: 'bold', lineHeight: '1.3' }}>
                  (4) આ PDF ડાઉનલોડ સમયે ડિજિટલ સહી કરવામાં આવે છે. સહીની તારીખ/સમય પાસ જારી કરવાના સમય તથા અન્ય નકલો કરતાં અલગ હોઈ શકે છે.
                </div>
                <div style={{ fontSize: '9px', lineHeight: '1.25', marginTop: '2px', color: '#111827' }}>
                  This PDF is digitally signed at the time of download. The signature date/time may differ from the pass issue date/time and other copies of this PDF.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: Rows 22 to 25 + Digital Signature Box                         */}
        {/* Note: Divided from Section 1 by the continuous horizontal line at Row 22  */}
        {/* ========================================================================= */}
        <div 
          style={{ 
            display: 'flex', 
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {/* Section 2 Left: Rows 22 to 25 (472px) */}
          <div 
            style={{ 
              width: '472px', 
              borderRight: '1.5px solid #000000', 
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {section2Rows.map((row, idx) => (
              <div 
                key={idx}
                style={{ 
                  display: 'flex', 
                  width: '100%',
                  borderBottom: '1px solid #000000',
                  boxSizing: 'border-box',
                  minHeight: '20px'
                }}
              >
                {/* Row Label (Column 1: 226px) */}
                <div 
                  style={{ 
                    width: '226px', 
                    flexShrink: 0,
                    borderRight: '1px solid #000000', 
                    padding: '2.5px 6px', 
                    fontWeight: 'bold', 
                    fontSize: '9.5px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: '#000000',
                    lineHeight: '1.25',
                    boxSizing: 'border-box'
                  }}
                >
                  {row.label}
                </div>

                {/* Row Value (Column 2: 246px) */}
                <div 
                  style={{ 
                    flex: 1,
                    padding: '2.5px 6px', 
                    fontSize: '9.5px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: '#000000', 
                    wordBreak: 'break-word',
                    lineHeight: '1.25',
                    boxSizing: 'border-box'
                  }}
                >
                  {row.value}
                </div>
              </div>
            ))}
          </div>

          {/* Section 2 Right: Digital Signature Box (290px) */}
          <div 
            style={{ 
              width: '290px', 
              padding: '6px 8px', 
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '11px', color: '#000000', marginBottom: '4px' }}>
              Signature Not Verified
            </div>
            
            {/* Yellow Acrobat-style question mark badge + Signer details */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                style={{ 
                  width: '24px', 
                  height: '32px', 
                  border: '2px solid #ca8a04', 
                  backgroundColor: '#fef08a', 
                  borderRadius: '2px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <span style={{ fontSize: '20px', fontWeight: '900', color: '#ca8a04', lineHeight: 1 }}>
                  ?
                </span>
              </div>
              
              <div style={{ fontSize: '9px', lineHeight: '1.25', color: '#000000' }}>
                <div>Digitally Signed by : </div>
                <div style={{ fontWeight: 'bold' }}>
                  District Geologist , {getDistrict(data.sourceOfPlace)}
                </div>
                <div>{getSignatureDate(data.passIssuedOn)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: Bottom Footer (Below Row 25)                                  */}
        {/* Note: Vertical divider terminates above; full width footer               */}
        {/* ========================================================================= */}
        <div 
          style={{ 
            display: 'flex', 
            width: '100%', 
            minHeight: '76px',
            backgroundColor: '#ffffff',
            boxSizing: 'border-box'
          }}
        >
          {/* Left blank footer area (472px) */}
          <div style={{ width: '472px', boxSizing: 'border-box' }} />

          {/* Right footer area with Officer QR code (290px) */}
          <div 
            style={{ 
              width: '290px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '6px 0',
              boxSizing: 'border-box'
            }}
          >
            <QRCodeSVG value={viewUrl} size={46} />
            <div style={{ fontSize: '7.5px', marginTop: '3px', textAlign: 'center', fontWeight: '500', color: '#374151' }}>
              For GeoMine Application users (CGM Officers) only
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
