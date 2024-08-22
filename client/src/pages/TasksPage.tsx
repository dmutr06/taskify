import { FC, useEffect } from "react";
import TaskList from "../components/TaskList/TaskList";
import CreateTask from "../components/CreateTask/CreateTask";
import { useAuth } from "../hooks/auth.hook";
import { useFetch } from "../hooks/http.hook";
import { ITask } from "../common/task.interface";
import { useSearchParams } from "react-router-dom";

const TASKS_PER_PAGE = 9;

const TasksPage: FC = () => {
  const { token, resetToken } = useAuth();
  const [params, setParams]= useSearchParams();
  const { data: tasks,  setData: setTasks, loading, error, get } = useFetch<ITask[]>(`/api/tasks?limit=${TASKS_PER_PAGE}`, false, { headers: { Authorization: `Bearer ${token}` } }, []);
  
  const removeTask = (id: string) => {
    setTasks(tasks => tasks?.filter(task => task._id != id) || null);
  };

  useEffect(() => {
    (async () => {
      const page = Number(params.get("page")) - 1;

      await get(new URLSearchParams({ offset: String(page * TASKS_PER_PAGE) }));
    })();
  }, [params]);

  return (
    <div className="tasks-page">
      <div>
        {loading ? "Loading..." : null}
        {error ? "Error..." : null}
        <TaskList tasks={tasks || []} removeTask={removeTask} />
        <button onClick={() => setParams(prev => {
          return new URLSearchParams([["page", String(Number(prev.get("page")) + 1)]]);
        })}>Next</button>
      </div>
      <CreateTask addNewTodo={(task) => setTasks(tasks => [...tasks!, task])} />
    </div>
  );
};

export default TasksPage;

