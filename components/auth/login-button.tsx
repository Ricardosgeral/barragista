import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  type?: "login" | "register";
  asChild?: boolean;
}

export const LoginButton = ({
  children,
  mode = "redirect",
  type = "login",
  asChild,
}: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    if (type === "register") {
      router.push("/auth/register");
    } else {
      router.push("/auth/login");
    }
  };

  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="w-auto bg-transparent p-0">
          <DialogHeader className="hidden">
            <DialogTitle>Auth</DialogTitle>
            <DialogDescription>
              {type === "register"
                ? "Register for an account."
                : "Log into your account."}
            </DialogDescription>
          </DialogHeader>
          {type === "register" ? <RegisterForm /> : <LoginForm />}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};
