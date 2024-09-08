import { Injectable } from '@nestjs/common';
import { CloudinaryConfigService } from './cloudinary.config';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadService {
  constructor(
    private readonly cloudinaryConfigService: CloudinaryConfigService,
  ) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const cloudinary = this.cloudinaryConfigService.getCloudinary();

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'flixdb' },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (result) {
            resolve(result.secure_url);
          } else {
            reject(error);
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
