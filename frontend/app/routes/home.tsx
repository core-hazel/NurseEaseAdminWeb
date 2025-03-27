import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "NurseEase Admin" },
    { name: "description", content: "Welcome to NurseEase Admin!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
