import React, { useRef } from 'react';
import { Camera, X, Image as ImageIcon } from 'lucide-react';

interface PhotoInputProps {
  photos: File[];
  onChange: (photos: File[]) => void;
}

export const PhotoInput: React.FC<PhotoInputProps> = ({ photos, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      onChange([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    onChange(newPhotos);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Camera size={20} className="text-brand-600" />
          Site Photos
        </h2>
        <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-100">
          {photos.length}
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
        {photos.map((file, idx) => (
          <div key={idx} className="relative group aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
            <img 
              src={URL.createObjectURL(file)} 
              alt={`Site photo ${idx + 1}`} 
              className="w-full h-full object-cover"
            />
            <button 
              onClick={() => removePhoto(idx)}
              className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              aria-label="Remove photo"
            >
              <X size={14} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-slate-900/70 text-white text-[10px] p-1.5 truncate px-2 text-center">
              {file.name}
            </div>
          </div>
        ))}
        
        <button 
          onClick={triggerFileInput}
          className="aspect-square flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-600 transition-all group"
        >
          <div className="bg-white p-3 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform text-slate-400 group-hover:text-brand-500">
            <ImageIcon size={24} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wide">Add Photo</span>
        </button>
      </div>

      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden" 
        accept="image/*"
        multiple
      />
      
      {photos.length > 0 && (
        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-md border border-slate-100">
           Photos will need to be manually attached to your email.
        </div>
      )}
    </div>
  );
};