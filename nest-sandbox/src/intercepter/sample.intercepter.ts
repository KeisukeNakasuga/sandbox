import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class SampleIntercepter implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    console.log('run SampleIntercepter.intercept()');
    return next
      .handle()
      .pipe(
        tap(() => console.log('after run IntercepterController.run()'))
      );
  }
}
