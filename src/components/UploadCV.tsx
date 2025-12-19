import { useState } from 'react';
import { Upload, FileText, X, ArrowLeft, Target } from 'lucide-react';

interface UploadCVProps {
  onUpload: () => void;
  onBack: () => void;
}

export function UploadCV({ onUpload, onBack }: UploadCVProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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
    if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
<header className="bg-white border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">

        <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
          <ArrowLeft size={24} />
        </button>

        <div className="flex items-center gap-2">

          {/* 👉 Nuevo logo */}
          <div className="w-10 h-10 rounded-lg overflow-hidden">
            <img
              src="/logo_skillmatch.png"   // Asegúrate de tener esta imagen en /public
              alt="SkillMatch Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <span className="text-gray-900">SkillMatch</span>
        </div>

      </div>
    </div>
  </div>
</header>


      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-gray-900 mb-4">Sube tu Currículum</h1>
          <p className="text-gray-600">
            Carga tu CV en formato PDF o Word para comenzar el análisis
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <FileText className="text-blue-600" size={48} />
                  <div className="text-left">
                    <p className="text-gray-900">{selectedFile.name}</p>
                    <p className="text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-900 mb-2">
                  Arrastra y suelta tu archivo aquí
                </p>
                <p className="text-gray-500 mb-4">o</p>
                <label className="inline-block">
                  <span className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors inline-block">
                    Seleccionar archivo
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
                <p className="text-gray-500 mt-4">
                  Formatos aceptados: PDF, DOC, DOCX (Max. 10MB)
                </p>
              </>
            )}
          </div>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile}
          className={`w-full py-4 rounded-lg transition-colors ${
            selectedFile
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Analizar Currículum
        </button>

        {/* Info */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-gray-900 mb-2">Privacidad de tus datos</h3>
          <p className="text-gray-600">
            Tu información es tratada con total confidencialidad. No compartimos ni almacenamos tus datos sin tu consentimiento.
          </p>
        </div>
      </div>
    </div>
  );
}
