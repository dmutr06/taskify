import { FC, FormEvent, useState } from "react";
import { useAuth } from "../../hooks/auth.hook";

import styles from "./authForm.module.scss";
import { useFetch } from "use-http";

interface LoginData {
  name: string,
  password: string,
}

interface RegisterData {
  name: string,
  email: string,
  password: string,
}

const AuthForm: FC = () => {
  const [isRegister, setIsRegister] = useState<boolean>(true);

  const { post, loading, error, response } = useFetch<{ jwt: string }>("/api/users", { "cache": "no-store" });

  const { setToken } = useAuth();

  const toggleIsRegister = () => setIsRegister(prev => !prev);
  
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    
    const values = data.values();

    while (true) {
      const val = values.next();

      if (val.done) break;
      
      if (!val.value) return;
    }
    
    if (!data.get("name")) return;
    if (!data.get("password")) return;
    if (!data.get("email") && isRegister) return;
      
    const res = await post(isRegister ? "register" : "login", { name: data.get("name"), password: data.get("password") });
    
    if (response.ok)
      setToken(res.jwt);
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.title} onClick={toggleIsRegister}>{isRegister ? "Register" : "Login"}</div>
          <div className={styles.fields}>
            <input 
            className={styles.input} 
            placeholder="Your name" 
            name="name"
            />
            {isRegister ? 
            <input 
              className={styles.input} 
              placeholder="Your email" 
              name="email" 
              type="email"
            /> 
            : null}
            <input 
            className={styles.input} 
            placeholder="Your password" 
            name="password" 
            type="password"
            />
            <button className={styles.btn} disabled={loading} type="submit">{loading ? "Loading..." : "Submit"}</button>
          </div>
          <div className={styles.toggle}>
            <div onClick={toggleIsRegister}>
              {isRegister ? "Already registered? Sign in" : "Don't have account? Register"}
            </div>
          </div>
      </form>
    </div>
  );
};

export default AuthForm;
