import { Injectable } from "@nestjs/common";

@Injectable()
export class GuardsService {
  run() {
    console.log('run GuardsService.run()');
  }
}
