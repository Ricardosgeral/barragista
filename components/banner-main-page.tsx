import { LoginButton } from "@/components/auth/login-button";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function BannerMainPage() {
  return (
    <div className="flex justify-center space-x-4 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-black to-slate-800 py-3 shadow-xl dark:bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] dark:from-yellow-500 dark:to-yellow-400">
      <LoginButton mode="modal" type="login" asChild>
        <Button
          variant="primary"
          size="lg"
          className="h-9 font-semibold text-foreground hover:animate-colorChange dark:bg-foreground dark:text-background dark:hover:bg-foreground/80"
        >
          Login
        </Button>
      </LoginButton>
      <LoginButton mode="modal" type="register" asChild>
        <Button variant="outline" size="lg" className="h-9">
          Getting started
        </Button>
      </LoginButton>
      <div className="animate-spin-slow text-lg text-background dark:animate-pulse">
        <ModeToggle />
      </div>
    </div>
  );
}
