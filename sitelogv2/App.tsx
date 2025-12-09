
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { Report, ViewMode } from './types';

export default function App() {
  const [view, setView] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [reports, setReports] = useState<Report[]>([]);
  const [activeReport, setActiveReport] = useState<Report | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sitelog_reports');
    if (saved) {
      try {
        const parsed: Report[] = JSON.parse(saved);
        // Hydrate dates or files if necessary.
        // Since localStorage doesn't store files, photos will be empty or invalid if we don't handle it.
        // For this version, we accept that photos are session-only or need re-uploading if not using a backend.
        // We will just initialize photos as empty array if missing to prevent crashes.
        const hydrated = parsed.map(r => ({
          ...r,
          photos: [], // Reset photos as we can't persist File objects easily in LS
          date: r.date || new Date().toLocaleDateString()
        }));
        setReports(hydrated);
      } catch (e) {
        console.error("Failed to load reports", e);
      }
    }
  }, []);

  // Save to local storage whenever reports change
  useEffect(() => {
    // Strip photos before saving to avoid circular structure or data loss issues with JSON.stringify
    const toSave = reports.map(r => ({
      ...r,
      photos: [] // Don't save photos to LS
    }));
    localStorage.setItem('sitelog_reports', JSON.stringify(toSave));
  }, [reports]);

  const handleCreateNew = () => {
    setActiveReport(null);
    setView(ViewMode.EDITOR);
  };

  const handleSelectReport = (report: Report) => {
    setActiveReport(report);
    setView(ViewMode.PREVIEW);
  };

  const handleSaveReport = (report: Report) => {
    const exists = reports.find(r => r.id === report.id);
    if (exists) {
      setReports(reports.map(r => r.id === report.id ? report : r));
    } else {
      setReports([report, ...reports]);
    }
    setActiveReport(report);
    setView(ViewMode.PREVIEW);
  };

  const handleEditActive = () => {
    if (activeReport) {
      setView(ViewMode.EDITOR);
    }
  };

  const handleBackToDashboard = () => {
    setActiveReport(null);
    setView(ViewMode.DASHBOARD);
  };

  const renderView = () => {
    switch (view) {
      case ViewMode.DASHBOARD:
        return (
          <Dashboard 
            reports={reports} 
            onCreateNew={handleCreateNew} 
            onSelectReport={handleSelectReport} 
          />
        );
      case ViewMode.EDITOR:
        return (
          <Editor 
            report={activeReport} 
            onSave={handleSaveReport} 
            onCancel={activeReport ? () => setView(ViewMode.PREVIEW) : handleBackToDashboard} 
          />
        );
      case ViewMode.PREVIEW:
        return activeReport ? (
          <Preview 
            report={activeReport} 
            onBack={handleBackToDashboard} 
            onEdit={handleEditActive}
          />
        ) : (
          <div>Error: No report selected</div>
        );
      default:
        return <div>Unknown View</div>;
    }
  };

  return (
    <div className="min-h-screen font-sans bg-slate-50 text-slate-900">
      {renderView()}
    </div>
  );
}
