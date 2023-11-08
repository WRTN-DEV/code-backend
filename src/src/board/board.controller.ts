import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardEntity } from './board.entity';

@Controller('board')
export class BoardController {
    constructor(private boardService: BoardService){}

    logger = new Logger(BoardController.name);
    
    @Get()
    async getBoards(): Promise<BoardEntity[]>{
        return await this.boardService.getBoards();
    }

    @Get('/:id')
    async getBoardById(@Param('id', ParseIntPipe) id : number): Promise<BoardEntity>{
        id = Number(id);
        return await this.boardService.getBoardById(id);
    }

    @Post()
    async createBoard(@Body() boardEntity : BoardEntity): Promise<BoardEntity>{
        const { title, contents, status } = boardEntity;
        return await this.boardService.createBoard(title, contents, status);
    }

    @Patch('/:id')
    async updateBoardById(@Param('id',ParseIntPipe) id: number, @Body() boardEntity : BoardEntity): Promise<BoardEntity>{
        const { title, contents, status } = boardEntity;
        return await this.boardService.updateBoardById(id, title, contents, status);
    }

    @Delete('/:id')
    async deleteBoardById(@Param('id',ParseIntPipe) id: number): Promise<boolean>{
        return await this.boardService.deleteBoardById(id);
    }
}
