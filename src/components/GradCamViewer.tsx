import React, { useEffect, useRef, useState } from 'react';
import { Eye, Layers, Maximize2, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import { GradCamCoordinate } from '../types';

interface Props {
  imageUrl: string;
  gradCamCoordinates: GradCamCoordinate[];
  condition: string;
  modality: string;
  aiExplanation?: string;
  initialMode?: 'side-by-side' | 'overlay';
}

export const GradCamViewer: React.FC<Props> = ({
  imageUrl,
  gradCamCoordinates,
  condition,
  modality,
  aiExplanation,
  initialMode = 'side-by-side'
}) => {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'overlay'>(initialMode);
  const [opacity, setOpacity] = useState<number>(0.75);
  const [showHotspotLabels, setShowHotspotLabels] = useState<boolean>(true);
  const [activeCoordinate, setActiveCoordinate] = useState<GradCamCoordinate | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render heatmap on canvas
  const renderHeatmap = (canvas: HTMLCanvasElement, withOriginal = false) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      canvas.width = img.naturalWidth || 600;
      canvas.height = img.naturalHeight || 600;

      const w = canvas.width;
      const h = canvas.height;

      // Draw original grayscale/RGB image first if requested
      if (withOriginal) {
        ctx.drawImage(img, 0, 0, w, h);
      } else {
        // Clear canvas
        ctx.clearRect(0, 0, w, h);
      }

      // Create an offscreen canvas for jet gradient heat accumulation
      const heatCanvas = document.createElement('canvas');
      heatCanvas.width = w;
      heatCanvas.height = h;
      const heatCtx = heatCanvas.getContext('2d');
      if (!heatCtx) return;

      // Draw Gaussian gradients for each coordinate
      gradCamCoordinates.forEach(coord => {
        const cx = (coord.x / 100) * w;
        const cy = (coord.y / 100) * h;
        const r = ((coord.radius || 20) / 100) * Math.min(w, h);
        const intensity = Math.min(Math.max(coord.intensity || 0.8, 0.2), 1.0);

        const radial = heatCtx.createRadialGradient(cx, cy, 0, cx, cy, r);
        radial.addColorStop(0, `rgba(255, 0, 0, ${intensity})`);
        radial.addColorStop(0.3, `rgba(255, 120, 0, ${intensity * 0.8})`);
        radial.addColorStop(0.6, `rgba(255, 230, 0, ${intensity * 0.5})`);
        radial.addColorStop(0.85, `rgba(0, 180, 255, ${intensity * 0.25})`);
        radial.addColorStop(1, 'rgba(0, 0, 255, 0)');

        heatCtx.fillStyle = radial;
        heatCtx.beginPath();
        heatCtx.arc(cx, cy, r, 0, Math.PI * 2);
        heatCtx.fill();
      });

      // Composite heat onto the main canvas with user-controlled opacity
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.drawImage(heatCanvas, 0, 0);
      ctx.restore();

      // If show labels, draw subtle bounding circles and label pins
      if (showHotspotLabels) {
        gradCamCoordinates.forEach((coord, idx) => {
          const cx = (coord.x / 100) * w;
          const cy = (coord.y / 100) * h;
          const r = ((coord.radius || 20) / 100) * Math.min(w, h);

          ctx.save();
          // Dashed circle
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = Math.max(2, w / 250);
          ctx.setLineDash([6, 4]);
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();

          // Center crosshair / pin
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(4, w / 150), 0, Math.PI * 2);
          ctx.fill();

          // Text badge
          if (coord.label) {
            ctx.font = `600 ${Math.max(12, Math.round(w / 45))}px system-ui, -apple-system, sans-serif`;
            const text = `ROI ${idx + 1}: ${coord.label}`;
            const textMetrics = ctx.measureText(text);
            const pad = 6;
            const th = Math.max(14, Math.round(w / 40));

            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.fillRect(cx - textMetrics.width / 2 - pad, cy - r - th - pad * 2, textMetrics.width + pad * 2, th + pad);

            ctx.fillStyle = '#f8fafc';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, cx, cy - r - th / 2 - pad);
          }
          ctx.restore();
        });
      }
    };
  };

  useEffect(() => {
    if (viewMode === 'side-by-side' && canvasRef.current) {
      renderHeatmap(canvasRef.current, true);
    } else if (viewMode === 'overlay' && overlayCanvasRef.current) {
      renderHeatmap(overlayCanvasRef.current, true);
    }
  }, [imageUrl, gradCamCoordinates, opacity, showHotspotLabels, viewMode]);

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Layers className="w-3.5 h-3.5" /> Explainable AI (Grad-CAM)
            </span>
            <span className="text-xs text-slate-400 font-mono">Modality: {modality}</span>
          </div>
          <h3 className="text-base font-bold text-white mt-1">
            Deep Neural Activation Map: <span className="text-cyan-400">{condition}</span>
          </h3>
        </div>

        {/* View Switcher & Controls */}
        <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              viewMode === 'side-by-side'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode('overlay')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              viewMode === 'overlay'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Fused Overlay
          </button>
        </div>
      </div>

      {/* Opacity & Label Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/40 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-300 font-medium">Heatmap Opacity:</span>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="w-32 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <span className="font-mono text-cyan-400 w-10">{Math.round(opacity * 100)}%</span>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
            <input
              type="checkbox"
              checked={showHotspotLabels}
              onChange={(e) => setShowHotspotLabels(e.target.checked)}
              className="rounded bg-slate-700 border-slate-600 text-cyan-600 focus:ring-0"
            />
            <span>Show ROI Markers ({gradCamCoordinates.length})</span>
          </label>

          {/* Color Spectrum Legend */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Low</span>
            <div className="w-20 h-2 rounded-full bg-gradient-to-r from-blue-600 via-emerald-400 via-amber-400 to-red-600" />
            <span className="text-red-400 font-semibold">High Influence</span>
          </div>
        </div>
      </div>

      {/* Main Visualizer Area */}
      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original scan */}
          <div className="flex flex-col rounded-xl overflow-hidden border border-slate-800 bg-black">
            <div className="px-3 py-2 bg-slate-800/90 text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-slate-400" /> Original Diagnostic Scan
              </span>
              <span className="text-[10px] text-slate-400">Raw Radiograph / Scan</span>
            </div>
            <div className="relative aspect-square flex items-center justify-center bg-black p-2">
              <img
                src={imageUrl}
                alt="Original Medical Scan"
                className="max-h-full max-w-full object-contain rounded"
              />
            </div>
          </div>

          {/* AI Attention / Heatmap */}
          <div className="flex flex-col rounded-xl overflow-hidden border border-cyan-900/40 bg-black">
            <div className="px-3 py-2 bg-slate-800/90 text-xs font-semibold text-cyan-300 flex items-center justify-between border-b border-cyan-900/30">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> AI Attention / Heatmap
              </span>
              <span className="text-[10px] text-cyan-400/80">Gradient-weighted CAM</span>
            </div>
            <div className="relative aspect-square flex items-center justify-center bg-black p-2">
              <canvas
                ref={canvasRef}
                className="max-h-full max-w-full object-contain rounded"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl overflow-hidden border border-cyan-900/40 bg-black p-3">
          <div className="w-full max-w-2xl relative aspect-square flex items-center justify-center">
            <canvas
              ref={overlayCanvasRef}
              className="max-h-full max-w-full object-contain rounded shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Hotspots Info Badges */}
      {gradCamCoordinates.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-300">
            Detected Regions of Highest Model Attribution:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {gradCamCoordinates.map((coord, idx) => (
              <div
                key={idx}
                className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 flex items-start gap-2.5 text-xs"
              >
                <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-[11px] shrink-0">
                  {idx + 1}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="font-semibold text-slate-200 truncate">{coord.label || `Focal Region ${idx + 1}`}</div>
                  <div className="text-[11px] text-slate-400">
                    Spatial center: ({coord.x}%, {coord.y}%) • Peak Gradient: {(coord.intensity * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Attention Explanation & Regulatory Safeguard */}
      <div className="bg-slate-800/60 border border-slate-700/50 p-3.5 rounded-xl space-y-1.5 text-xs">
        <div className="font-semibold text-cyan-300">How the Neural Network Interpreted This Image:</div>
        <p className="text-slate-300 leading-relaxed">
          {aiExplanation || 'The highlighted area indicates regions that influenced the model’s prediction and should not be interpreted as a definitive medical diagnosis.'}
        </p>
        <div className="pt-2 text-[11px] text-amber-300/90 flex items-center gap-1.5">
          <span>⚠️</span>
          <span>
            <strong>Important:</strong> The highlighted area indicates regions that influenced the model's prediction and should not be interpreted as a definitive medical diagnosis.
          </span>
        </div>
      </div>
    </div>
  );
};
