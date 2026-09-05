import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import type { PassDetails } from '../types';
import { FileText, ChevronRight, ShieldCheck, LogOut, Lock, CheckCircle2 } from 'lucide-react';
import { authService } from '../utils/auth';
import { supabase, isSupabaseConfigured } from '../supabase';
import { CGM_LOGO_BASE64 } from '../assets/cgmLogo';

export const FormPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const currentUser = authService.getCurrentUser() || 'newindian2345@gmail.com';

  const [formData, setFormData] = useState<Partial<PassDetails>>({
    driver: 'Driver',
    stockistCode: 'STML1401023506',
    dcPassNo: 'STML14010235060262001604',
    passIssuedOn: '27/08/2026 02:10 PM',
    vehicleNo: 'GJ16AY5874',
    carrierType: 'Goods Carrier(HGV)',
    mineralName: 'Quartz',
    grade: '16-30 Mesh',
    netWeight: '34.80 (Thirty Four point Eight Zero Zero ) MT',
    concessionHolderName: 'New Indian Mineral_Bhamaiya',
    sourceOfPlace: 'PANCHMAHAL/GODHRA /Bhamaiya',
    nameOfPurchaser: 'NATIONAL MINERAL',
    destinationAddress: '- Maharashtra/Pune/Pune City/NATIONAL MINERAL/PUNE MAHARATRSA',
    distanceInKm: '801 KM',
    journeyStartDate: '27/08/2026 02:08 PM',
    journeyEndDate: '29/08/2026 02:08 PM',
    expectedJourneyRoute: '',
    journeyDuration: '2 Day(s) 0 Hour(s) 0 Minute(s)',
    nameOfCheckPost: '',
    driverName: 'SIRAJ HURI',
    driverLicenceNo: 'GJ1719930020564',
    driverMobileNumber: '8799440972',
    panNumberGstin: 'AALFN4621R / 24AALFN4621R1ZS',
    electronicDeviceDetails: 'wastoo / MaaAAshish / Prithivi-140+ OBD Can Feature',
    transporterName: 'SELF',
    buyerMobileNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
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
    navigate(`/view/${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top User Session Navigation Bar */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white p-1 flex items-center justify-center shadow-md">
              <img src={CGM_LOGO_BASE64} alt="CGM Seal" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-white">{currentUser}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" />
                  Authorized
                </span>
              </div>
              <p className="text-xs text-indigo-200/70">Commissioner of Geology & Mining Gujarat</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 rounded-xl text-xs font-bold transition-all hover:scale-105 cursor-pointer"
            title="Sign out of DC Pass Generator"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Portal Header */}
        <div className="text-center backdrop-blur-sm bg-black/30 p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
              <ShieldCheck className="w-10 h-10 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-cyan-300">
            Secure DC Pass Generator
          </h1>
          <p className="text-sm text-indigo-200/80 max-w-xl mx-auto">
            Fill in the details below to generate the official Government of Gujarat DC Pass with integrated QR security.
          </p>
        </div>

        {/* Pass Generation Form */}
        <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/10 p-6 sm:p-10 rounded-3xl border border-white/20 shadow-2xl space-y-6">
          
          {/* Fixed Logo Banner */}
          <div className="bg-indigo-950/50 border border-indigo-500/30 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white p-1.5 shadow-md flex-shrink-0 flex items-center justify-center">
              <img src={CGM_LOGO_BASE64} alt="Official CGM Emblem" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                Official Gujarat State CGM Seal (Fixed)
              </div>
              <p className="text-xs text-indigo-200/80 mt-0.5">
                The official circular seal of the Commissioner of Geology and Mining is automatically embedded on every generated pass as per statutory guidelines.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Form Fields mapped */}
            {[
              { name: 'driver', label: 'Copy For', type: 'text', placeholder: 'Driver' },
              { name: 'stockistCode', label: 'Stockist Code', type: 'text', placeholder: 'e.g. STML1401023506' },
              { name: 'dcPassNo', label: 'DC Pass No.', type: 'text', placeholder: 'e.g. STML14010235060262001604' },
              { name: 'passIssuedOn', label: 'Pass Issued on', type: 'text', placeholder: 'e.g. 27/08/2026 02:10 PM' },
              { name: 'vehicleNo', label: 'Vehicle No.', type: 'text', placeholder: 'e.g. GJ16AY5874' },
              { name: 'carrierType', label: 'Carrier Type', type: 'text', placeholder: 'e.g. Goods Carrier(HGV)' },
              { name: 'mineralName', label: 'Mineral Name', type: 'text', placeholder: 'e.g. Quartz' },
              { name: 'grade', label: 'Grade', type: 'text', placeholder: 'e.g. 16-30 Mesh' },
              { name: 'netWeight', label: 'Net Weight in MT', type: 'text', placeholder: 'e.g. 34.80 MT' },
              { name: 'concessionHolderName', label: 'Concession Holder Name', type: 'text', placeholder: 'e.g. New Indian Mineral' },
              { name: 'sourceOfPlace', label: 'Source of Place', type: 'text', placeholder: 'e.g. PANCHMAHAL/GODHRA /Bhamaiya' },
              { name: 'nameOfPurchaser', label: 'Name of Purchaser', type: 'text', placeholder: 'e.g. NATIONAL MINERAL' },
              { name: 'destinationAddress', label: 'Destination Address', type: 'text', placeholder: 'e.g. Pune, Maharashtra' },
              { name: 'distanceInKm', label: 'Distance in Km', type: 'text', placeholder: 'e.g. 801 KM' },
              { name: 'journeyStartDate', label: 'Journey Start Date', type: 'text', placeholder: 'e.g. 27/08/2026 02:08 PM' },
              { name: 'journeyEndDate', label: 'Journey End Date', type: 'text', placeholder: 'e.g. 29/08/2026 02:08 PM' },
              { name: 'expectedJourneyRoute', label: 'Expected Journey Route', type: 'text', placeholder: 'Leave blank for -' },
              { name: 'journeyDuration', label: 'Journey Duration Time', type: 'text', placeholder: 'e.g. 2 Day(s) 0 Hour(s)' },
              { name: 'nameOfCheckPost', label: 'Name of Check Post in Route', type: 'text', placeholder: 'Leave blank for -' },
              { name: 'driverName', label: 'Driver Name', type: 'text', placeholder: 'e.g. SIRAJ HURI' },
              { name: 'driverLicenceNo', label: "Driver's Licence No.", type: 'text', placeholder: 'e.g. GJ1719930020564' },
              { name: 'driverMobileNumber', label: 'Driver Mobile Number', type: 'text', placeholder: 'e.g. 8799440972' },
              { name: 'panNumberGstin', label: 'PAN Number / GSTIN', type: 'text', placeholder: 'e.g. AALFN4621R' },
              { name: 'electronicDeviceDetails', label: 'GPS Tracking Device Details', type: 'text', placeholder: 'e.g. OBD Can Feature' },
              { name: 'transporterName', label: 'Transporter Name', type: 'text', placeholder: 'e.g. SELF' },
              { name: 'buyerMobileNumber', label: 'Buyer Mobile Number', type: 'text', placeholder: 'Leave blank for -' },
            ].map((field) => (
              <div key={field.name} className="space-y-1.5">
                <label htmlFor={field.name} className="block text-xs font-semibold uppercase tracking-wider text-indigo-200 ml-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={(formData as any)[field.name] || ''}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-sm hover:bg-black/40 text-sm"
                />
              </div>
            ))}

          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full group relative flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg text-base sm:text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 overflow-hidden transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <FileText className="w-5 h-5" />
              <span>{loading ? 'Generating Pass...' : 'Generate & View Official DC Pass'}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
