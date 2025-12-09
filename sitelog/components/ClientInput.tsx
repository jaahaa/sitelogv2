
import React from 'react';
import { User, Building2, ChevronDown } from 'lucide-react';
import { SpeechMic } from './SpeechMic';

interface ClientInputProps {
  clientName: string;
  foreman: string;
  onChange: (field: 'clientName' | 'foreman', value: string) => void;
}

const CONTRACTORS = ["Aecon", "B&B Contracting"];

export const ClientInput: React.FC<ClientInputProps> = ({ clientName, foreman, onChange }) => {
  
  const handleVoiceInput = (field: 'clientName' | 'foreman', text: string) => {
    const currentVal = field === 'clientName' ? clientName : foreman;
    const newValue = currentVal ? `${currentVal} ${text}` : text;
    onChange(field, newValue);
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Building2 size={20} className="text-brand-600" />
        Contractor Team
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Contractor</label>
          <div className="relative">
            <select 
              className="w-full pl-9 pr-10 p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-white appearance-none placeholder-slate-400"
              value={clientName}
              onChange={(e) => onChange('clientName', e.target.value)}
            >
              <option value="" className="bg-slate-700 text-slate-400">Select Contractor...</option>
              {CONTRACTORS.map(c => (
                <option key={c} value={c} className="bg-slate-700 text-white">{c}</option>
              ))}
            </select>
            <User size={16} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
            <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Foreman</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Foreman Name"
              className="w-full pl-2.5 pr-9 p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-500 outline-none text-white placeholder-slate-400"
              value={foreman}
              onChange={(e) => onChange('foreman', e.target.value)}
            />
             <div className="absolute right-1 top-1.5">
               <SpeechMic onTranscript={(text) => handleVoiceInput('foreman', text)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
