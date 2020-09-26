import { Module} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Events } from "./events.entity";
import { EventsService } from "./events.service";
import { EventsController } from "./events.controller";
import { User } from "src/User/user.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Events, User])],
    providers: [EventsService],
    controllers: [
        EventsController
    ],
    exports: [EventsService]
})
export class EventsModule{}