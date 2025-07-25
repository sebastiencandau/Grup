import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilitiesModule } from './availabilities/availabilities.module';
import { EstablishmentsModule } from './establishments/establishments.module';
import { typeOrmConfig } from './typeorm.config';
import { ReservationsModule } from './reservations/reservations.module';
// autres imports...
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AvailabilitiesModule,
    EstablishmentsModule,
    ReservationsModule
    // autres modules...
  ],
})
export class AppModule {}
