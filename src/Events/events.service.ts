import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { User } from "src/User/user.entity";
import { getRepository, Repository } from "typeorm";
import { CreateEventsDto } from "./dto/create-events.dto";
import { UpdateEventsDto } from "./dto/update-events.dto";
import { Events } from "./events.entity";
import { EventsRO } from "./events.interface";

@Injectable()
export class EventsService{
    constructor(
        @InjectRepository(Events)
        private readonly events: Repository<Events>,

        @InjectRepository(User)
        private readonly user: Repository<User>
    ){}

    async findOne(eventId:number): Promise<Events>{
        const events = await this.events.findByIds([eventId['eventId']])
        return events[0]
    }

    async findAll(userId: number): Promise<Events[]>{
        const [user] = await this.user.findByIds([userId])
        return await getRepository(Events).createQueryBuilder('events')
        .innerJoinAndSelect("events.organizador", "organizador")
        .where("organizador.id = :userId", {userId})
        .andWhere("events.data_inicio > now()")
        .getMany()
    }

    async create(dto:CreateEventsDto): Promise<EventsRO>{
        const user_ = await this.user.findByIds([dto.organizador.id])
        console.log(dto.data_inicio)
        if(user_){
            const new_events = new Events;
            
            if(await this.validaEvento(user_[0], dto)){
                new_events.descricao = dto.descricao
                new_events.data_inicio = dto.data_inicio
                new_events.data_fim = dto.data_fim
                new_events.organizador = user_[0]

                const errors = await validate(new_events)

                if(errors.length > 0){
                    throw new HttpException({message: 'error'}, HttpStatus.BAD_REQUEST)
                }else{
                    const savedEvents = await this.events.save(new_events)
                    return this.buildEventsRO(savedEvents)
                }
            }else{
                throw new HttpException({message: 'ja possui eventos cadastrado durante essa data e horario'}, HttpStatus.BAD_REQUEST)
            }
        }
    }

    async update(eventId:number , dto:UpdateEventsDto){
        const [qb] = await getRepository(Events).findByIds([eventId], {
            relations:['organizador']
        })

        if(qb){
            if(await this.validaEvento(qb.organizador, dto)){
                qb.descricao = dto.descricao;
                qb.data_inicio = dto.data_inicio
                qb.data_fim = dto.data_fim

                await this.events.update(eventId, qb)
            }
        }
    }

    async remove(eventId: number){
        const [qb] = await getRepository(Events).findByIds([eventId])
        console.log("entrou")
        if(qb){
            await this.events.delete(qb)
        }
    }

    private buildEventsRO(events: Events) {
        const eventsRO = {
          id: events.id,
          descricao: events.descricao,
          data_inicio: events.data_inicio,
          data_fim: events.data_fim,
          organizador: events.organizador,
        };
    
        return {events: eventsRO};
    }

    private async validaEvento(user:User, dto:UpdateEventsDto):Promise<boolean>{
        const date_ini = new    Date(dto.data_inicio)
            const date_end = new Date(dto.data_fim)
            const events = await this.events.find({
                where: {organizador:user}
            })
            const now = new Date(Date.now())
            if(date_ini >= now && date_ini < date_end){
                events.forEach(e => {
                    const dt_ini = new Date(e.data_inicio)
                    const dt_end = new Date(e.data_fim)
                    
    
                    if(date_ini <= dt_end || date_end <= dt_ini || date_end < date_ini){
                        return false;
                    }
                })
                return true
            }else{
                throw new HttpException({message: 'a data do inicio do evento ja passou'}, HttpStatus.BAD_REQUEST);
            }
    }
}