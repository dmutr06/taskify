import { useAuth } from "~/hooks/auth.hook";
import type { Route } from "./+types/chat";
import { useEffect, useState } from "react";
import type { ChatWithMessages } from "types/chat.interface";
import { useNavigate } from "react-router";
import MessageBox from "~/components/MessageBox";

export default function Chat({ params: { id } }: Route.ComponentProps) {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [chat, setChat] = useState<ChatWithMessages | null>(null);

  const fetchChat = async () => {
    const res = await fetch(`http://localhost:6969/chats/${id}`, {
      headers: { "Authorization": token },
    });

    if (!res.ok) return navigate("/chats");

    setChat((await res.json()).chat);
  };

  useEffect(() => void fetchChat(), [id]);

  useEffect(() => {
    console.log(chat);
  }, [chat]);

  return (
    <div className="pb-16 pt-4 pl-4 pr-2 w-full flex flex-col max-h-full gap-12">
      {!chat ? "Loading..." :
        <div className="grow pr-10 overflow-y-scroll h-full"><ul className="flex flex-col gap-8 w-full">
          {chat.messages.map(msg => {
            return <li className="flex" key={msg.id}><MessageBox msg={msg} users={[user, ...chat.users]} /></li>
          })} 
        </ul></div>
      }
      <div className="shrink h-16 pr-10 flex gap-4 justify-between">
        <input className="block bg-indigo-950 h-full w-full p-4 outline-none" placeholder="Your message" />
        <button>Submit</button>
      </div>
    </div>
  );
}
