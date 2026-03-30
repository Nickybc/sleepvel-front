'use client';

import { useCallback, useState } from 'react';

interface UploadResponse {
    url: string;
    key: string;
}

interface UseUploadOptions {
    onSuccess?: (url: string) => void;
    onError?: (error: string) => void;
}

interface UseUploadReturn {
    upload: (fileOrFiles: File | File[]) => Promise<string | string[] | null>;
    isUploading: boolean;
    uploadError: string | null;
    progress: number;
}

/**
 * useUpload Hook
 *
 * Custom hook for handling file uploads to the server-side API.
 * Manages upload state and communicates with the /api/upload endpoint.
 * Supports both single and multiple file uploads.
 */
export function useUpload(options?: UseUploadOptions): UseUploadReturn {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const upload = useCallback(async (
        fileOrFiles: File | File[]
    ): Promise<string | string[] | null> => {
        setIsUploading(true);
        setUploadError(null);
        setProgress(0);

        try {
            const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];

            if (files.length === 0) {
                return Array.isArray(fileOrFiles) ? [] : null;
            }

            const uploadSingle = async (file: File): Promise<string> => {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Upload failed');
                }

                const data: UploadResponse = await response.json();
                return data.url;
            };

            const urls = await Promise.all(files.map(uploadSingle));

            setProgress(100);
            urls.forEach(url => options?.onSuccess?.(url));

            if (Array.isArray(fileOrFiles)) {
                return urls;
            }

            return urls[0] ?? null;

        } catch (error) {
            const message = error instanceof Error ? error.message : '上传失败';
            setUploadError(message);
            options?.onError?.(message);
            return Array.isArray(fileOrFiles) ? [] : null;

        } finally {
            setIsUploading(false);
        }
    }, [options]);

    return {
        upload,
        isUploading,
        uploadError,
        progress
    };
}
