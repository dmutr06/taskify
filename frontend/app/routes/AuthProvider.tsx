import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/AuthProvider";
import { tokenCookie } from "~/cookies.server";
import { AuthContext } from "~/hooks/auth.hook";


export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const token = await tokenCookie.parse(cookieHeader) as string | null;

  if (!token) return redirect("/auth");

  const res = await fetch("http://localhost:6969/user", { headers: { "Authorization": token } });

  const user = await res.json();

  return { token, user }; 
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Talkie" },
  ];
}

export default function AuthProvider({ loaderData }: Route.ComponentProps) {
  return (
    <AuthContext.Provider value={loaderData}>
      <Outlet />
    </AuthContext.Provider>
  );
}
