
import React, { useState } from 'react';
import { MaterialEntry } from '../types';
import { Plus, Trash2, Package } from 'lucide-react';

interface MaterialsInputProps {
  entries: MaterialEntry[];
  onChange: (entries: MaterialEntry[]) => void;
}

export const MaterialsInput: React.FC<MaterialsInputProps> = ({ entries, onChange }) => {
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');

  const addEntry = () => {
    if (!item || !quantity) return;
    const newEntry: MaterialEntry = {
      id: crypto.randomUUID(),
      item,
      quantity,
      unit: unit || 'pcs',
    };
    onChange([...entries, newEntry]);
    setItem('');
    setQuantity('');
    setUnit('');
  };

  const removeEntry = (id: string) => {
    onChange(entries.filter(e => e.id !== id));
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Package size={20} className="text-brand-600" />
        Materials & Deliveries
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4 items-end">
        <div className="col-span-12 md:col-span-5">
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Item / Material</label>
          <input 
            type="text" 
            placeholder="e.g. 2x4 Lumber"
            className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-500 outline-none text-white placeholder-slate-400"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
        </div>
        <div className="col-span-6 md:col-span-3">
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Quantity</label>
          <input 
            type="text"
            placeholder="0.0" 
            className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-500 outline-none text-white placeholder-slate-400"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="col-span-6 md:col-span-2">
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Unit</label>
          <input 
            type="text" 
            placeholder="pcs"
            className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-500 outline-none text-white placeholder-slate-400"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </div>
        <div className="col-span-12 md:col-span-2">
          <button 
            type="button"
            onClick={addEntry}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white p-2.5 rounded-md flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={18} /> <span className="md:hidden">Add Item</span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {entries.length === 0 && (
          <div className="text-center py-6 bg-slate-50 rounded border border-dashed border-slate-200">
             <p className="text-sm text-slate-400 italic">No materials recorded.</p>
          </div>
        )}
        {entries.map((entry) => (
          <div key={entry.id} className="flex justify-between items-center bg-white p-3 rounded border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 text-orange-700 p-2 rounded-full">
                <Package size={16} />
              </div>
              <div>
                <p className="font-medium text-slate-800">{entry.item}</p>
                <p className="text-slate-500 text-xs">Qty: {entry.quantity} {entry.unit}</p>
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
