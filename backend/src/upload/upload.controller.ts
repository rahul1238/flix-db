import { Controller, Post, UseInterceptors,UploadedFile } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { FileInterceptor} from "@nestjs/platform-express";

@Controller("api/upload")
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadService.uploadImage(file);
    return { url };
  }
}

