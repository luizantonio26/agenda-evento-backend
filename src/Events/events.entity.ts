import { Invite } from "src/Invite/invite.entity";
import { User } from "src/User/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"

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

    @OneToMany(type=>Invite, invite=> invite.events)
    invite: Invite[]
}