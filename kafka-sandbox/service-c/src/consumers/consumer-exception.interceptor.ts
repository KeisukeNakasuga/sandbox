import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { catchError, Observable } from "rxjs";

@Injectable()
export class ConsumerException implements NestInterceptor {
  constructor(
    private readonly cls: ClsService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
      return next.handle().pipe(
        catchError(error => {
          const value = this.cls.get('sampleKey');
          console.log(`CLS: ${value}`);
          throw error;
      })
    )
  }
}
