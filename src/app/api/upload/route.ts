import { FileStorageApplicationService } from '@/lib/oss/application/file-storage-service';
import { storageProviderFactory } from '@/lib/oss/factory';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Upload API Route Handler
 *
 * Server-side API endpoint for file uploads.
 * Uses FileStorageApplicationService for orchestration.
 */
export async function POST(request: NextRequest) {
    try {
        // Parse form data
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({
                error: 'No file provided'
            }, { status: 400 });
        }

        // Initialize the application service
        const storageProvider = storageProviderFactory.getDefaultProvider();
        const applicationService = new FileStorageApplicationService(storageProvider);

        // Upload the file
        const result = await applicationService.uploadFile({
            file
        });

        if (!result.success) {
            return NextResponse.json({
                error: 'Upload failed',
                details: result.errors
            }, { status: 400 });
        }

        return NextResponse.json({
            url: result.url,
            key: result.key
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// Handle OPTIONS for CORS if needed
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
