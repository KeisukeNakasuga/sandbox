import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [
              'kafka-broker-0:9092',
              'kafka-broker-1:9093',
              'kafka-broker-2:9094',
            ],
          },
          consumer: {
            groupId: 'service-c-consumer',
          }
        },
      },
    ]),
  ],
})
export class KafkaModule {}
