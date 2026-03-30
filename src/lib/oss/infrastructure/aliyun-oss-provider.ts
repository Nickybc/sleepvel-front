import OSS from 'ali-oss';
import {
    IStorageProvider,
    StorageKey,
    UploadConfig,
    UploadResult
} from '../domain/types';

/**
 * Aliyun OSS Storage Provider
 *
 * Infrastructure implementation of storage provider for Aliyun Object Storage Service
 */
export class AliyunOSSProvider implements IStorageProvider {
    readonly name = "aliyun-oss";
    private readonly store: OSS;
    private readonly config: {
        accessKeyId: string;
        accessKeySecret: string;
        region: string;
        endpoint?: string;
        bucket?: string;
    };

    constructor(
        config: {
            accessKeyId: string;
            accessKeySecret: string;
            region: string;
            endpoint?: string;
            bucket?: string;
        }
    ) {
        if (!config.accessKeyId) {
            throw new Error('Aliyun OSS accessKeyId is required');
        }
        if (!config.accessKeySecret) {
            throw new Error('Aliyun OSS accessKeySecret is required');
        }
        if (!config.region) {
            throw new Error('Aliyun OSS region is required');
        }

        this.config = config;
        this.store = new OSS({
            accessKeyId: config.accessKeyId,
            accessKeySecret: config.accessKeySecret,
            region: config.region,
            endpoint: config.endpoint,
            authorizationV4: true,
            bucket: config.bucket,
            secure: true
        });
    }

    async upload(file: File, key: StorageKey, _config?: UploadConfig): Promise<UploadResult> {
        try {
            const uploadOptions: any = {
                headers: {}
            };

            const buffer = await this.fileToBuffer(file);
            await this.store.put(key.value, buffer, uploadOptions);
            const url = await this.getPresignedUrl(key);

            return {
                key: key.value,
                url,
                success: true
            };

        } catch (error) {
            console.error('Aliyun OSS upload error:', error);
            return {
                key: key.value,
                url: '',
                success: false,
                errors: [error instanceof Error ? error.message : 'Unknown error']
            };
        }
    }

    private async fileToBuffer(file: File): Promise<Buffer> {
        const arrayBuffer = await file.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }

    async getPresignedUrl(key: StorageKey, expiresIn: number = 3600): Promise<string> {
        try {
            const url = await this.store.signatureUrlV4('GET', expiresIn, {
                headers: {}
            }, key.value);

            return url;
        } catch (error) {
            console.error('Aliyun OSS presigned URL error:', error);
            throw new Error(`Failed to generate presigned URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async exists(key: StorageKey): Promise<boolean> {
        try {
            const result = await this.store.head(key.value);
            return !!result;

        } catch (error: any) {
            if (error.code === 'NoSuchKey' || error.status === 404) {
                return false;
            }

            console.error('Aliyun OSS exists check error:', error);
            return false;
        }
    }

    async getMetadata(key: StorageKey): Promise<{
        size: number;
        contentType: string;
        lastModified: Date;
        etag?: string;
    }> {
        try {
            const result = await this.store.head(key.value);
            const headers = result.res?.headers as Record<string, string> || {};

            return {
                size: parseInt(headers['content-length'] || '0', 10),
                contentType: headers['content-type'] || 'application/octet-stream',
                lastModified: new Date(headers['last-modified'] || Date.now()),
                etag: headers.etag
            };

        } catch (error) {
            console.error('Aliyun OSS metadata error:', error);
            throw new Error(`Failed to get metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
