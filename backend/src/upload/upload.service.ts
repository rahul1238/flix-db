import { Injectable } from '@nestjs/common';
import { CloudinaryConfigService } from './cloudinary.config';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
// Local minimal Multer file type (kept in sync with controller)
interface UploadedFileType {
  fieldname: string;
  originalname: string;
  encoding?: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  path?: string;
}
import * as streamifier from 'streamifier';

@Injectable()
export class UploadService {
  constructor(
    private readonly cloudinaryConfigService: CloudinaryConfigService,
  ) {}

  async uploadImage(file: UploadedFileType): Promise<string> {
    const cloudinary = this.cloudinaryConfigService.getCloudinary();

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'flixdb' },
        (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
          if (result && result.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(error || new Error('Cloudinary upload failed'));
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
