/**
 * Storage Domain Types
 * Core interfaces for the storage abstraction layer
 */

export interface StorageKey {
    value: string;
}

export interface UploadConfig {
    bucket?: string;
    tags?: string[];
}

export interface UploadResult {
    key: string;
    url: string;
    success: boolean;
    errors?: string[];
}

export interface IStorageProvider {
    readonly name: string;
    upload(file: File, key: StorageKey, config?: UploadConfig): Promise<UploadResult>;
    getPresignedUrl(key: StorageKey, expiresIn?: number): Promise<string>;
    exists(key: StorageKey): Promise<boolean>;
    getMetadata(key: StorageKey): Promise<{
        size: number;
        contentType: string;
        lastModified: Date;
        etag?: string;
    }>;
}

export interface IStorageProviderFactory {
    createProvider(providerName: string): IStorageProvider;
    getDefaultProvider(): IStorageProvider;
    registerProvider(name: string, provider: IStorageProvider): void;
    getAvailableProviders(): string[];
    isProviderAvailable(providerName: string): boolean;
}
