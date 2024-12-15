import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class SampleGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('run SampleGuard.canActivate()');
    return true;
  }
}
