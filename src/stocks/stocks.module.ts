import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Stock, StockSchema } from '../stocks/schemas/stock.schema';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import {
  UpdateControl,
  UpdateControlSchema,
} from './schemas/update-control.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UpdateControl.name, schema: UpdateControlSchema },
      { name: Stock.name, schema: StockSchema },
    ]),
  ],
  exports: [MongooseModule],
  providers: [StocksService],
  controllers: [StocksController],
})
export class StocksModule {}
