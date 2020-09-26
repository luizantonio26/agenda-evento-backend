import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    readonly nome: string;

    @IsNotEmpty()
    readonly sobrenome: string;

    @IsNotEmpty()
    readonly email: string;
    
    @IsNotEmpty()
    readonly password: string;
}