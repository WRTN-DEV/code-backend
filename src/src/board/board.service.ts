import { HttpException, Injectable, Logger } from '@nestjs/common';
import { BoardRepository } from './board.repository';
import { BoardStatus } from './board.entity';

@Injectable()
export class BoardService {
    constructor(private boardRepository: BoardRepository){}

    logger = new Logger(BoardService.name);

    async getBoards(){
        return await  this.boardRepository.getBoards();
    }

    async getBoardById(id: number){
        return await this.boardRepository.getBoardById(id);
    }

    async createBoard(title: string, contents: string, status: BoardStatus){
        return await this.boardRepository.createBoard(title, contents, status);
    }

    async deleteBoardById(id: number){
        const ret = await this.boardRepository.deleteBoardById(id);
        if (!ret)
            throw new HttpException('Not Found', 404);
        return ret;
    }

    async updateBoardById(id: number, title: string, contents: string, status: BoardStatus){
        const ret = await this.boardRepository.updateBoardById(id, title, contents, status);
        if (!ret)
            throw new HttpException('Not Found', 404);
        return ret;
    }

}
