import { FC, FormEvent, useState } from "react";
import { useAuth } from "../../hooks/auth.hook";

import styles from "./authForm.module.scss";
import { useFetch } from "../../hooks/http.hook";

const AuthForm: FC = () => {
    const [isRegister, setIsRegister] = useState<boolean>(true);

    const { post, loading, setUrl } = useFetch<{ jwt: string }>("/api/users");

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

        if (isRegister) setUrl("/api/users/register");
        else setUrl("/api/users/login");
      
        const res = await post(Object.fromEntries(data));
    
        if (res.ok)
            setToken(res.body.jwt);
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
                <div className={styles.error}></div>
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
