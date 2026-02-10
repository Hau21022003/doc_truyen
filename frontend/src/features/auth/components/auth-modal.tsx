"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuthModalStore } from "@/shared/stores";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";

export default function AuthModal() {
  const { isOpen, view, closeModal, setView, isLoading } = useAuthModalStore();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent showCloseButton={false}>
        {view === "login" ? (
          <LoginForm
            onSuccess={closeModal}
            onSwitchToRegister={() => setView("register")}
          />
        ) : (
          <RegisterForm
            onSuccess={closeModal}
            onSwitchToLogin={() => setView("login")}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
