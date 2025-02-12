import { Outlet } from "react-router";
import { useAuth } from "~/hooks/auth.hook";
import type { Route } from "./+types/dashboard";
import { useEffect, useState } from "react";
import type { Chat } from "types/chat.interface";
import ChatList from "~/components/ChatList";
import UserInfo from "~/components/UserInfo";

export default function Dashboard({}: Route.ComponentProps) {
  const { token } = useAuth();
  const [chats, setChats] = useState<Chat[] | null>();

  const fetchChats = async () => {
    const res = await fetch("http://localhost:6969/chats", {
      headers: { "Authorization": token },
    });

    setChats(await res.json());
  }

  useEffect(() => void fetchChats(), []);

  return <main className="flex gap-4 h-screen">
    <div className="w-md flex flex-col gap-4 border-r-2 border-indigo-900">
      <h1 className="text-3xl px-2 pt-4">Talkie</h1>
      {!chats ? "Loading..." : <ChatList chats={chats} />}
      <div className="grow flex flex-col-reverse">
        <UserInfo />
      </div>
    </div>
    <Outlet />
  </main>;
}
