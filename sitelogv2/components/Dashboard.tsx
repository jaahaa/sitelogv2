
import React from 'react';
import { Report } from '../types';
import { Plus, FileText, Calendar, MapPin, ChevronRight, HardHat } from 'lucide-react';

interface DashboardProps {
  reports: Report[];
  onCreateNew: () => void;
  onSelectReport: (report: Report) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ reports, onCreateNew, onSelectReport }) => {
  // Sort reports by date descending
  const sortedReports = [...reports].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <HardHat className="text-brand-600" size={32} />
            SiteLog
          </h1>
          <p className="text-slate-500 text-sm mt-1">Field Reporting Dashboard</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-transform active:scale-95"
        >
          <Plus size={20} />
          New Report
        </button>
      </header>

      {reports.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">No Reports Yet</h3>
          <p className="text-slate-500 mb-6 max-w-xs mx-auto">Start your first daily field report by clicking the button above.</p>
          <button 
            onClick={onCreateNew}
            className="text-brand-600 font-bold hover:underline"
          >
            Create your first report
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Recent Reports</h2>
          {sortedReports.map(report => (
            <div 
              key={report.id}
              onClick={() => onSelectReport(report)}
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-brand-400 hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg group-hover:text-brand-700 transition-colors">
                    {report.projectName || 'Untitled Project'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">{report.projectNumber}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                  report.status === 'completed' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {report.status}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-slate-600 mt-3">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" />
                  {report.date}
                </div>
                {report.propertyAddress && (
                   <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                    <MapPin size={14} className="text-slate-400" />
                    <span className="truncate">{report.propertyAddress}</span>
                  </div>
                )}
                <div className="flex-1 sm:text-right text-slate-400 group-hover:text-brand-500 transition-colors">
                  <ChevronRight size={16} className="ml-auto inline-block" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
