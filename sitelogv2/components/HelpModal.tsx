import React from 'react';
import { X, Mail, CheckCircle, ArrowRight, Smartphone, Paperclip, FileText } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-brand-600 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText size={24} />
            How to Send Reports
          </h2>
          <button onClick={onClose} className="hover:bg-brand-700 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto bg-slate-50">
          <p className="text-slate-600 mb-6 text-sm">
            SiteLog generates professional PDF and Email reports directly from your device. Here is the recommended workflow:
          </p>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-colors">
               <div className="absolute top-0 left-0 bottom-0 w-1 bg-brand-500"></div>
               <div className="flex gap-4">
                 <div className="bg-brand-50 text-brand-600 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-brand-100">
                   <FileText size={20} />
                 </div>
                 <div className="flex-1">
                   <h3 className="font-bold text-slate-800 text-sm mb-1">1. Complete the Log</h3>
                   <p className="text-xs text-slate-500">
                     Fill in site details, manpower, checklist, and notes. Use the microphone for quick voice-to-text entry.
                   </p>
                 </div>
               </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-colors">
               <div className="absolute top-0 left-0 bottom-0 w-1 bg-brand-500"></div>
               <div className="flex gap-4">
                 <div className="bg-brand-50 text-brand-600 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-brand-100">
                   <Mail size={20} />
                 </div>
                 <div className="flex-1">
                   <h3 className="font-bold text-slate-800 text-sm mb-1">2. Click 'Email Report'</h3>
                   <p className="text-xs text-slate-500">
                     Enter recipient emails (e.g., manager@company.com) and click the send button. Select your preferred mail app (Outlook, Gmail, etc.).
                   </p>
                 </div>
               </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-colors">
               <div className="absolute top-0 left-0 bottom-0 w-1 bg-brand-500"></div>
               <div className="flex gap-4">
                 <div className="bg-brand-50 text-brand-600 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-brand-100">
                   <Paperclip size={20} />
                 </div>
                 <div className="flex-1">
                   <h3 className="font-bold text-slate-800 text-sm mb-1">3. Attach Photos Manually</h3>
                   <p className="text-xs text-slate-500">
                     <strong>Important:</strong> Due to mobile security, the app cannot automatically attach photos to the email. You must attach them from your gallery when the email draft opens.
                   </p>
                 </div>
               </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-start gap-3 p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-100 text-xs shadow-sm">
            <Smartphone size={16} className="shrink-0 mt-0.5" />
            <p>
              <strong>Alternative:</strong> Use "Download PDF" to save a complete report with embedded photos to your device, then share that file directly.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30 flex items-center gap-2 active:scale-95 transform"
          >
            Got it <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};