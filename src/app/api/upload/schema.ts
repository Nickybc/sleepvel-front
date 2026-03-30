import { z } from "zod";

export const maxSize = 20 * 1024 * 1024;
export const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'text/csv',
    'application/json',
    'application/xml',
    'text/xml',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const UploadRequestSchema = z.object({
    file: z.instanceof(File).refine(file => file.size < maxSize, {
        message: "File must be smaller than 20MB",
    }).refine(file => allowedTypes.includes(file.type), {
        message: "File type not allowed",
    }),
    tags: z.string().optional() // Comma-separated tags
});


export const UploadResponseSchema = z.object({
    url: z.string().url(),
    key: z.string().uuid(),
});

export type UploadRequest = z.infer<typeof UploadRequestSchema>;
export type UploadResponse = z.infer<typeof UploadResponseSchema>;