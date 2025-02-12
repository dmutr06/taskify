import { useAuth } from "~/hooks/auth.hook";


export default function UserInfo() {
  const { user } = useAuth();

  return (
    <div className="flex bg-indigo-950 p-4 h-16 justify-between items-center">
      <div className="text-xl cursor-default">{user.name}</div>
      <button>Logout</button>
    </div>
  );
}
