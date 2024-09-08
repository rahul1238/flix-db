import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CloudinaryConfigService } from './cloudinary.config';
import { UploadController } from './upload.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [UploadService, CloudinaryConfigService],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule {}
