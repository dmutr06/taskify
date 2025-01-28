import { Elysia } from "elysia";

export const chatService = new Elysia({ name: "service/chat" })
  .derive(({ server }) => ({
    sendNewMessage({ chatId, content }: { chatId: string, content: unknown }) {
      server?.publish(chatId, JSON.stringify(content));
    },
  }))
  .as("plugin");
