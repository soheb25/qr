import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import type { PassDetails } from '../types';
import { FileText, ChevronRight, ShieldCheck } from 'lucide-react';

import { supabase, isSupabaseConfigured } from '../supabase';

export const FormPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<PassDetails>>({
    driver: 'Driver',
    stockistCode: '',
    dcPassNo: '',
    passIssuedOn: new Date().toLocaleString('en-GB'),
    vehicleNo: '',
    carrierType: 'Goods Carrier(HGV)',
    mineralName: '',
    grade: '',
    netWeight: '',
    concessionHolderName: '',
    sourceOfPlace: '',
    nameOfPurchaser: '',
    destinationAddress: '',
    distanceInKm: '',
    journeyStartDate: '',
    journeyEndDate: '',
    expectedJourneyRoute: '',
    journeyDuration: '',
    nameOfCheckPost: '',
    driverName: '',
    driverLicenceNo: '',
    driverMobileNumber: '',
    panNumberGstin: '',
    electronicDeviceDetails: '',
    transporterName: 'SELF',
    buyerMobileNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoDataUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const id = uuidv4();
    const finalData = { ...formData, id } as PassDetails;
    
    // Save to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('passes').insert([finalData]);
        if (error) {
          console.error('Error saving to Supabase:', error.message);
        }
      } catch (err) {
        console.error('Failed to save to Supabase:', err);
      }
    }

    // Save to localStorage as backup
    const existingPasses = JSON.parse(localStorage.getItem('passes') || '[]');
    localStorage.setItem('passes', JSON.stringify([...existingPasses, finalData]));
    
    setLoading(false);
    // Navigate to view page
    navigate(`/view/${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center bg-fixed text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 backdrop-blur-sm bg-black/30 p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
              <ShieldCheck className="w-12 h-12 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Secure DC Pass Generator
          </h1>
          <p className="text-lg text-indigo-200/80 max-w-2xl mx-auto">
            Create authentic, tamper-evident digital passes instantly. Enter the details below to generate a verifiable PDF with integrated QR security.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/10 p-8 sm:p-10 rounded-3xl border border-white/20 shadow-2xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="logoDataUrl" className="block text-sm font-medium text-indigo-100 ml-1">
                Company Logo (Optional)
              </label>
              <input
                type="file"
                id="logoDataUrl"
                accept="image/*"
                onChange={handleLogoUpload}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-sm hover:bg-black/30 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {formData.logoDataUrl && (
                <div className="mt-2">
                  <img src={formData.logoDataUrl} alt="Logo Preview" className="h-16 w-16 object-contain rounded-md bg-white p-1" />
                </div>
              )}
            </div>

            {/* Form Fields mapped */}
            {[
              { name: 'stockistCode', label: 'Stockist Code', type: 'text', placeholder: 'e.g. STML1401023506' },
              { name: 'dcPassNo', label: 'DC Pass No.', type: 'text', placeholder: 'e.g. STML14010235060262001694' },
              { name: 'passIssuedOn', label: 'Pass Issued on', type: 'text', placeholder: 'e.g. 27/08/2026 02:10 PM' },
              { name: 'vehicleNo', label: 'Vehicle No.', type: 'text', placeholder: 'e.g. GJ16AY5874' },
              { name: 'carrierType', label: 'Carrier Type', type: 'text', placeholder: 'e.g. Goods Carrier(HGV)' },
              { name: 'mineralName', label: 'Mineral Name', type: 'text', placeholder: 'e.g. Quartz' },
              { name: 'grade', label: 'Grade', type: 'text', placeholder: 'e.g. 16-30 Mesh' },
              { name: 'netWeight', label: 'Net Weight in MT', type: 'text', placeholder: 'e.g. 34.80 MT' },
              { name: 'concessionHolderName', label: 'Concession Holder Name', type: 'text', placeholder: 'e.g. New Indian Mineral' },
              { name: 'sourceOfPlace', label: 'Source of Place', type: 'text', placeholder: 'e.g. PANCHMAHAL' },
              { name: 'nameOfPurchaser', label: 'Name of Purchaser', type: 'text', placeholder: 'e.g. NATIONAL MINERAL' },
              { name: 'destinationAddress', label: 'Destination Address', type: 'text', placeholder: 'e.g. Pune, Maharashtra' },
              { name: 'distanceInKm', label: 'Distance in Km', type: 'text', placeholder: 'e.g. 801 KM' },
              { name: 'journeyStartDate', label: 'Journey Start Date', type: 'text', placeholder: 'e.g. 27/08/2026 02:08 PM' },
              { name: 'journeyEndDate', label: 'Journey End Date', type: 'text', placeholder: 'e.g. 29/08/2026 02:08 PM' },
              { name: 'journeyDuration', label: 'Journey Duration Time', type: 'text', placeholder: 'e.g. 2 Day(s) 0 Hour(s)' },
              { name: 'driverName', label: 'Driver Name', type: 'text', placeholder: 'e.g. SIRAJ HURI' },
              { name: 'driverLicenceNo', label: 'Driver\'s Licence No.', type: 'text', placeholder: 'e.g. GJ1719930020564' },
              { name: 'driverMobileNumber', label: 'Driver Mobile Number', type: 'text', placeholder: 'e.g. 8799440972' },
              { name: 'panNumberGstin', label: 'PAN Number / GSTIN', type: 'text', placeholder: 'e.g. AALFN4621R' },
              { name: 'electronicDeviceDetails', label: 'GPS Tracking Device Details', type: 'text', placeholder: 'e.g. OBD Can Feature' },
              { name: 'transporterName', label: 'Transporter Name', type: 'text', placeholder: 'e.g. SELF' },
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label htmlFor={field.name} className="block text-sm font-medium text-indigo-100 ml-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-sm hover:bg-black/30"
                  required
                />
              </div>
            ))}

          </div>

          <div className="pt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full group relative flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 -translate-x-full z-0"></div>
              <FileText className="w-6 h-6 z-10" />
              <span className="z-10">{loading ? 'Saving to Database...' : 'Generate Secure Pass'}</span>
              <ChevronRight className="w-5 h-5 z-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
