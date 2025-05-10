import { Body, Controller, Post } from "@nestjs/common";
import { PostDto } from "./post.dto";
import { AppLogger } from "./log.middleware";

@Controller()
export class LogController {
  @Post('/post')
  post(@Body() dto: PostDto): string {
    AppLogger.info(dto.title);
    AppLogger.info(dto.content);
    return 'post success!';
  }
}
