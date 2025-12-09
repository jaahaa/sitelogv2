
import React, { useState } from 'react';
import { ChecklistItem } from '../types';
import { Plus, Trash2, CheckSquare, Check, ListChecks } from 'lucide-react';
import { SpeechMic } from './SpeechMic';

interface JobChecklistProps {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
}

const COMMON_TASKS = [
  "Construction drawings",
  "Crew Truck",
  "Dig Variance",
  "ERP- IE muster, extinguisher",
  "Environmental Plan",
  "Environmental Practices",
  "Excavating - Trench Detail",
  "FUD's package",
  "Final Paving",
  "Final Walkthrough",
  "Fusions",
  "PPE Compliance Check",
  "Permit Verification",
  "Pre-Con Meeting",
  "Site Condition",
  "Spill Kit",
  "Temporary Paving",
  "Workplan and Job Hazard Analysis"
];

export const JobChecklist: React.FC<JobChecklistProps> = ({ items, onChange }) => {
  const [taskInput, setTaskInput] = useState('');

  const addTask = () => {
    if (!taskInput.trim()) return;
    const newTask: ChecklistItem = {
      id: crypto.randomUUID(),
      task: taskInput,
      completed: false,
    };
    onChange([...items, newTask]);
    setTaskInput('');
  };

  const removeTask = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const toggleTask = (id: string) => {
    onChange(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleVoiceInput = (text: string) => {
    setTaskInput(prev => prev ? `${prev} ${text}` : text);
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTaskInput(e.target.value);
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <CheckSquare size={20} className="text-brand-600" />
        Job Checklist
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4 items-end">
        {/* Preset Select */}
        <div className="col-span-12 md:col-span-4">
           <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Quick Presets</label>
           <div className="relative">
              <select 
                onChange={handlePresetChange}
                value="" 
                className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-500 focus:outline-none text-white appearance-none cursor-pointer"
              >
                <option value="" disabled>Select a common task...</option>
                {COMMON_TASKS.map(task => (
                    <option key={task} value={task} className="bg-slate-700 text-white">{task}</option>
                ))}
              </select>
               <div className="absolute right-3 top-3 pointer-events-none text-slate-400">
                  <ListChecks size={16} />
               </div>
           </div>
        </div>

        {/* Task Input */}
        <div className="col-span-12 md:col-span-6">
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Task Description</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Enter task details..."
              className="w-full pl-3 pr-10 p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-500 outline-none text-white placeholder-slate-400"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <div className="absolute right-2 top-1.5">
               <SpeechMic onTranscript={handleVoiceInput} />
            </div>
          </div>
        </div>

        {/* Add Button */}
        <div className="col-span-12 md:col-span-2">
          <button 
            type="button"
            onClick={addTask}
            disabled={!taskInput}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white p-2.5 rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Plus size={18} /> <span className="md:hidden">Add Task</span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {items.length === 0 && (
          <div className="text-center py-6 bg-slate-50 rounded border border-dashed border-slate-200">
            <p className="text-sm text-slate-400 italic">No checklist items added.</p>
          </div>
        )}
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`flex justify-between items-center p-3 rounded border transition-colors ${item.completed ? 'bg-brand-50 border-brand-200' : 'bg-white border-slate-200'}`}
          >
            <div 
              className="flex items-center gap-3 flex-1 cursor-pointer"
              onClick={() => toggleTask(item.id)}
            >
              <div className={`shrink-0 w-6 h-6 rounded flex items-center justify-center border transition-colors ${item.completed ? 'bg-brand-500 border-brand-500 text-white' : 'bg-white border-slate-300 text-transparent hover:border-brand-400'}`}>
                <Check size={14} strokeWidth={3} />
              </div>
              <span className={`font-medium ${item.completed ? 'text-brand-800 line-through decoration-brand-300' : 'text-slate-800'}`}>
                {item.task}
              </span>
            </div>
            <button 
              onClick={() => removeTask(item.id)}
              className="text-slate-400 hover:text-red-500 p-2 transition-colors ml-2"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
