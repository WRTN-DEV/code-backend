import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { BoardRepository } from './board.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardEntity } from './board.entity';
import { cacheModuleConfig } from 'src/config/cache.config';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';


@Module({
  imports :[
    TypeOrmModule.forFeature([BoardEntity]),
    CacheModule.register<RedisClientOptions>(cacheModuleConfig)
  ],
  controllers: [BoardController],
  providers: [BoardService, BoardRepository],
})
export class BoardModule {}
