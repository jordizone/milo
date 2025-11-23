import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("routes/_authenticated.tsx", [
    index("routes/home.tsx"),
    route("create-desk", "routes/create-desk.tsx"),
    route("decks/:id", "routes/decks.$id.tsx"),
  ]),
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.tsx"),
] satisfies RouteConfig;
