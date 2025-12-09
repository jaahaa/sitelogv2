import React, { useRef, useState, useEffect } from 'react';
import { PenTool, X, RotateCcw } from 'lucide-react';

interface SignatureInputProps {
  signature: string | null;
  onSave: (dataUrl: string | null) => void;
}

export const SignatureInput: React.FC<SignatureInputProps> = ({ signature, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.parentElement?.clientWidth || 300;
      canvas.height = 150;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }
    }
  }, []);

  const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext('2d');
    const { x, y } = getCoords(e);
    ctx?.beginPath();
    ctx?.moveTo(x, y);
    // Prevent scrolling when touching canvas
    if ('touches' in e) e.preventDefault(); 
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    const { x, y } = getCoords(e);
    ctx?.lineTo(x, y);
    ctx?.stroke();
    setHasSignature(true);
    if ('touches' in e) e.preventDefault();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (hasSignature && canvasRef.current) {
      onSave(canvasRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
      onSave(null);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <PenTool size={20} className="text-brand-600" />
          Sign-off
        </h3>
        {hasSignature && (
          <button 
            onClick={clearSignature}
            className="text-xs flex items-center gap-1 text-slate-500 hover:text-red-600 transition-colors"
          >
            <RotateCcw size={14} /> Clear
          </button>
        )}
      </div>

      <div className="border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 overflow-hidden touch-none relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full cursor-crosshair block"
        />
        {!hasSignature && !isDrawing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-slate-400 text-sm font-medium">Sign here</span>
          </div>
        )}
      </div>
      <p className="text-xs text-slate-500 mt-2">
        By signing, I verify the above report is accurate.
      </p>
    </div>
  );
};