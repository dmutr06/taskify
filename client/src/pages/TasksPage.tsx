import { FC } from "react";
import { useAuth } from "../hooks/auth.hook";


const TasksPage: FC = () => {
  const { token, resetToken, setToken } = useAuth();

  console.log(token);

  return (
    <>
      <h1>TasksPage {token}</h1>
      <button onClick={() => resetToken()}>Reset token</button>
      <button onClick={() => setToken("hello")}>Set token</button>
    </>
  );
};

export default TasksPage;

