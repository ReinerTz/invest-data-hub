import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { StocksModule } from './stocks/stocks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true, // Torna as configurações acessíveis globalmente
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: process.env.DATABASE_NAME,
      autoCreate: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    StocksModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
