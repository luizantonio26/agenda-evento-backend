import { IsNotEmpty } from 'class-validator';
import { User } from 'src/User/user.entity';

export class CreateEventsDto {
    @IsNotEmpty()
    readonly descricao: string;

    @IsNotEmpty()
    readonly data_inicio: Date;

    @IsNotEmpty()
    readonly data_fim: Date;

    @IsNotEmpty()
    readonly organizador: User;
}