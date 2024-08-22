import { FC, FormEvent } from "react";

import styles from "./createTask.module.scss";
import { ITask } from "../../common/task.interface";
import { useFetch } from "../../hooks/http.hook";
import { useAuth } from "../../hooks/auth.hook";

const CreateTask: FC<{ addNewTodo: (task: ITask) => void }> = ({ addNewTodo }) => {
  const { token } = useAuth();
  const { loading, error, post } = useFetch<ITask>(`/api/tasks`, false, { headers: { Authorization: `Bearer ${token}` } });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const res = await post(Object.fromEntries(data));

    if (res.ok)
      addNewTodo(res.body);
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
      <button disabled={loading} type="submit">Submit</button>
    </form>
  );
};

export default CreateTask;
