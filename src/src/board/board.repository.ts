import { ConflictException, HttpException, Inject, InternalServerErrorException, Logger } from "@nestjs/common";
import { BoardEntity, BoardStatus } from "./board.entity";
import { type } from "os";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from 'cache-manager';



export class BoardRepository extends Repository<BoardEntity>{
    constructor(@InjectRepository(BoardEntity) private dataSource: DataSource, @Inject(CACHE_MANAGER) private cacheManager: Cache){
        super(BoardEntity, dataSource.manager);
    }

    logger = new Logger(BoardRepository.name);


    async createBoard(title: string, contents: string, status: BoardStatus) : Promise<BoardEntity>{
        status = status || BoardStatus.PUBLIC;
        const board = this.create({title, contents, status});
        try {
            await this.save(board);
          } catch (error) {
            if (error.code === '23505') {
              throw new ConflictException(error.message);
            } else {
              throw new InternalServerErrorException(error.message);
            }
          }
        await this.cacheManager.store.set(board.id.toString(), board);
        return board;
    }

    async getBoards(): Promise<any>{
        const cache :Promise<BoardEntity>[] = await this.cacheManager.store.keys();
        if (cache.length > 0){
            try {
                const ret = [];
                for (const key of cache){
                    const board = await this.cacheManager.store.get(key);
                    ret.push(board);
                }
                ret.sort((a, b) => a.id - b.id);
                return ret;                
            } catch (error) {
                throw new InternalServerErrorException(error.message);   
            }
        }
        const ret =  await this.find({order: { id: 'ASC' }});
        return ret;
    }

    async getBoardById(id: number){
        const cache = await this.cacheManager.store.get(id.toString());
        if (cache)
            return cache;
        const ret = await this.findOneBy({id});
        if (!ret)
            throw new HttpException('Not Found', 404);
        return ret;
    }

    async deleteBoardById(id: number) : Promise<boolean>{
        const result = await this.delete({ id: id});
        if (result.affected !== 1)
            throw new InternalServerErrorException(
                `UserEntity delete failed. UserEntity id: ${id}`,
            );
        await this.cacheManager.store.del(id.toString());
        return true;
    }

    async updateBoardById(id: number, title: string, contents: string, status: BoardStatus) : Promise<BoardEntity>{
        const board = await this.getBoardById(id);
        if (!board)
            throw new HttpException('Not Found', 404);
        board.title = title || board.title;
        board.contents = contents || board.contents;
        board.status = status || board.status;
        await this.save(board);
        await this.cacheManager.store.set(board.id.toString(), board);
        return board;
        //return board;
    }
}