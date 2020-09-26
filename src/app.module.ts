import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventsModule } from './Events/events.module';
import { UserModule } from './User/user.module'
@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, EventsModule],
  providers: [],
})
export class AppModule {}
