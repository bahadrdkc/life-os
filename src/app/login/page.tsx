import { login, signup } from "./actions";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginTabs } from "./login-tabs";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; mode?: string }>;
}) {
  const params = await searchParams;
  const isSignup = params.mode === "signup";

  return (
    <div className="flex min-h-full flex-1 items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-foreground">Life OS</h1>
        <p className="mb-5 text-sm text-muted">
          {isSignup ? "Yeni hesap oluştur" : "Hesabına giriş yap"}
        </p>

        <LoginTabs isSignup={isSignup} />

        {params.error && (
          <p className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {params.error}
          </p>
        )}
        {params.message && (
          <p className="mb-3 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-600">
            {params.message}
          </p>
        )}

        <form className="flex flex-col gap-3">
          {isSignup && (
            <div>
              <Label>Görünen ad</Label>
              <Input name="display_name" placeholder="Adın" />
            </div>
          )}
          <div>
            <Label>E-posta</Label>
            <Input name="email" type="email" required placeholder="ornek@mail.com" />
          </div>
          <div>
            <Label>Şifre</Label>
            <Input name="password" type="password" required minLength={6} placeholder="••••••" />
          </div>
          <Button
            type="submit"
            formAction={isSignup ? signup : login}
            className="mt-1 w-full justify-center"
          >
            {isSignup ? "Kayıt ol" : "Giriş yap"}
          </Button>
        </form>
      </div>
    </div>
  );
}
