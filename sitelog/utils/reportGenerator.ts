
import { ReportData } from '../types';

export const generateReportHTML = (data: ReportData, isPdfExport = false, base64Images: string[] = []): string => {
  const manpowerRows = data.manpower.map(entry => 
    `<tr>
      <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${entry.trade}</td>
      <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: center;">${entry.count}</td>
      <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: right;">${entry.hours} hrs</td>
    </tr>`
  ).join('');

  const checklistRows = data.checklist.map(item => 
    `<li style="margin-bottom: 8px; list-style: none;">
      <span style="display: inline-block; width: 16px; font-weight: bold; color: ${item.completed ? '#22c55e' : '#94a3b8'};">
        ${item.completed ? '&#10003;' : '&#9744;'}
      </span>
      <span style="color: ${item.completed ? '#475569' : '#1e293b;'} ${item.completed ? 'text-decoration: line-through; opacity: 0.8;' : ''}">
        ${item.task}
      </span>
    </li>`
  ).join('');

  // Helper to choose the right image source
  const getPhotoSrc = (file: File, index: number) => {
    if (isPdfExport && base64Images[index]) {
      return base64Images[index];
    }
    return URL.createObjectURL(file);
  };

  // For PDF export, we render photos in a grid using Flexbox (safer for html2canvas than Grid)
  const photoGrid = data.photos.length > 0 ? `
    <div style="page-break-before: always; margin-top: 30px; border-top: 2px solid #e2e8f0; padding-top: 20px;">
      <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #1e293b; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Site Photos</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 15px;">
        ${data.photos.map((file, index) => `
          <div style="width: calc(50% - 12px); margin-bottom: 15px; break-inside: avoid; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <div style="height: 220px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #f8fafc; border-bottom: 1px solid #f1f5f9;">
               <img src="${getPhotoSrc(file, index)}" style="width: 100%; height: 100%; object-fit: cover;" alt="Site Photo" />
            </div>
            <div style="padding: 10px; background: #fff;">
              <div style="font-size: 11px; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px;">${file.name}</div>
              <div style="font-size: 10px; color: #94a3b8;">${new Date(file.lastModified).toLocaleDateString()}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  // Returns a container div string instead of full HTML document.
  // This is better for html2pdf and React dangerouslySetInnerHTML
  // We use fixed width for PDF export to ensure A4 scaling works perfectly, vs flexible width for preview
  const containerStyle = isPdfExport 
    ? "width: 780px; margin: 0 auto; padding: 20px;" 
    : "max-width: 800px; margin: 0 auto; padding: 20px;";

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; line-height: 1.5; background: white;">
      <style>
        table { width: 100%; border-collapse: collapse; }
      </style>
      
      <div style="${containerStyle}">
        <!-- Header -->
        <div style="padding-bottom: 20px; border-bottom: 3px solid #22c55e; margin-bottom: 30px;">
           <div style="display: flex; justify-content: space-between; align-items: flex-start;">
             <div>
                <h1 style="color: #1e293b; margin: 0; font-size: 24px;">Daily Field Report</h1>
                <p style="color: #64748b; margin: 5px 0 0 0;">${data.projectName} (${data.projectNumber})</p>
                ${data.location ? `<p style="color: #94a3b8; margin: 2px 0 0 0; font-size: 12px; text-transform: uppercase;">Location: ${data.location}</p>` : ''}
             </div>
             <div style="margin-top: 5px; font-size: 14px; background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 99px; font-weight: bold; text-transform: uppercase;">
               ${data.status}
             </div>
           </div>
        </div>
        
        <!-- Info Grid -->
        <table style="width: 100%; margin-bottom: 30px; border-collapse: separate; border-spacing: 0 10px;">
          <tr>
            <td style="vertical-align: top; width: 50%;">
              <div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; margin-bottom: 5px;">Contractor / Foreman / Property</div>
              <div style="font-weight: 500;">${data.clientName || 'N/A'}</div>
              ${data.foreman ? `<div style="font-size: 13px; color: #334155; margin-bottom: 2px;">Foreman: ${data.foreman}</div>` : ''}
              <div style="color: #475569;">${data.propertyAddress || ''}</div>
            </td>
            <td style="vertical-align: top; width: 50%; text-align: right;">
              <div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; margin-bottom: 5px;">Date & Weather</div>
              <div style="font-weight: 500;">${data.date}</div>
              <div style="color: #475569;">${data.weather.condition}, ${data.weather.temp}</div>
            </td>
          </tr>
        </table>

        <!-- Summary -->
        ${data.summary ? `
          <div style="margin-bottom: 25px; break-inside: avoid;">
            <h3 style="background: #f1f5f9; padding: 10px 15px; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-left: 4px solid #64748b; color: #475569;">Executive Summary</h3>
            <div style="padding: 0 15px; color: #334155;">
              ${data.summary}
            </div>
          </div>
        ` : ''}

        <!-- Manpower -->
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 25px; overflow: hidden; break-inside: avoid;">
          <h3 style="background: #f8fafc; padding: 12px 15px; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; color: #475569;">Manpower Log</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f8fafc;">
                <th style="padding: 10px; text-align: left; font-size: 12px; color: #64748b; font-weight: 600;">Trade</th>
                <th style="padding: 10px; text-align: center; font-size: 12px; color: #64748b; font-weight: 600;">Count</th>
                <th style="padding: 10px; text-align: right; font-size: 12px; color: #64748b; font-weight: 600;">Time</th>
              </tr>
            </thead>
            <tbody>
              ${manpowerRows || '<tr><td colspan="3" style="padding:15px; text-align:center; color: #94a3b8; font-style: italic;">No manpower recorded</td></tr>'}
            </tbody>
          </table>
        </div>

        <!-- Job Checklist -->
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 25px; overflow: hidden; break-inside: avoid;">
          <h3 style="background: #f8fafc; padding: 12px 15px; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; color: #475569;">Job Checklist</h3>
          <div style="padding: 15px;">
             ${checklistRows ? `<ul style="padding: 0; margin: 0;">${checklistRows}</ul>` : '<div style="text-align:center; color: #94a3b8; font-style: italic;">No checklist items</div>'}
          </div>
        </div>

        <!-- Notes -->
        <div style="margin-bottom: 25px; break-inside: avoid;">
           <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Site Notes</h3>
           <div style="padding: 15px; background: #f8fafc; border-radius: 6px; color: #334155; border: 1px solid #e2e8f0;">
             ${data.notes ? data.notes.replace(/\n/g, '<br/>') : 'No notes recorded.'}
           </div>
        </div>

        ${data.incidents ? `
          <div style="margin-bottom: 25px; break-inside: avoid;">
             <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #b91c1c; border-bottom: 1px solid #fecaca; padding-bottom: 8px;">Incidents / Delays</h3>
             <div style="padding: 15px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; color: #991b1b;">
               ${data.incidents.replace(/\n/g, '<br/>')}
             </div>
          </div>
        ` : ''}

        <!-- Signature Stub -->
        ${data.signature ? `
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; page-break-inside: avoid; break-inside: avoid;">
            <p style="font-style: italic; color: #64748b; margin-bottom: 10px;">Authorized Site Manager</p>
            <img src="${data.signature}" style="height: 60px; border: 1px solid #e2e8f0; padding: 5px; border-radius: 4px;" />
            <div style="margin-top: 5px; font-size: 10px; color: #94a3b8;">Digitally Signed at ${new Date().toLocaleTimeString()}</div>
          </div>
        ` : ''}
        
        <!-- Photo Grid (PDF Only) -->
        ${isPdfExport ? photoGrid : ''}

        <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8; text-align: center;">
          Generated via SiteLog Field Reporter
        </div>
      </div>
    </div>
  `;
};
