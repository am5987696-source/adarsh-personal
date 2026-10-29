import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, Sparkles, Check } from 'lucide-react';
import { SAMPLE_CONSTRUCTION_IMAGES } from '../services/api';

interface ImageDropzoneProps {
  label: string;
  helperText?: string;
  value?: string;
  onImageSelected: (base64Data: string, mimeType: string, filename?: string) => void;
  onClear: () => void;
  presetType?: 'safety' | 'crack';
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  label,
  helperText,
  value,
  onImageSelected,
  onClear,
  presetType,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, or WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onImageSelected(base64, file.type, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const filteredPresets = SAMPLE_CONSTRUCTION_IMAGES.filter(
    (p) => !presetType || p.type === presetType
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">{label}</label>
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium"
          >
            <X className="w-3.5 h-3.5" />
            <span>Remove Image</span>
          </button>
        )}
      </div>

      {!value ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#F59E0B] bg-[#F59E0B]/5 scale-[0.99]'
              : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-500">
            <UploadCloud className="w-6 h-6 text-[#142B4A]" />
          </div>
          <p className="text-xs font-semibold text-slate-800">
            Click to upload or drag & drop construction photograph
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {helperText || 'Supports JPG, PNG, WebP up to 25MB'}
          </p>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group">
          <img
            src={value}
            alt="Uploaded preview"
            className="w-full h-56 object-contain bg-slate-950/70"
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold shadow hover:bg-slate-100"
            >
              Replace Photo
            </button>
            <button
              type="button"
              onClick={onClear}
              className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold shadow hover:bg-rose-700"
            >
              Remove
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
        </div>
      )}

      {/* Instant 1-Click Sample Presets */}
      <div className="pt-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Or test immediately with a curated site sample:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filteredPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onImageSelected(preset.dataUrl, 'image/svg+xml', preset.title)}
              className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:border-[#F59E0B] bg-white hover:bg-amber-50/40 text-left transition-all text-xs group"
            >
              <div className="w-9 h-9 rounded bg-slate-100 border border-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                <img src={preset.dataUrl} alt={preset.title} className="w-full h-full object-cover" />
              </div>
              <div className="truncate flex-1">
                <p className="font-semibold text-slate-800 truncate group-hover:text-[#142B4A]">
                  {preset.title}
                </p>
                <p className="text-[10px] text-slate-500 truncate">{preset.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
