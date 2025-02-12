import { tokenCookie } from "~/cookies.server";
import type { Route } from "./+types/callback";
import { redirect } from "react-router";

export async function loader(args: Route.LoaderArgs) {
  const [_url, query] = args.request.url.split("?");
  if (!query) return redirect("/auth");

  const [probablyToken] = query.split("&");

  if (!probablyToken || !probablyToken.startsWith("token=")) return redirect("/auth");

  const token = probablyToken.slice("token=".length);

  return redirect("/chats", { headers: { "Set-Cookie": await tokenCookie.serialize(token) } });
}

export default function AuthCallback() {
  return "Authorizing...";
}
