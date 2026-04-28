import { HydratedAuthRoute } from "@/components/auth/HydratedAuthRoute";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <HydratedAuthRoute>
      <LoginForm />
    </HydratedAuthRoute>
  );
}
