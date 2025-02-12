import Elysia from "elysia";
import type { User } from "@prisma/client";
import { prisma } from "../database";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const userRepo = new Elysia({ name: "repo/user" })
  .derive(() => ({
    async createUser(data: { email: string, name: string }): Promise<User | null> {
      if (await prisma.user.findUnique({ where: { email: data.email } })) {
        return null;
      }
      
      return prisma.user.create({ data });  
    },

    async getUser(id: User["id"]): Promise<User | null> {
      return prisma.user.findUnique({ where: { id } });
    },
    
    async createUserOrGetIfExists(data: { email: string, name: string }): Promise<User> {
      const user = await prisma.user.findUnique({ where: { email: data.email } });
      if (user) return user;

      return prisma.user.create({ data });  
    },
  }))
  .onError(({ error }) => {
    if (error instanceof PrismaClientKnownRequestError) {
      console.log(error.message);
      console.log(Bun.color("red", "ansi") + "Please fix it" + Bun.color("white", "ansi"));
      return { status: 500, message: "Something went wrong..." };
    }
  })
  .as("plugin");
