import { Controller, Get, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import * as path from 'path';
import * as fs from 'fs';

@Controller('videos')
export class VideosController {
  @Get('1')
  stream(
    @Req() req: Request,
    @Res() res: Response) {
    // video path
    const vPath = path.join(process.cwd(), 'videos', 'big_buck_bunny_1080p.mp4');
    const { size } = fs.statSync(vPath);
    const range = req.headers.range;

    if (!range) {
      res.writeHead(200, {
        'Content-Length': size,
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes'
      });
      fs.createReadStream(vPath).pipe(res);
      return;
    }

    const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : size - 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Content-Type': 'video/mp4'
    });
    fs.createReadStream(vPath, { start, end }).pipe(res);
  }
}
