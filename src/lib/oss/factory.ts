import {
    IStorageProvider,
    IStorageProviderFactory
} from './domain/types';
import { AliyunOSSProvider } from './infrastructure/aliyun-oss-provider';

/**
 * Storage Provider Factory
 *
 * Creates and manages different storage provider instances.
 * Uses server-side environment variables (not NEXT_PUBLIC_*).
 */
export class StorageProviderFactory implements IStorageProviderFactory {
    private providers: Map<string, IStorageProvider> = new Map();

    constructor() {
        this.initializeProviders();
    }

    createProvider(providerName: string): IStorageProvider {
        const provider = this.providers.get(providerName);
        if (!provider) {
            throw new Error(`Unknown storage provider: ${providerName}`);
        }
        return provider;
    }

    getDefaultProvider(): IStorageProvider {
        const defaultProviderName = process.env.DEFAULT_STORAGE_PROVIDER || 'aliyun-oss';
        return this.createProvider(defaultProviderName);
    }

    registerProvider(name: string, provider: IStorageProvider): void {
        this.providers.set(name, provider);
    }

    private initializeProviders(): void {
        // Initialize Aliyun OSS provider
        if (this.shouldInitializeAliyunOSS()) {
            const aliyunProvider = new AliyunOSSProvider({
                accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID!,
                accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET!,
                region: process.env.ALIYUN_OSS_REGION!,
                endpoint: process.env.ALIYUN_OSS_ENDPOINT,
                bucket: process.env.ALIYUN_OSS_BUCKET
            });
            this.registerProvider('aliyun-oss', aliyunProvider);
        }
    }

    private shouldInitializeAliyunOSS(): boolean {
        return !!(
            process.env.ALIYUN_ACCESS_KEY_ID &&
            process.env.ALIYUN_ACCESS_KEY_SECRET &&
            process.env.ALIYUN_OSS_REGION
        );
    }

    getAvailableProviders(): string[] {
        return Array.from(this.providers.keys());
    }

    isProviderAvailable(providerName: string): boolean {
        return this.providers.has(providerName);
    }
}

// Singleton instance
export const storageProviderFactory = new StorageProviderFactory();
