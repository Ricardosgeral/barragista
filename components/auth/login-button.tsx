import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

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
        <DialogTitle />

        <DialogContent className="w-auto bg-transparent p-0">
          {type === "register" ? <RegisterForm /> : <LoginForm />}

          {/* Provide a DialogDescription */}
          <DialogDescription id="dialog-description">
            {type === "register"
              ? "Register for an account."
              : "Log into your account."}
          </DialogDescription>
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
