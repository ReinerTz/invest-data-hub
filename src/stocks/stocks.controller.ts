import { Controller, Get, Param } from '@nestjs/common';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stockService: StocksService) {}

  @Get()
  findAll() {
    return this.stockService.findLatestForEachTicker();
  }

  @Get('history')
  findHistory() {
    return this.stockService.findHistory();
  }

  @Get('recommendation')
  recommendation() {
    return this.stockService.recommendation();
  }

  @Get(':ticker')
  findByTicker(@Param('ticker') ticker: string) {
    console.log('hi');
    return this.stockService.findByTicker(ticker);
  }

  @Get(':ticker/history')
  findHistoryTicker(@Param('ticker') ticker: string) {
    return this.stockService.findHistoryTicker(ticker);
  }
}
