
import React, { useState, useEffect } from 'react';
import { Report, ManpowerEntry, ChecklistItem } from '../types';
import { ClientInput } from './ClientInput';
import { ManpowerInput } from './ManpowerInput';
import { JobChecklist } from './JobChecklist';
import { PhotoInput } from './PhotoInput';
import { SignatureInput } from './SignatureInput';
import { SpeechMic } from './SpeechMic';
import { polishNotes, generateReportSummary, identifyLocation } from '../services/geminiService';
import { Save, ArrowLeft, Wand2, Loader2, Calendar, FileText, ChevronDown, MapPin, ExternalLink } from 'lucide-react';

interface EditorProps {
  report: Report | null;
  onSave: (report: Report) => void;
  onCancel: () => void;
}

const WEATHER_OPTIONS = [
  "Sunny",
  "Partly Cloudy",
  "Cloudy",
  "Overcast",
  "Light Rain",
  "Heavy Rain",
  "Thunderstorm",
  "Snow",
  "Sleet",
  "Foggy",
  "Windy",
  "Clear Night"
];

const CITIES = [
  "Abbotsford",
  "Agassiz",
  "Burnaby",
  "Chilliwack",
  "Coquitlam",
  "Delta",
  "Hope",
  "Langley",
  "Maple Ridge",
  "Mission",
  "New Westminster",
  "North Vancouver",
  "Pitt Meadows",
  "Port Coquitlam",
  "Port Moody",
  "Richmond",
  "Squamish",
  "Surrey",
  "Vancouver",
  "West Vancouver",
  "Whistler",
  "White Rock"
];

// Generate range from -35 to 45 degrees Celsius
const MIN_TEMP = -35;
const MAX_TEMP = 45;
const TEMP_OPTIONS = Array.from(
  { length: MAX_TEMP - MIN_TEMP + 1 }, 
  (_, i) => i + MIN_TEMP
);

const Editor: React.FC<EditorProps> = ({ report, onSave, onCancel }) => {
  // State initialization
  const [formData, setFormData] = useState<Report>({
    id: report?.id || crypto.randomUUID(),
    projectName: report?.projectName || '',
    projectNumber: report?.projectNumber || '',
    clientName: report?.clientName || '',
    foreman: report?.foreman || '',
    propertyAddress: report?.propertyAddress || '',
    location: report?.location || 'Abbotsford',
    date: report?.date || new Date().toLocaleDateString(),
    status: report?.status || 'draft',
    weather: report?.weather || { condition: 'Sunny', temp: '20°C' },
    manpower: report?.manpower || [],
    checklist: report?.checklist || [],
    notes: report?.notes || '',
    incidents: report?.incidents || '',
    summary: report?.summary || '',
    photos: report?.photos || [],
    signature: report?.signature || null,
  });

  const [isPolishing, setIsPolishing] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [groundingUrl, setGroundingUrl] = useState<string | null>(null);

  const updateField = (field: keyof Report, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: 'weather', key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [key]: value }
    }));
  };

  const handlePolishNotes = async () => {
    if (!formData.notes) return;
    setIsPolishing(true);
    const polished = await polishNotes(formData.notes);
    updateField('notes', polished);
    setIsPolishing(false);
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    const summary = await generateReportSummary(formData);
    updateField('summary', summary);
    setIsGeneratingSummary(false);
  };

  const handleSubmit = (status: 'draft' | 'completed') => {
    onSave({ ...formData, status, lastModified: Date.now() });
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setGroundingUrl(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const result = await identifyLocation(latitude, longitude);
          if (result.address) {
            updateField('propertyAddress', result.address);
          }
          if (result.mapLink) {
            setGroundingUrl(result.mapLink);
          }
        } catch (error) {
          console.error("Failed to identify location", error);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error", error);
        alert("Unable to retrieve location. Please check permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-800">
          {report ? 'Edit Report' : 'New Report'}
        </h1>
        <button 
          onClick={() => handleSubmit('draft')}
          className="text-brand-600 font-bold px-3 py-1.5 rounded-md hover:bg-brand-50 transition-colors"
        >
          Save
        </button>
      </div>

      <div className="space-y-6">
        {/* Project Info Section */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
           <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
             <FileText size={20} className="text-brand-600" />
             Project Details
           </h3>
           <div className="space-y-4">
             {/* Row 1: Name and Number (Flex for side-by-side with fixed job # width) */}
             <div className="flex gap-4">
               <div className="flex-1">
                 <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Project Name</label>
                 <input 
                   className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-500 outline-none text-white"
                   placeholder="e.g. Downtown Renovations"
                   value={formData.projectName}
                   onChange={(e) => updateField('projectName', e.target.value)}
                 />
               </div>
               <div className="w-36 shrink-0">
                 <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Job Number</label>
                 <input 
                   className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-500 outline-none text-white"
                   placeholder="e.g. 10023"
                   value={formData.projectNumber}
                   onChange={(e) => updateField('projectNumber', e.target.value)}
                 />
               </div>
             </div>

             {/* Row 2: Date and Location (Always Side-by-Side) */}
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Date</label>
                 <div className="relative">
                   <input 
                     type="date"
                     className="w-full pl-9 p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-500 outline-none text-white appearance-none"
                     value={formData.date.split('T')[0]} 
                     onChange={(e) => updateField('date', e.target.value)}
                   />
                   <Calendar size={16} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Location</label>
                 <div className="relative">
                   <select 
                     className="w-full pl-9 pr-8 p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-500 outline-none text-white appearance-none"
                     value={formData.location}
                     onChange={(e) => updateField('location', e.target.value)}
                   >
                     {CITIES.map(city => (
                       <option key={city} value={city} className="bg-slate-700 text-white">{city}</option>
                     ))}
                   </select>
                   <MapPin size={16} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                   <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                 </div>
               </div>
             </div>
             
             {/* Row 3: Weather */}
             <div className="flex gap-2">
               <div className="flex-1">
                 <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Weather Condition</label>
                 <div className="relative">
                   <select 
                     className="w-full pl-2.5 pr-8 p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-500 outline-none text-white appearance-none"
                     value={formData.weather.condition}
                     onChange={(e) => updateNestedField('weather', 'condition', e.target.value)}
                   >
                     {WEATHER_OPTIONS.map(opt => (
                       <option key={opt} value={opt} className="bg-slate-700 text-white">{opt}</option>
                     ))}
                   </select>
                   <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                 </div>
               </div>
               <div className="w-1/3">
                 <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Temp</label>
                 <div className="relative">
                    <select 
                      className="w-full pl-2.5 pr-8 p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-500 outline-none text-white appearance-none"
                      value={formData.weather.temp.replace('°C', '')} 
                      onChange={(e) => updateNestedField('weather', 'temp', `${e.target.value}°C`)}
                    >
                      {TEMP_OPTIONS.map(t => (
                        <option key={t} value={t} className="bg-slate-700 text-white">{t}°C</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                 </div>
               </div>
             </div>

             {/* Row 4: Property Address (Moved from ClientInput) */}
             <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Property Address</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="e.g. 123 Industrial Way"
                    className="w-full pl-10 pr-10 p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-white placeholder-slate-400"
                    value={formData.propertyAddress}
                    onChange={(e) => updateField('propertyAddress', e.target.value)}
                  />
                  <button 
                    onClick={handleLocate}
                    disabled={isLocating}
                    className="absolute left-1 top-1 p-2 text-slate-400 hover:text-brand-500 disabled:opacity-70 transition-colors"
                    title="Locate Address with Google Maps"
                  >
                    {isLocating ? (
                      <Loader2 size={16} className="animate-spin text-brand-500" />
                    ) : (
                      <MapPin size={16} />
                    )}
                  </button>
                  <div className="absolute right-2 top-1.5">
                    <SpeechMic onTranscript={(text) => updateField('propertyAddress', formData.propertyAddress ? `${formData.propertyAddress} ${text}` : text)} />
                  </div>
                </div>
                
                {groundingUrl && (
                  <a 
                    href={groundingUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline"
                  >
                    <MapPin size={12} className="fill-current" />
                    Verified on Google Maps
                    <ExternalLink size={10} />
                  </a>
                )}

                {/* Embedded Map Visual */}
                {formData.propertyAddress && (
                  <div className="mt-2 w-full h-32 rounded-md border border-slate-200 overflow-hidden shadow-inner bg-slate-100 relative">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(formData.propertyAddress)}&output=embed`}
                      allowFullScreen
                      loading="lazy"
                      title="Property Location Map"
                    ></iframe>
                  </div>
                )}
             </div>

           </div>
        </div>

        <ClientInput 
          clientName={formData.clientName}
          foreman={formData.foreman}
          onChange={(field, val) => updateField(field, val)}
        />

        <JobChecklist 
          items={formData.checklist}
          onChange={(items) => updateField('checklist', items)}
        />

        <ManpowerInput 
          entries={formData.manpower}
          onChange={(entries) => updateField('manpower', entries)}
        />

        {/* Notes Section with AI */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-slate-800">Site Notes</h3>
             <button 
               onClick={handlePolishNotes}
               disabled={isPolishing || !formData.notes}
               className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-bold flex items-center gap-1 hover:bg-indigo-100 transition-colors disabled:opacity-50"
             >
               {isPolishing ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
               AI Polish
             </button>
          </div>
          <div className="relative">
             <textarea 
               className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none text-slate-800"
               placeholder="Record site conditions, delays, or general observations..."
               value={formData.notes}
               onChange={(e) => updateField('notes', e.target.value)}
             />
             <div className="absolute right-2 bottom-2">
               <SpeechMic onTranscript={(text) => updateField('notes', formData.notes ? `${formData.notes} ${text}` : text)} />
             </div>
          </div>
        </div>
        
        {/* Incidents Section */}
         <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
           <h3 className="text-lg font-bold text-red-700 mb-4">Incidents / Issues</h3>
           <textarea 
               className="w-full h-24 p-3 bg-red-50 border border-red-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none resize-none text-slate-800 placeholder-red-300"
               placeholder="Describe any safety incidents, accidents, or major blockers..."
               value={formData.incidents}
               onChange={(e) => updateField('incidents', e.target.value)}
             />
         </div>

        <PhotoInput 
          photos={formData.photos}
          onChange={(photos) => updateField('photos', photos)}
        />

        {/* AI Summary Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-lg shadow-sm border border-indigo-100">
           <div className="flex justify-between items-center mb-3">
             <h3 className="text-lg font-bold text-indigo-900">Executive Summary</h3>
             <button 
               onClick={handleGenerateSummary}
               disabled={isGeneratingSummary}
               className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full font-bold flex items-center gap-1 hover:bg-indigo-700 transition-colors disabled:opacity-70"
             >
               {isGeneratingSummary ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
               Generate with AI
             </button>
          </div>
          <textarea 
             className="w-full h-24 p-3 bg-white/60 border border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-slate-800 text-sm"
             placeholder="Auto-generated summary of work completed..."
             value={formData.summary}
             onChange={(e) => updateField('summary', e.target.value)}
           />
        </div>

        <SignatureInput 
          signature={formData.signature}
          onSave={(sig) => updateField('signature', sig)}
        />
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 max-w-5xl mx-auto">
        <span className="text-xs text-slate-400 hidden sm:block">
           Last saved: {new Date().toLocaleTimeString()}
        </span>
        <div className="flex w-full sm:w-auto gap-3">
           <button 
             onClick={() => handleSubmit('draft')}
             className="flex-1 sm:flex-none px-6 py-3 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition-colors"
           >
             Save Draft
           </button>
           <button 
             onClick={() => handleSubmit('completed')}
             className="flex-1 sm:flex-none px-8 py-3 rounded-lg font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2"
           >
             <Save size={18} /> Complete
           </button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
