import { Module} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/User/user.entity";
import { Events } from "src/Events/events.entity";
import { InviteService } from "src/Invite/invite.service"
import { InviteController } from "src/Invite/invite.controller";
import { Invite } from "./invite.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Invite, Events, User])],
    providers: [InviteService],
    controllers: [
        InviteController
    ],
    exports: [InviteService]
})

export class InviteModule{}