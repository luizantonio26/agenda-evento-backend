import { Body, Controller, Delete, Get, Header, Param, Post, Put, Query } from "@nestjs/common";
import { CreateEventsDto } from "./dto/create-events.dto";
import { UpdateEventsDto } from "./dto/update-events.dto";
import { Events } from "./events.entity";
import { EventsRO } from "./events.interface";
import { EventsService } from "./events.service";

@Controller()
export class EventsController{
    constructor(private readonly eventsService:EventsService){}

    @Get('events')
    async findAll(@Query() userId:any): Promise<Events[]>{
        return this.eventsService.findAll(userId.userId)
    }

    @Get('events/:eventId')
    async findOne(@Param() eventId:number): Promise<Events>{
        return this.eventsService.findOne(eventId)
    }

    @Post('events')
    async create(@Body() events:CreateEventsDto): Promise<EventsRO>{
        return this.eventsService.create(events)
    }

    @Put('events/:id')
    async update(@Body() events:UpdateEventsDto, @Param() eventId:number){
        return this.eventsService.update(eventId, events)
    }

    @Delete('events/:id')
    async remove(@Param() eventId:number){
        return this.eventsService.remove(eventId)
    }
}