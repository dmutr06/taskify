import type { Message } from "./message.interface";
import type { User } from "./user.interface";


export interface Chat {
  id: string,
  name?: string,
  isGroup: boolean,
  users: User[],
}

export interface ChatWithMessages extends Chat {
  messages: Message[],
}
