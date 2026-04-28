import { HydratedAuthRoute } from "@/components/auth/HydratedAuthRoute";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <HydratedAuthRoute>
      <SignupForm />
    </HydratedAuthRoute>
  );
}
