import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import {User} from '../User/user.entity'
import { Events } from 'src/Events/events.entity';

@Entity()
export class Invite{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    status:string

    @ManyToOne(type=>User, user=>user.invite)
    user:User

    @ManyToOne(type=>Events, events=>events.invite)
    events:Events

}