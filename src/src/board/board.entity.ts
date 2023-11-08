import { IsIn, IsInt, IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum BoardStatus{
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}

@Entity()
export class BoardEntity{
    @PrimaryGeneratedColumn({type:'int'})
    id: number;

    @IsNotEmpty()
    @Column({nullable : true})
    title: string;

    @IsNotEmpty()
    @Column({nullable : true})
    contents: string;

    @IsIn([BoardStatus.PRIVATE, BoardStatus.PUBLIC, undefined])
    @Column({nullable : true})
    status: BoardStatus;
}
