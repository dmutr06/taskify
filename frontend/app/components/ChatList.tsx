import { NavLink } from "react-router";
import type { Chat } from "types/chat.interface";

export interface ChatListProps {
  chats: Chat[],
}

export default function ChatList({ chats }: ChatListProps) {
  return (
    <ul className="flex flex-col gap-2">
      {chats.map(chat => <ChatItem chat={chat} key={chat.id} />)}
    </ul>
  );
}

function ChatItem({ chat }: { chat: Chat }) {
  const getChatName = () => {
    if (chat.isGroup) return chat.name;
    return chat.users[0].name;
  }

  return (
    <li className="bg-indigo-950 " key={chat.id}>
      <NavLink className="block px-4 py-2 text-xl" to={chat.id}>{getChatName()}</NavLink>
    </li>
  );
}
