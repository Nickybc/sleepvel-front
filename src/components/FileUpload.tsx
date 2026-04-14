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
              className="flex items-center justify-between p-3 border border-border bg-secondary/30 rounded-xl transition-all hover:bg-secondary/50"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <svg
                    className="h-4 w-4 text-primary"
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
                </div>
                <p className="text-sm font-medium text-foreground truncate">
                  {fileNames[index] || `文件 ${index + 1}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="ml-2 shrink-0 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
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
        <div className="flex items-center justify-between p-4 border border-border bg-secondary/30 rounded-xl transition-all hover:bg-secondary/50">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <svg
                className="h-5 w-5 text-primary"
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
            </div>
            <p className="text-sm font-medium text-foreground truncate">
              {fileNames[0] || '已上传'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="ml-3 shrink-0 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            清除
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-3">
      <Label htmlFor={label} className="text-sm font-medium text-foreground">
        <span>{label}</span>
        {typeIndicator ? (
          <span className="ml-2 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {typeIndicator}
          </span>
        ) : null}{' '}
        {required && <span className="text-destructive">*</span>}
      </Label>

      {renderFileList()}

      {isUploading && (
        <div className="flex items-center justify-center p-4 border-2 border-dashed border-primary/30 bg-primary/5 rounded-xl">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent mr-3" />
          <span className="text-sm text-muted-foreground">文件上传中...</span>
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
          className="cursor-pointer file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/20 transition-all"
          disabled={isUploading}
        />
      )}

      {(error || uploadError) && (
        <p className="text-sm text-destructive">{error || uploadError}</p>
      )}
    </div>
  );
}
