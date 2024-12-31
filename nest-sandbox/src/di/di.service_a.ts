import { Injectable } from "@nestjs/common";

@Injectable()
export class DiServiceA {
  public run() {
    console.log('run DiServiceA.run()');
  }
}
