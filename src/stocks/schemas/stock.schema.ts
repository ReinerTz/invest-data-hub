// src/database/schemas/stock.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PREFIX } from '../../utils/prefix.constants';

export type StockDocument = Stock & Document;

@Schema({ timestamps: true })
export class Stock {
  @Prop({ required: true })
  ticker: string;

  @Prop({ required: true })
  quote: number;

  @Prop({ required: true })
  pl: number;

  @Prop({ required: true })
  pvp: number;

  @Prop({ required: true })
  psr: number;

  @Prop({ required: true })
  dividendYield: number;

  @Prop({ required: true })
  priceToAsset: number;

  @Prop({ required: true })
  priceToWorkingCapital: number;

  @Prop({ required: true })
  priceToEbit: number;

  @Prop({ required: true })
  priceToCurrentAsset: number;

  @Prop({ required: true })
  evToEbit: number;

  @Prop({ required: true })
  evToEbitda: number;

  @Prop({ required: true })
  ebitMargin: number;

  @Prop({ required: true })
  netMargin: number;

  @Prop({ required: true })
  currentLiquidity: number;

  @Prop({ required: true })
  roic: number;

  @Prop({ required: true })
  roe: number;

  @Prop({ required: true })
  liquidityTwoMonths: number;

  @Prop({ required: true })
  netWorth: number;

  @Prop({ required: true })
  debtToEquity: number;

  @Prop({ required: true })
  growthRateFiveYears: number;
}

export const StockSchema = SchemaFactory.createForClass(Stock);

StockSchema.pre<Stock & Document>('save', function (next) {
  if (this.isNew) {
    this.id = `${PREFIX.STOCKS}_${this._id.toString()}`;
  }
  next();
});
