import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { Invite } from "./invite.entity";
import { InviteService } from "./invite.service";

@Controller()
export class InviteController{
    constructor (private inviteService:InviteService){}

    @Post('invite')
    async create(@Body() data:any):Promise<Invite>{
        return this.inviteService.create(data)
    }

    @Get("aceptedInvites/:eventId")
    async findAceptedInvites(@Param() eventId:any):Promise<Invite[]>{
        return this.inviteService.findAceptedInvites(eventId.eventId)
    }

    @Get("refusedInvites/:eventId")
    async findRefusedInvites(@Param() eventId:any):Promise<Invite[]>{
        return this.inviteService.findRefusedInvites(eventId.eventId)
    }

    @Get("waitingInvites/user/:userId")
    async findWaitingInvites(@Param() userId:any):Promise<Invite[]>{
        return this.inviteService.findWaitingInvites(userId.userId)
    }

    @Put("confirmInvite/:id")
    async confirmInvite(@Param() inviteId:number, @Body() data:any):Promise<Invite>{
        return this.inviteService.confirmInvite(inviteId, data)
    }
}