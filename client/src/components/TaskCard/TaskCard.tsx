import { FC } from "react";
import { ITask } from "../../common/task.interface";

import styles from "./taskCard.module.scss";
import { useFetch } from "../../hooks/http.hook";
import { useAuth } from "../../hooks/auth.hook";
import Button from "../ui/Button";

const PRIORITY_COLOR = {
    LOW: "green",
    MEDIUM: "yellow",
    HIGH: "red",
} as const;

const TaskCard: FC<{ task: ITask, removeTaskFromList: () => void }> = ({ task, removeTaskFromList }) => {
    const { token } = useAuth();
    const { loading, del } = useFetch(`/api/tasks/${task._id}`, false, { headers: { Authorization: `Bearer ${token}` } });

    const removeTask = async () => {
        if (await del(undefined, "text"))
            removeTaskFromList();
    };
  
    return (
        <li className={styles.item}>
            <div>
                <div style={{ color: PRIORITY_COLOR[task.priority] }} className={styles.title}>{task.title}</div>
                <div className={styles.description}>{task.description}</div>
            </div>
            <Button size="square" className={styles.delete} disabled={loading} onClick={removeTask}>X</Button>
        </li>
    );
};

export default TaskCard;
