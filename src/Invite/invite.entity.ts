import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import {User} from '../User/user.entity'
import { Events } from 'src/Events/events.entity';

@Entity()
export class Invite{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    status:string

    @Index({unique:true})
    @ManyToOne(type=>User, user=>user.invite, {onDelete:"CASCADE"})
    user:User

    @ManyToOne(type=>Events, events=>events.invite, {onDelete:"CASCADE"})
    events:Events

}