import { Module } from "@nestjs/common";
import { MessagesController } from "./messages.controller";
import { MessageService } from "./messages.service";
import { MessagesRepository } from "./messages.repository";

@Module({
  controllers: [MessagesController],
  // 다른 클래스의 의존성으로 사용될 수 있는 것들
  providers: [MessageService, MessagesRepository],
})
export class MessagesModule {}
