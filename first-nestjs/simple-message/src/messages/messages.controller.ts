import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
} from "@nestjs/common";
import { CreateMessageDto } from "./dtos/create-message.dto";
import { MessageService } from "./messages.service";

@Controller("messages")
export class MessagesController {
  constructor(public messagesService: MessageService) {}

  @Get()
  listMessages() {
    return this.messagesService.findAll();
  }

  @Post()
  createMessage(@Body() body: CreateMessageDto) {
    return this.messagesService.create(body.content);
  }

  @Get("/:id")
  async getMessage(@Param("id") id: string) {
    const message = await this.messagesService.findOne(id);

    if (!message) throw new NotFoundException("메시지가 없습니다.");
    return message;
  }
}
