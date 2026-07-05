import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { AuthShell } from "@/components/auth/AuthShell";
import { useAuth } from "@/hooks/useAuth";

const forgotSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = handleSubmit(async ({ email }) => {
    // Always report success, even on error, so the form does not reveal which
    // emails have accounts.
    try {
      await sendPasswordReset(email.trim());
    } catch {
      // Swallow: the confirmation message below is intentionally the same
      // whether or not the address is registered.
    }
    setSent(true);
  });

  if (sent) {
    return (
      <AuthShell
        title="Check your email"
        footer={
          <Link to="/login" className="text-brand-teal hover:underline">
            Back to sign in
          </Link>
        }
      >
        <p className="text-sm text-gray-600">
          If an account exists for that email, a password reset link is on its
          way. Open it and you will be able to set a new password.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we will send you a reset link."
      footer={
        <Link to="/login" className="text-brand-teal hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="form-input"
            placeholder="you@fleetserv.com"
            {...register("email")}
          />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Send reset link
        </Button>
      </form>
    </AuthShell>
  );
}
