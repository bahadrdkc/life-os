import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next 16 "proxy" konvansiyonu (eski adı middleware).
// Her istekte Supabase oturumunu tazeler ve rota korumasını uygular.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Statik dosyalar ve görseller hariç tüm rotalar.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
