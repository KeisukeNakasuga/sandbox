import { Injectable } from "@nestjs/common";

@Injectable()
export class DiServiceB {
  public run() {
    console.log('run DiServiceB.run()');
  }
}
