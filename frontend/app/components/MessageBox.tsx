import type { Message } from "types/message.interface";
import type { User } from "types/user.interface";
import { useAuth } from "~/hooks/auth.hook";

export default function MessageBox({ msg, users }: { msg: Message, users: User[] }) {
  const { user, token } = useAuth();

  const getName = () => {
    return users.find(usr => usr.id == msg.userId)?.name;
  }

  const isSelf = () => {
    return user.id == msg.userId;
  }

  return (
    <div className={`bg-indigo-950 w-md ${isSelf() ? "ml-auto" : null}`}>
      <div className={`text-2xl border-b-2 border-indigo-900 px-4 py-4 ${isSelf() ? "text-right" : null}`}>{getName()}</div>
      <div className={`text-xl px-4 py-4`}>{msg.content}</div>
    </div>
  );
}
