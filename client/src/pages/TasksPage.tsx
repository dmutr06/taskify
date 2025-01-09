import { FC, useEffect } from "react";
import TaskList from "../components/TaskList/TaskList";
import CreateTask from "../components/CreateTask/CreateTask";
import { useAuth } from "../hooks/auth.hook";
import { useFetch } from "../hooks/http.hook";
import { ITask } from "../common/task.interface";
import { useSearchParams } from "react-router-dom";

const TASKS_PER_PAGE = 9;

const TasksPage: FC = () => {
  // TODO: make logout using resetToken
  const { token } = useAuth();
  const [params, setParams]= useSearchParams(new URLSearchParams([["page", String(1)]]));
  const { 
    data: tasks,
    loading, 
    error, 
    get 
  } = useFetch<ITask[]>(`/api/tasks?limit=${TASKS_PER_PAGE}`, false, { headers: { Authorization: `Bearer ${token}` }, }, []);
  const { 
    data: total, 
    loading: totalLoading, 
    error: _totalError, 
    get: getTotal 
  } = useFetch<{ total: number }>("/api/tasks/total", true, { headers: { Authorization: `Bearer ${token}` } });

  const updateTasks = async () => {
    const total = await getTotal();
    if (!total.ok) return;
    if (total.body.total < getPage() * TASKS_PER_PAGE) return void addToPage(-1);
    get(new URLSearchParams({ offset: String((getPage() - 1) * TASKS_PER_PAGE) })); 
  };

  const addToPage = (delta: number) => {
    setParams(prev => new URLSearchParams(
      [["page", String(Number(prev.get("page")) + delta)]]
    ));
  };

  const setPage = (page: number) => {
    setParams(() => new URLSearchParams(
      [["page", String(page)]]
    ));
  };

  const getPage = () => {
    return Number(params.get("page"));
  }

  useEffect(() => {
    (async () => {
      const page = getPage() - 1;
      if (page < 0) return setPage(1);
      await get(new URLSearchParams({ offset: String(page * TASKS_PER_PAGE) }));
    })();
  }, [params]);

  return (
    <div className="tasks-page">
        <div className="tasks">
          {loading ? "Loading..." : null}
          {error ? "Error..." : null}
          <TaskList tasks={tasks || []} removeTask={updateTasks} />
        </div>
      <CreateTask addNewTodo={updateTasks} />
      <div className="btns">
        <button disabled={getPage() <= 1} onClick={() => addToPage(-1)}>Prev</button>
        <button disabled={totalLoading || (total?.total || 0) < getPage() * TASKS_PER_PAGE} onClick={() => addToPage(1)}>Next</button>
      </div>
    </div>
  );
};

export default TasksPage;

