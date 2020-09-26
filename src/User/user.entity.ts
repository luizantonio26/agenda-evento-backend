import { Events } from 'src/Events/events.entity';
import { Invite } from 'src/Invite/invite.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    sobrenome: string;
    
    @Column({unique:true})
    email: string;

    @Column()
    password: string;

    @OneToMany(type=> Events, events=>events.organizador)
    events: Events[]

    @OneToMany(type=> Invite, invite=>invite.user)
    invite: Invite[]
}