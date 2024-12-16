import { Controller, Get } from "@nestjs/common";
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from "@nestjs/terminus";

@Controller('health')
export class HealthCheckController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  public check() {
    return this.health.check([
      () => this.http.responseCheck(
        'nestjs-sandbox',
        'http://localhost:3000',
        (res) => res.status == 200,
      )
    ]);
  } 
}  
