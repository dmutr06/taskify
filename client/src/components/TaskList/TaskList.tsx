import { FC } from "react";
import { ITask } from "../../common/task.interface";

import styles from "./taskList.module.scss";
import TaskCard from "../TaskCard/TaskCard";


const TaskList: FC<{ tasks: ITask[], removeTask: (id: string) => void }> = ({ tasks, removeTask }) => {
  return (
    <>
      <ul className={styles.list}>{tasks.map((task) => <TaskCard removeTaskFromList={() => removeTask(task._id)} key={task._id} task={task} />)}</ul>
    </>
  );
};

export default TaskList;
