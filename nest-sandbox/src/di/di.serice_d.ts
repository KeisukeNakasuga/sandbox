import { Injectable } from "@nestjs/common";
import { DiServiceInterface } from "./di.service_c";

@Injectable()
export class DiServiceD implements DiServiceInterface {
  public run() {
    console.log('run DiServiceD.run()');
  }
}
