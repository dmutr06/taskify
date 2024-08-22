import { createBrowserRouter } from "react-router-dom";
import AuthProvider from "./providers/AuthProvider";
import TasksPage from "./pages/TasksPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import MainLayout from "./layouts/MainLayout";

export const router = createBrowserRouter([
  {
    errorElement: <NotFound />,
    element: <MainLayout><AuthProvider /></MainLayout>,
    children: [
      {
        path: "/",
        element: <TasksPage />,
      },
      {
        path: "/auth",
        element: <AuthPage />,
      }
    ]
  }
]);
