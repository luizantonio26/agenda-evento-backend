import { User } from "src/User/user.entity";

export interface eventData{
    descricao: string,
    data_inicio: Date,
    data_fim: Date,
    organizador: User,
    convidados: User[]
}

export interface EventsRO {
    events:eventData
}