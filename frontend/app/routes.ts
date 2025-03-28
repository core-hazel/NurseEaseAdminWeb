import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("auth", "routes/auth.tsx"),
    route("dashboard", "routes/panel.tsx", [
        index("panel/Schedule.tsx"), // Corrected path for Schedule
        route("leaverequest", "panel/leaverequest.tsx"),
        route("crud", "panel/crud.tsx"),
    ]),
] satisfies RouteConfig;
