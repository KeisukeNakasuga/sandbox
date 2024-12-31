import { Injectable } from "@nestjs/common";

export interface DiServiceInterface {
  run(): void;
}

@Injectable()
export class DiServiceC implements DiServiceInterface {
  public run() {
    console.log('run DiServiceC.run()');
  }
}
