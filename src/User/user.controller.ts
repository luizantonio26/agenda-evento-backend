import { Controller, Get, Post, Body, Put, Param, Delete } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRO } from "./user.interface";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserLoginDto } from "./dto/user-login.dto";


@Controller()
export class UserController{
    constructor(private readonly userService:UserService){}

    @Get('user/:id')
    async find(@Param() id:number):Promise<User>{
        return await this.userService.findAll(id)
    }

    @Post('login')
    async login(@Body() user:UserLoginDto):Promise<UserRO>{
        return await this.userService.login(user)
    }

    @Post('user')
    async create(@Body() user:CreateUserDto):Promise<UserRO>{
        return await this.userService.create(user)
    }

    @Put('user/:id')
    async update(@Param('id') userId: number, @Body() userData: UpdateUserDto){
        await this.userService.update(userId, userData)
    }

    @Delete('user/:id')
    async delete(@Param('id') userId: number){
        await this.userService.delete(userId)
    }
}