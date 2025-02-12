import type { Route } from "./+types/auth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Auth" },
  ]
}


export default function Auth() {
  const redirect = () => {
    window.location.href = "http://localhost:6969/auth/google";
  }
  return (
    <div className="flex w-full h-[100vh] items-center justify-center ">
      <button className="bg-indigo-950 p-4 rounded-md text-2xl" onClick={redirect}>Auth</button>
    </div>
  );
}
