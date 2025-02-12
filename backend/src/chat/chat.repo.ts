import { Elysia } from "elysia";
import { prisma } from "../database";
import { Chat, Message, User } from "@prisma/client";
import { CreateMessageDto } from "../common/message.dto";
import { userRepo } from "../user";

async function getChatIfUserIn(userId: User["id"], chatId: Chat["id"]): Promise<Chat | null> {
  return prisma.chat.findUnique({ where: { id: chatId, users: { some: { id: userId } } } });
}

async function getPrivateChat(users: [User["id"], User["id"]]): Promise<Chat | null> {
  return prisma.chat.findFirst({
    where: { isGroup: false, users: { every: { id: { in: users } } } }
  });
}

export const chatRepo = new Elysia({ name: "repo/chat" })
  .use(userRepo)
  .derive(({ getUser }) => ({
    async getChatWithMessages(id: Chat["id"], userId: User["id"]) {
      return prisma.chat.findUnique({
        where: 
          { id, users: { some: { id: userId }
        }
      }, 
        include: {
          messages: true,
          users: { where: { id: { not: userId } } } 
        }
      });
    },
    getChatIfUserIn,
    async getUsersChats(userId: User["id"]) {
      return prisma.user.findUnique({ where: { id: userId } }).chats({ include: { users: { where: { id: { not: userId } } }} });
    },
    async createMessage(msg: CreateMessageDto): Promise<Message | null> {
      if (!(await getChatIfUserIn(msg.userId, msg.chatId))) return null;
      return prisma.message.create({ data: msg }); 
    },
    async getUsersFromChat(chatId: Chat["id"]): Promise<User[] | null> {
      return prisma.chat.findUnique({ where: { id: chatId } }).users()
    },
    getPrivateChat,
    async createGroup(name: string, initialUsers: User["id"][]): Promise<Chat | null> {
      for (const userId of initialUsers) {
        if (await getUser(userId)) continue;
        return null;
      }

      return prisma.chat.create({
        data: {
          name,
          isGroup: true,
          users: { connect: initialUsers.map(id => ({ id })) }
        },
      });
    },
    async createPrivateChat(users: [User["id"], User["id"]]): Promise<Chat | null> {
      if (await getPrivateChat(users)) return null;
      if (!(await getUser(users[0]) && await getUser(users[1]))) return null;

      return prisma.chat.create({
        data: {
          isGroup: false,
          users: { connect: [{ id: users[0] }, { id: users[1] }] },
        }
      }); 
    },
  }))
  .as("plugin");

