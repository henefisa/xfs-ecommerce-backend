import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('/upload')
export class UploadController {
  @Get('/:fileId')
  async serveFile(@Param('fileId') fileId: string, @Res() response: Response) {
    response.sendFile(fileId, { root: 'upload' });
  }
}
