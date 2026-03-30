'use client';

import { useEffect, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpload } from '@/lib/hooks/useUpload';

interface FileUploadProps {
  label: string;
  typeIndicator?: string;
  accept: string;
  value?: string | string[] | null;
  onChange: (url: string | string[] | undefined) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  error?: string;
  required?: boolean;
  multiple?: boolean;
}

export function FileUpload({
  label,
  typeIndicator,
  accept,
  value,
  onChange,
  onUploadingChange,
  error,
  required = false,
  multiple = false,
}: FileUploadProps) {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastUploadingRef = useRef<boolean | undefined>(undefined);

  const getDisplayNameFromUrl = (url: string): string => {
    try {
      const pathname = new URL(url).pathname;
      const lastSegment = pathname.split('/').pop() ?? '';
      return decodeURIComponent(lastSegment) || '已上传文件';
    } catch {
      const lastSegment = url.split('/').pop() ?? '';
      return decodeURIComponent(lastSegment) || '已上传文件';
    }
  };

  const { upload, isUploading, uploadError } = useUpload({
    onSuccess: () => {},
    onError: message => {
      console.error('Upload error:', message);
    },
  });

  useEffect(() => {
    // Only emit when upload state actually changes to avoid render loops.
    if (lastUploadingRef.current === isUploading) {
      return;
    }

    lastUploadingRef.current = isUploading;
    onUploadingChange?.(isUploading);
  }, [isUploading, onUploadingChange]);

  // Sync with parent value prop
  useEffect(() => {
    if (!value) {
      setUploadedUrls([]);
      setFileNames([]);
    } else if (Array.isArray(value)) {
      setUploadedUrls(value);
      setFileNames(prev =>
        value.map((url, index) => prev[index] || getDisplayNameFromUrl(url))
      );
    } else {
      setUploadedUrls([value]);
      setFileNames(prev => [prev[0] || getDisplayNameFromUrl(value)]);
    }
  }, [value]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate file types
    const acceptedTypes = accept
      .replace(/\./g, '')
      .split(',')
      .map(t => t.trim().toLowerCase());

    const validFiles: File[] = [];
    const newFileNames: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (extension && acceptedTypes.includes(extension)) {
        validFiles.push(file);
        newFileNames.push(file.name);
      }
    }

    if (validFiles.length === 0) {
      onChange(undefined);
      return;
    }

    if (multiple) {
      // Multiple mode appends uploaded files to the existing list.
      const result = await upload(validFiles);
      const urls = Array.isArray(result) ? result : [];
      if (urls.length > 0) {
        const allUrls = [...uploadedUrls, ...urls];
        const allNames = [...fileNames, ...newFileNames];

        setUploadedUrls(allUrls);
        setFileNames(allNames);
        onChange(allUrls);
      }
    } else {
      // Single file upload
      const result = await upload(validFiles[0]);
      const url = typeof result === 'string' ? result : null;
      if (url) {
        setUploadedUrls([url]);
        setFileNames(newFileNames);
        onChange(url);
      }
    }

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const newUrls = uploadedUrls.filter((_, i) => i !== index);
    const newNames = fileNames.filter((_, i) => i !== index);

    setUploadedUrls(newUrls);
    setFileNames(newNames);

    if (multiple) {
      onChange(newUrls.length > 0 ? newUrls : undefined);
    } else {
      onChange(undefined);
    }
  };

  const handleClear = () => {
    setUploadedUrls([]);
    setFileNames([]);
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const renderFileList = () => {
    if (multiple && uploadedUrls.length > 0) {
      return (
        <div className="space-y-2">
          {uploadedUrls.map((url, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border border-gray-200 rounded-md"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <svg
                  className="h-4 w-4 shrink-0 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="text-sm font-medium truncate">
                  {fileNames[index] || `文件 ${index + 1}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="ml-2 shrink-0 text-sm text-gray-500 hover:text-gray-700"
              >
                移除
              </button>
            </div>
          ))}
        </div>
      );
    }

    if (!multiple && uploadedUrls.length > 0) {
      return (
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <svg
              className="h-5 w-5 shrink-0 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-sm font-medium truncate">
              {fileNames[0] || '已上传'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="ml-3 shrink-0 text-sm text-gray-500 hover:text-gray-700"
          >
            清除
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={label}>
        <span>{label}</span>
        {typeIndicator ? (
          <span className="ml-2 align-middle text-xs font-medium text-slate-400">
            {typeIndicator}
          </span>
        ) : null}{' '}
        {required && <span className="text-red-500">*</span>}
      </Label>

      {renderFileList()}

      {isUploading && (
        <div className="flex items-center justify-center p-3 border border-gray-200 rounded-md">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent mr-2" />
          <span className="text-sm">上传中...</span>
        </div>
      )}

      {/* Show input: always in multiple mode, or in single mode when no file */}
      {(multiple || uploadedUrls.length === 0) && (
        <Input
          ref={inputRef}
          id={label}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="cursor-pointer"
          disabled={isUploading}
        />
      )}

      {(error || uploadError) && (
        <p className="text-sm text-red-500">{error || uploadError}</p>
      )}
    </div>
  );
}
