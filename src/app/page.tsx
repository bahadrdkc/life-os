import { redirect } from "next/navigation";

// Kök rota: middleware girişsizi /login'e yollar, girişliyi buraya bırakır.
export default function Home() {
  redirect("/dashboard");
}
