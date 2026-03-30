import {
    IStorageProvider,
    StorageKey,
    UploadConfig,
    UploadResult
} from '../domain/types';

/**
 * Upload file command
 */
export interface UploadFileCommand {
    userId?: string;
    file: File;
    tags?: string[];
}

/**
 * File Storage Application Service
 *
 * Application layer service that orchestrates file uploads using storage providers.
 * This is the main entry point for uploading files in the application.
 */
export class FileStorageApplicationService {
    private readonly storageProvider: IStorageProvider;

    constructor(storageProvider: IStorageProvider) {
        this.storageProvider = storageProvider;
    }

    /**
     * Upload a file using the configured storage provider
     *
     * @param command - Upload command containing the file and optional metadata
     * @returns Promise resolving to UploadResult with URL and key
     */
    async uploadFile(command: UploadFileCommand): Promise<UploadResult> {
        const { file, tags } = command;

        // Generate storage key
        const key = this.generateFileKey(file);

        // Prepare upload config
        const config: UploadConfig = {
            tags
        };

        // Upload using provider
        const result = await this.storageProvider.upload(file, key, config);

        return result;
    }

    /**
     * Generate a unique storage key for the file
     */
    private generateFileKey(file: File): StorageKey {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const extension = file.name.split('.').pop();
        return { value: `sleep-reports/${timestamp}-${random}.${extension}` };
    }

    /**
     * Check if a file exists in storage
     */
    async fileExists(key: StorageKey): Promise<boolean> {
        return this.storageProvider.exists(key);
    }

    /**
     * Get metadata for a stored file
     */
    async getFileMetadata(key: StorageKey): Promise<{
        size: number;
        contentType: string;
        lastModified: Date;
        etag?: string;
    }> {
        return this.storageProvider.getMetadata(key);
    }

    /**
     * Get a presigned URL for downloading a file
     */
    async getDownloadUrl(key: StorageKey, expiresIn: number = 3600): Promise<string> {
        return this.storageProvider.getPresignedUrl(key, expiresIn);
    }
}
