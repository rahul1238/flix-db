import { Controller, Get } from '@nestjs/common';

@Controller('api/genres')
export class GenresController {
  @Get()
  getAllgenere(): string {
    return 'all genere fecthed successfully';
  }
}
