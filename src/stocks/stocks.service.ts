import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as cheerio from 'cheerio';
import { Model } from 'mongoose';
import { Stock, StockDocument } from '../stocks/schemas/stock.schema';
import { parseNumberFromString } from 'src/utils/number';
import { isToday } from 'date-fns';
import { UpdateControl } from './schemas/update-control.schema';

@Injectable()
export class StocksService {
  constructor(
    @InjectModel(Stock.name) private stockModel: Model<StockDocument>,
    @InjectModel(UpdateControl.name)
    private updateControlModel: Model<UpdateControl>,
  ) {}

  private async updateLastUpdateDate(): Promise<void> {
    const updateControl = await this.updateControlModel.findOne();
    if (updateControl) {
      updateControl.lastUpdate = new Date();
      await updateControl.save();
    } else {
      await this.updateControlModel.create({ lastUpdate: new Date() });
    }
  }

  private async shouldUpdate(): Promise<boolean> {
    const updateControl = await this.updateControlModel.findOne();
    const shouldUpdate = !updateControl || !isToday(updateControl.lastUpdate);
    console.log(`Should update? ${shouldUpdate}`);
    return shouldUpdate;
  }

  async update(): Promise<void> {
    const url = 'https://fundamentus.com.br/resultado.php';
    await this.createStocks(url);
    await this.updateLastUpdateDate();
  }

  private async createStocks(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      const body = await response.text();
      const $ = cheerio.load(body);

      const savePromises = [];

      $('table tbody tr').each((index, element) => {
        const tds = $(element).find('td');
        const ticker = $(tds[0]).text().trim();
        const quote = parseNumberFromString($(tds[1]).text());
        const pl = parseNumberFromString($(tds[2]).text());
        const pvp = parseNumberFromString($(tds[3]).text());
        const psr = parseNumberFromString($(tds[4]).text());
        const dividendYield = parseNumberFromString($(tds[5]).text());
        const priceToAsset = parseNumberFromString($(tds[6]).text());
        const priceToWorkingCapital = parseNumberFromString($(tds[7]).text());
        const priceToEbit = parseNumberFromString($(tds[8]).text());
        const priceToCurrentAsset = parseNumberFromString($(tds[9]).text());
        const evToEbit = parseNumberFromString($(tds[10]).text());
        const evToEbitda = parseNumberFromString($(tds[11]).text());
        const ebitMargin = parseNumberFromString($(tds[12]).text());
        const netMargin = parseNumberFromString($(tds[13]).text());
        const currentLiquidity = parseNumberFromString($(tds[14]).text());
        const roic = parseNumberFromString($(tds[15]).text());
        const roe = parseNumberFromString($(tds[16]).text());
        const liquidityTwoMonths = parseNumberFromString($(tds[17]).text());
        const netWorth = parseNumberFromString($(tds[18]).text());
        const debtToEquity = parseNumberFromString($(tds[19]).text());
        const growthRateFiveYears = parseNumberFromString($(tds[20]).text());

        const stock = new this.stockModel({
          ticker,
          quote,
          pl,
          pvp,
          psr,
          dividendYield,
          priceToAsset,
          priceToWorkingCapital,
          priceToEbit,
          priceToCurrentAsset,
          evToEbit,
          evToEbitda,
          ebitMargin,
          netMargin,
          currentLiquidity,
          roic,
          roe,
          netWorth,
          liquidityTwoMonths,
          debtToEquity,
          growthRateFiveYears,
        });

        savePromises.push(stock.save());
      });

      await Promise.all(savePromises); // Aguarda todas as operações de salvamento.
      console.log('Todos os registros foram salvos.');
    } catch (error) {
      console.error('Erro ao extrair dados:', error);
    }
  }

  async findLatestForEachTicker(): Promise<StockDocument[]> {
    const shouldUpdate = await this.shouldUpdate();

    if (shouldUpdate) {
      console.log('Updating stocks...');
      await this.update();
      console.log('Stocks are up to date');
    }

    return this.stockModel
      .aggregate([
        { $sort: { createdAt: -1 } },
        { $group: { _id: '$ticker', doc: { $first: '$$ROOT' } } },
        { $replaceRoot: { newRoot: '$doc' } },
      ])
      .exec();
  }

  async findHistory(): Promise<StockDocument[]> {
    return this.stockModel.find().exec();
  }

  async findByTicker(ticker: string): Promise<StockDocument> {
    const [stock] = await this.stockModel
      .aggregate([
        {
          $match: { ticker },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: '$ticker',
            doc: { $first: '$$ROOT' },
          },
        },
        {
          $replaceRoot: { newRoot: '$doc' },
        },
      ])
      .exec();

    return stock;
  }

  async findHistoryTicker(ticker: string): Promise<StockDocument[]> {
    return this.stockModel.find({ ticker }).exec();
  }

  async recommendation(): Promise<StockDocument[]> {
    const stock = await this.stockModel
      .aggregate([
        {
          $sort: { ticker: 1, createdAt: -1 },
        },
        {
          $group: {
            _id: '$ticker',
            doc: { $first: '$$ROOT' },
          },
        },
        {
          $replaceRoot: { newRoot: '$doc' },
        },
        {
          $match: {
            pl: { $gte: 3, $lte: 10 },
            pvp: { $gte: 0.5, $lte: 2 },
            dividendYield: { $gte: 7, $lte: 14 },
            roe: { $gt: 15 },
            liquidityTwoMonths: { $gte: 1000000 },
            growthRateFiveYears: { $gte: 10 },
          },
        },
      ])
      .exec();

    return stock;
  }
}
