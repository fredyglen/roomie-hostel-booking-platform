// Document Upload Component for Student Verification
// Handles student ID and proof of enrollment document uploads during registration

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Image, X, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export interface DocumentFile {
  file: File;
  preview: string;
  type: 'student_id' | 'enrollment_proof';
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
  id: string;
}

interface DocumentUploadProps {
  onDocumentsChange: (documents: DocumentFile[]) => void;
  documents: DocumentFile[];
  required?: boolean;
  maxFiles?: number;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onDocumentsChange,
  documents,
  required = true,
  maxFiles = 2
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newDocuments: DocumentFile[] = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: 'student_id', // Default type, user can change
      status: 'pending',
      id: Math.random().toString(36).substr(2, 9)
    }));

    // Check file size (max 5MB per file)
    const oversizedFiles = newDocuments.filter(doc => doc.file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: "Please upload files smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Check total files limit
    if (documents.length + newDocuments.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} documents allowed`,
        variant: "destructive"
      });
      return;
    }

    const updatedDocuments = [...documents, ...newDocuments];
    onDocumentsChange(updatedDocuments);

    // Show success message
    toast({
      title: "Documents added",
      description: `${newDocuments.length} document(s) ready for upload`,
    });
  }, [documents, maxFiles, onDocumentsChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'application/pdf': ['.pdf']
    },
    maxFiles: maxFiles - documents.length,
    disabled: documents.length >= maxFiles
  });

  const removeDocument = (id: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    onDocumentsChange(updatedDocuments);
  };

  const updateDocumentType = (id: string, type: 'student_id' | 'enrollment_proof') => {
    const updatedDocuments = documents.map(doc =>
      doc.id === id ? { ...doc, type } : doc
    );
    onDocumentsChange(updatedDocuments);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image size={20} className="text-blue-500" />;
    }
    return <FileText size={20} className="text-red-500" />;
  };

  const getStatusIcon = (status: DocumentFile['status']) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'uploading':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
      default:
        return null;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Instructions */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Student Verification Documents
        </h3>
        <p className="text-sm text-gray-600">
          Upload your student ID or proof of enrollment to verify your student status
        </p>
        {required && (
          <Badge variant="outline" className="text-xs">
            Required for account activation
          </Badge>
        )}
      </div>

      {/* Document Types Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Camera size={14} className="text-blue-600" />
            <span className="font-medium text-blue-800">Student ID Card</span>
          </div>
          <p className="text-blue-700">Clear photo of your student ID card (front side)</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <FileText size={14} className="text-green-600" />
            <span className="font-medium text-green-800">Enrollment Proof</span>
          </div>
          <p className="text-green-700">Official enrollment letter or registration document</p>
        </div>
      </div>

      {/* Upload Area */}
      {documents.length < maxFiles && (
        <Card className="border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`text-center cursor-pointer transition-colors ${
                isDragActive ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={32} className="mx-auto mb-3 text-gray-400" />
              {isDragActive ? (
                <p className="text-primary font-medium">Drop your documents here...</p>
              ) : (
                <div className="space-y-2">
                  <p className="font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, PDF up to 5MB each
                  </p>
                  <p className="text-xs text-gray-400">
                    Maximum {maxFiles} documents
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Uploaded Documents</h4>
          {documents.map((doc) => (
            <Card key={doc.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {getFileIcon(doc.file)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {doc.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(doc.file.size)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={doc.type}
                        onChange={(e) => updateDocumentType(doc.id, e.target.value as 'student_id' | 'enrollment_proof')}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="student_id">Student ID</option>
                        <option value="enrollment_proof">Enrollment Proof</option>
                      </select>
                      {getStatusIcon(doc.status)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDocument(doc.id)}
                    className="ml-2 h-8 w-8 p-0"
                  >
                    <X size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Requirements Check */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          {documents.length > 0 ? (
            <CheckCircle size={16} className="text-green-500" />
          ) : (
            <AlertCircle size={16} className="text-orange-500" />
          )}
          <span className={documents.length > 0 ? 'text-green-700' : 'text-orange-700'}>
            {documents.length > 0 
              ? `${documents.length} document(s) uploaded` 
              : 'At least 1 document required'
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
