import { type } from "os";
import { User } from "src/User/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Events{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    descricao:string;

    @Column({type:"datetime"})
    data_inicio:Date;

    @Column({type:"datetime"})
    data_fim:Date;

    @ManyToOne(type=>User, organizador=> organizador.events)
    organizador: User

    @ManyToMany(type=> User)
    @JoinTable()
    convidados: User[]

}