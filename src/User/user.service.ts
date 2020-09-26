import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Repository, getRepository } from 'typeorm'
import { UserRO } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserLoginDto } from './dto/user-login.dto';


@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private readonly user: Repository<User>
    ){}

    async findAll(id:number): Promise<User>{
        const [user] = await this.user.findByIds([id])
        return user;
    }
    
    async login(user:UserLoginDto): Promise<UserRO>{
        const user_log = await this.user.findOne({where:{
            email:user.email,
            password:user.password
        }})
        console.log(user)
        if(user_log){
            console.log(user_log)
            return this.buildUserRO(user_log)
        }else{
            throw new HttpException({message: 'Email or Password invalid'}, HttpStatus.BAD_REQUEST)
        }
    }
    async create(dto: CreateUserDto): Promise<UserRO>{
        const {nome, sobrenome, email, password} = dto;
        const qb = getRepository(User)
        .createQueryBuilder('user')
        .where('user.email = :email', {email})

        const user = await qb.getOne()

        if(user){
            const errors = {email:"email must be unique"}
            throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST)
        }
        
        let newUser = new User;
        newUser.nome = nome
        newUser.sobrenome = sobrenome
        newUser.password = password
        newUser.email = email

        const errors = await validate(newUser)

        if (errors.length > 0) {
            const _errors = {username: 'Userinput is not valid.'};
            throw new HttpException({message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);
      
        } else {
            const savedUser = await this.user.save(newUser);
            console.log(savedUser)
            return this.buildUserRO(savedUser)
        }
    }

    async update(userId: number, dto: UpdateUserDto){
        const [qb] = await getRepository(User).findByIds([userId]) 
        if(qb){
            qb.nome = dto.nome
            qb.sobrenome = dto.sobrenome
        
            await this.user.update(userId, qb)
        }else{
            const _errors = {username: 'User not found'};
            throw new HttpException({message: 'user not found', _errors}, HttpStatus.BAD_REQUEST);
    
        }
    }

    async delete(userId: number){
        const [qb] = await getRepository(User).findByIds([userId])

        if(qb){
            await this.user.delete(userId)
        }
    }

    private buildUserRO(user: User) {
        const userRO = {
          id: user.id,
          nome: user.nome,
          sobrenome: user.sobrenome,
          email: user.email,
          password: user.password,
        };
    
        return {user: userRO};
      }
}