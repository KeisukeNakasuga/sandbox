import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { lastValueFrom, Observable, tap } from "rxjs";

@Injectable()
export class ConsumerRunInterceptor implements NestInterceptor {
  constructor(
    private readonly cls: ClsService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return this.cls.run(() => {
        this.cls.set('sampleKey', 'sampleValue');
        console.log(`CLS Run: Key set to ${this.cls.get('sampleKey')}`); // 設定確認用
        
        return next.handle().pipe(
            tap(() => console.log('Handler completed successfully in CLS context')), 
        );
    });
  }
}
