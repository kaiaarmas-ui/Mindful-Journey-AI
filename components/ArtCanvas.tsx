
import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Paintbrush, Trash2, Undo2, Circle } from 'lucide-react';

interface ArtCanvasProps {
  onImageChange: (dataUrl: string) => void;
}

const COLORS = ['#ffffff', '#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#0ea5e9'];

const ArtCanvas: React.FC<ArtCanvasProps> = ({ onImageChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#6366f1');
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scale canvas for high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Set background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onImageChange(canvas.toDataURL());
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.strokeStyle = isEraser ? '#0f172a' : color;
    ctx.lineWidth = brushSize;
    
    if (isDrawing) {
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    onImageChange('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/60 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => { setColor(c); setIsEraser(false); }}
              className={`w-8 h-8 rounded-full border-2 transition-all ${color === c && !isEraser ? 'scale-125 border-white shadow-lg' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
          <div className="w-px h-6 bg-slate-800 mx-2" />
          <button
            onClick={() => setIsEraser(!isEraser)}
            className={`p-2 rounded-xl transition-all ${isEraser ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
            title="Eraser"
          >
            <Eraser size={20} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-2xl border border-slate-700">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Size</span>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-24 h-1 bg-slate-700 rounded-full appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
          <button
            onClick={clearCanvas}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
            title="Clear Canvas"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="relative aspect-[4/3] w-full bg-[#0f172a] rounded-[40px] border-2 border-slate-800 overflow-hidden cursor-crosshair shadow-2xl touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="w-full h-full"
        />
        <div className="absolute top-4 right-4 pointer-events-none opacity-20">
           <Paintbrush size={40} className="text-slate-500" />
        </div>
      </div>
    </div>
  );
};

export default ArtCanvas;
