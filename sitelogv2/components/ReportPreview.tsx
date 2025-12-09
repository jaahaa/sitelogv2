import React from 'react';
import { ReportData } from '../types';
import { Paperclip, AlertCircle } from 'lucide-react';
import { generateReportHTML } from '../utils/reportGenerator';

interface ReportPreviewProps {
  data: ReportData;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({ data }) => {
  // Use the utility to generate the standard report HTML
  const htmlContent = generateReportHTML(data, false);

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-lg my-6">
      <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-0.5 rounded border border-brand-200 uppercase tracking-wider">Email Preview</span>
          {data.photos.length > 0 && (
             <span className="flex items-center gap-1 text-xs text-slate-500">
               <Paperclip size={12} /> {data.photos.length} files
             </span>
          )}
        </div>
        <div className="text-xs text-slate-500 font-mono bg-slate-200 px-2 py-1 rounded w-full sm:w-auto truncate">
           <span className="font-semibold text-slate-400 select-none">Subject: </span>
           Daily Report: {data.projectName} - {data.date}
        </div>
      </div>
      
      {/* HTML Content Preview */}
      <div 
        className="p-8 overflow-x-auto bg-white"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      
      {/* Photos Preview Section for Email context (Since standard HTML hides them for email body) */}
      {data.photos.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
             <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Paperclip size={16} />
              Attachments ({data.photos.length})
            </h4>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>
         
          <div className="flex flex-wrap gap-3">
            {data.photos.map((photo, i) => (
              <div key={i} className="relative group w-24 h-24 bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <img 
                  src={URL.createObjectURL(photo)} 
                  alt="attachment preview" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] p-1 truncate text-center">
                  {photo.name}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-2 bg-amber-50 text-amber-800 text-xs p-3 rounded-md border border-amber-100">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p>
              <strong>Manual Action Required for Email:</strong> While we export these photos to PDF automatically, for Email you must manually attach them in your mail app.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};