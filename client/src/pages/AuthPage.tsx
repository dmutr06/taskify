import { FC } from "react";
import { useAuth } from "../hooks/auth.hook";
import AuthForm from "../components/AuthForm/AuthForm";



const AuthPage: FC = () => {
  const { setToken } = useAuth();
  
  return (
    <>
      <AuthForm />
    </>
  );
};

export default AuthPage;

