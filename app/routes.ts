import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("routes/_authenticated.tsx", [
    index("routes/home.tsx"),
    route("create-desk", "routes/deck/create-deck.tsx"),
    route("deck/:id", "routes/deck/$id.tsx"),
    route("delete-deck", "routes/deck/delete-deck.tsx"),
  ]),
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.tsx"),
] satisfies RouteConfig;
