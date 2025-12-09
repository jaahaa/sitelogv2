
import React, { useState } from 'react';
import { ManpowerEntry } from '../types';
import { Plus, Trash2, Users } from 'lucide-react';

interface ManpowerInputProps {
  entries: ManpowerEntry[];
  onChange: (entries: ManpowerEntry[]) => void;
}

const TRADES = [
  "General Labourer",
  "Fuser",
  "Density Tester",
  "Oversight",
  "HVAC",
  "Supervisors",
  "Heavy Equipment Operators",
  "TCP Traffic Control",
  "LCT Traffic Control"
];

export const ManpowerInput: React.FC<ManpowerInputProps> = ({ entries, onChange }) => {
  const [selectedTrade, setSelectedTrade] = useState(TRADES[0]);
  const [count, setCount] = useState<string>('1');
  const [hours, setHours] = useState<string>('8');

  const addEntry = () => {
    const newEntry: ManpowerEntry = {
      id: crypto.randomUUID(),
      trade: selectedTrade,
      count: parseInt(count) || 0,
      hours: parseInt(hours) || 0,
    };
    onChange([...entries, newEntry]);
    setCount('1');
  };

  const removeEntry = (id: string) => {
    onChange(entries.filter(e => e.id !== id));
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Users size={20} className="text-brand-600" />
        Manpower Log
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 items-end">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Trade</label>
          <select 
            className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:outline-none text-white"
            value={selectedTrade}
            onChange={(e) => setSelectedTrade(e.target.value)}
          >
            {TRADES.map(t => <option key={t} value={t} className="bg-slate-700 text-white">{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Headcount</label>
          <input 
            type="number" 
            min="1"
            className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:outline-none text-white placeholder-slate-400"
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
        </div>
        <div>
          <button 
            type="button"
            onClick={addEntry}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white p-2.5 rounded-md flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={18} /> Add
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {entries.length === 0 && (
          <div className="text-center py-6 bg-slate-50 rounded border border-dashed border-slate-200">
             <p className="text-sm text-slate-400 italic">No manpower entries added.</p>
          </div>
        )}
        {entries.map((entry) => (
          <div key={entry.id} className="flex justify-between items-center bg-white p-3 rounded border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 text-blue-700 p-2 rounded-full">
                <Users size={16} />
              </div>
              <div>
                <p className="font-medium text-slate-800">{entry.trade}</p>
                <p className="text-slate-500 text-xs">{entry.count} personnel &bull; {entry.hours} hrs</p>
              </div>
            </div>
            <button 
              onClick={() => removeEntry(entry.id)}
              className="text-slate-400 hover:text-red-500 p-2 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
