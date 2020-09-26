import { IsNotEmpty } from 'class-validator';

export class UpdateEventsDto {
    @IsNotEmpty()
    readonly descricao: string;

    @IsNotEmpty()
    readonly data_inicio: Date;

    @IsNotEmpty()
    readonly data_fim: Date;
}