
import React from 'react';
import { X, Mail, ExternalLink, Smartphone, AlertTriangle, FileText } from 'lucide-react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (provider: 'default' | 'gmail' | 'outlook') => void;
  hasPhotos: boolean;
}

export const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, onSelect, hasPhotos }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Mail size={20} className="text-brand-600" />
            Select Email App
          </h2>
          <button onClick={onClose} className="hover:bg-slate-200 p-1 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
           {/* Info Banner */}
           <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3 items-start text-blue-800">
              <FileText size={20} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs uppercase mb-1">PDF Report Attachment</p>
                <p className="text-xs">
                  We will generate a PDF (with photos) and attempt to attach it automatically. 
                  <br className="mb-1" />
                  If using Gmail/Outlook via browser, the PDF will be downloaded so you can drag & drop it.
                </p>
              </div>
            </div>

          <p className="text-sm text-slate-500 mb-2">
            Choose which app to use for sending the report:
          </p>

          <button 
            onClick={() => onSelect('default')}
            className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-brand-500 hover:ring-1 hover:ring-brand-500 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-full text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                <Smartphone size={20} />
              </div>
              <div className="text-left">
                <span className="block font-bold text-slate-800">Default Mail App</span>
                <span className="text-xs text-slate-500">Auto-attach PDF</span>
              </div>
            </div>
          </button>

          <button 
            onClick={() => onSelect('outlook')}
            className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-500 hover:ring-1 hover:ring-blue-500 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-full text-blue-600">
                <Mail size={20} />
              </div>
              <div className="text-left">
                <span className="block font-bold text-slate-800">Microsoft Outlook</span>
                <span className="text-xs text-slate-500">Open in Browser + Download PDF</span>
              </div>
            </div>
            <ExternalLink size={16} className="text-slate-300 group-hover:text-blue-500" />
          </button>

          <button 
            onClick={() => onSelect('gmail')}
            className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-red-500 hover:ring-1 hover:ring-red-500 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-red-50 p-2 rounded-full text-red-600">
                <Mail size={20} />
              </div>
              <div className="text-left">
                <span className="block font-bold text-slate-800">Google Gmail</span>
                <span className="text-xs text-slate-500">Open in Browser + Download PDF</span>
              </div>
            </div>
            <ExternalLink size={16} className="text-slate-300 group-hover:text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
