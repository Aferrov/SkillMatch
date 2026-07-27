import { useState } from 'react';
import {
  Upload,
  FileText,
  X,
  ArrowLeft,
  Zap,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { analyzeCV } from '../services/api';

interface UploadCVProps {
  onUpload: (data?: any) => void;
  onBack: () => void;
  onManualEntry: () => void;
}

const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_SIZE_MB = 10;

export function UploadCV({ onUpload, onBack, onManualEntry }: UploadCVProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const validateFile = (file: File): string => {
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      return 'Formato no válido. Sube un archivo PDF, DOC o DOCX.';
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `El archivo supera los ${MAX_SIZE_MB} MB.`;
    }
    return '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) {
      setFileError(err);
      return;
    }
    setFileError('');
    setSelectedFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) {
      setFileError(err);
      return;
    }
    setFileError('');
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setFileError('');

    const result = await analyzeCV(selectedFile);

    if (!result.success) {
      setFileError(result.error || 'Error al analizar el CV');
      setIsAnalyzing(false);
      return;
    }

    // Si el análisis es exitoso, pasar los datos al componente padre
    onUpload(result.data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Volver"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img
                  src="/logo_skillmatch.png"
                  alt="SkillMatch"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-gray-900 font-semibold text-lg">
                SkillMatch
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                ✓
              </div>
              <span className="text-gray-600 hidden sm:inline">
                Cuenta creada
              </span>
            </div>
            <div className="flex-1 h-1 bg-blue-600"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                2
              </div>
              <span className="text-gray-900 hidden sm:inline">Tu perfil</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                3
              </div>
              <span className="text-gray-400 hidden sm:inline">Análisis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-4">
            <Zap size={16} />
            <span className="text-sm">Onboarding en un solo paso</span>
          </div>
          <h1
            className="text-gray-900 mb-3"
            style={{ fontSize: '32px', fontWeight: 700 }}
          >
            Importa tu información en segundos
          </h1>
          <p className="text-gray-600">
            Sin formularios largos. Sube tu CV o conecta tu LinkedIn y nosotros
            extraemos todo automáticamente.
          </p>
        </div>

        {/* Single-path onboarding */}
        <div className="max-w-md mx-auto mb-8">
          {/* Path 1: CV upload */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-gray-900">Sube tu CV</h2>
                <p className="text-gray-600 text-sm">
                  PDF o Word, hasta {MAX_SIZE_MB} MB
                </p>
              </div>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
                }`}
            >
              {selectedFile ? (
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-900">{selectedFile.name}</p>
                    <p className="text-gray-500 text-sm">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setFileError('');
                    }}
                    className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm"
                  >
                    <X size={14} />
                    Quitar archivo
                  </button>
                </div>
              ) : (
                <>
                  <Upload
                    className="mx-auto text-gray-400 mb-3"
                    size={36}
                  />
                  <p className="text-gray-700 mb-1">
                    Arrastra tu archivo aquí
                  </p>
                  <p className="text-gray-500 text-sm mb-4">o</p>
                  <label className="inline-block">
                    <span className="bg-blue-600 text-white px-5 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors inline-block">
                      Seleccionar archivo
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  <p className="text-gray-500 text-xs mt-4">
                    Formatos: PDF, DOC, DOCX
                  </p>
                </>
              )}
            </div>

            {fileError && (
              <div className="bg-red-100 text-red-700 rounded-lg p-4 flex items-center gap-2 mt-4">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span className="text-sm">{fileError}</span>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!selectedFile || isAnalyzing}
              className={`w-full py-3 rounded-lg transition-colors mt-6 flex items-center justify-center gap-2 ${selectedFile && !isAnalyzing
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analizando...
                </>
              ) : (
                'Analizar mi CV'
              )}
            </button>
          </div>
        </div>

        {/* Info / Privacy */}
        <div className="bg-blue-50 rounded-xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="text-blue-600" size={20} />
          </div>
          <div>
            <h3 className="text-gray-900 mb-1">Tu información está protegida</h3>
            <p className="text-gray-600 text-sm">
              Solo usamos tu CV para generar recomendaciones
              personalizadas. No compartimos tus datos con terceros y puedes
              eliminarlos cuando quieras desde tu panel.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
