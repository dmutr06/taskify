import { FC, FormEvent } from "react";

import styles from "./createTask.module.scss";
import { ITask } from "../../common/task.interface";
import { useFetch } from "../../hooks/http.hook";
import { useAuth } from "../../hooks/auth.hook";
import Button from "../ui/Button";

const CreateTask: FC<{ addNewTodo: (task: ITask) => void }> = ({ addNewTodo }) => {
    const { token } = useAuth();
    const { loading, post } = useFetch<ITask>("/api/tasks", false, { headers: { Authorization: `Bearer ${token}` } });

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget);

        if (data.get("title")?.toString()?.length == 0) return;

        const res = await post(Object.fromEntries(data));

        if (res.ok) {
            addNewTodo(res.body);
            (e.target as HTMLFormElement).reset();
        }
    };

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <input name="title" placeholder="Title" />
            <input name="description" placeholder="description" />
            <select name="priority">
                <option value="LOW" title="Low">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
            </select>
            <Button disabled={loading} type="submit">Submit</Button>
        </form>
    );
};

export default CreateTask;
