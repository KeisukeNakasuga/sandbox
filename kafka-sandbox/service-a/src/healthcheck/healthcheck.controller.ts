import { Controller, Get, Inject } from "@nestjs/common";
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from "@nestjs/terminus";

@Controller('healthcheck')
export class HealthCheckController {
  @Inject(HealthCheckService)
  private readonly healthCheckService: HealthCheckService;
  @Inject(HttpHealthIndicator)
  private readonly httpHealthIndicator: HttpHealthIndicator;

  @Get('app')
  @HealthCheck()
  public checkApp() {
    return this.healthCheckService.check([
      () => this.httpHealthIndicator.responseCheck(
        process.env.SERVICE_NAME,
        'http://localhost:3000',
        (res) => res.status == 200,
      )
    ]);
  }
}
