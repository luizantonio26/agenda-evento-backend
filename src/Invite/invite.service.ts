import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { Observable } from "rxjs";
import { Events } from "src/Events/events.entity";
import { User } from "src/User/user.entity";
import { getRepository, Repository } from "typeorm";
import { Invite } from "./invite.entity";

@Injectable()
export class InviteService{
    constructor (
        @InjectRepository(Invite)
        private readonly invite:Repository<Invite>,

        @InjectRepository(User)
        private readonly user:Repository<User>,
        
        @InjectRepository(Events)
        private readonly events:Repository<Events>
    ){}

    async create(data:any):Promise<Invite>{
        const {email, eventId} = data;
        const user = await this.user.findOne({
            where: {email}
        })
        console.log(data)
        const [events] = await this.events.findByIds([eventId], {relations:['organizador']})
        if((user && events) && events.organizador.id !== user.id){
            const new_invite = new Invite();
            new_invite.events = events;
            new_invite.user = user;
            new_invite.status = "aguardando";

            
            const errors = await validate(new_invite)

            if(errors.length > 0){
                throw new HttpException({message: 'error'}, HttpStatus.BAD_REQUEST)
            }else{
                try{
                    const savedInvite = await this.invite.save(new_invite)
                    return savedInvite
                }catch(exception){
                    if(exception.code === 'ER_DUP_ENTRY'){
                        throw new HttpException({message: 'usuario ja foi convidado para este evento'}, HttpStatus.BAD_REQUEST)
                    }
                }
            }
        }else{
            throw new HttpException({message: 'não é possivel convidar a si mesmo'}, HttpStatus.BAD_REQUEST)
        }
    }

    async findWaitingInvites(userId:number):Promise<Invite[]>{
        const [user] = await this.user.findByIds([userId])

        const qb = await getRepository(Invite).createQueryBuilder('invite')
        .innerJoinAndSelect('invite.events', 'events')
        .innerJoinAndSelect('invite.user', 'user')
        .innerJoinAndSelect('events.organizador', 'organizador')
        .where('invite.userId = :id', {id:userId})
        .andWhere('invite.status', {status:"aguardando"})
        .getMany()
        return qb
        // return await this.invite.find({
        //     where:{user, status:"aguardando"},
        //     relations:['events']
        // })
    }

    async findAceptedInvites(eventId:number):Promise<Invite[]>{
        const [event] = await this.events.findByIds([eventId])
        return await this.invite.find({
            relations:['user', 'events'],
            where:{
                events:event,
                status:"aceito"
            }
        })
    }

    async findRefusedInvites(eventId:number):Promise<Invite[]>{
        const [event] = await this.events.findByIds([eventId])
        return await this.invite.find({
            relations:['user', 'events'],
            where:{
                events:event,
                status:"recusado"
            }
        })
    }

    async confirmInvite(inviteId:number, data:any):Promise<Invite>{
        const {userId, status} = data
        const [user] = await this.user.findByIds([userId])
        let [qb] = await getRepository(Invite).findByIds([inviteId], {
            where: {user}
        })
        
        qb.status = status
        await this.invite.update(inviteId, qb)
        return qb
    }
}