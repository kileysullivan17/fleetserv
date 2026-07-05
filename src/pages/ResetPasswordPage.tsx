import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { AuthShell } from "@/components/auth/AuthShell";
import { useAuth } from "@/hooks/useAuth";

const resetSchema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "The passwords do not match",
    path: ["confirmPassword"],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

export function ResetPasswordPage() {
  const { session, loading, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  // Grace period: the recovery link in the URL is processed asynchronously, so
  // a session may not exist on the first render. Wait briefly before deciding
  // the link is invalid.
  const [graceElapsed, setGraceElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setGraceElapsed(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = handleSubmit(async ({ password }) => {
    setFormError(null);
    try {
      await updatePassword(password);
      navigate("/fleets", { replace: true });
    } catch {
      setFormError("Could not update the password. Please try again.");
    }
  });

  // Still resolving whether the recovery link produced a session.
  if (!session && (loading || !graceElapsed)) {
    return (
      <AuthShell title="Verifying your reset link...">
        <p className="text-sm text-gray-500">One moment.</p>
      </AuthShell>
    );
  }

  // No session after the grace period: the link is missing, invalid, or spent.
  if (!session) {
    return (
      <AuthShell
        title="This link is not valid"
        footer={
          <Link to="/forgot-password" className="text-brand-teal hover:underline">
            Request a new link
          </Link>
        }
      >
        <p className="text-sm text-gray-600">
          This password reset link is invalid or has expired. Request a new one
          and try again.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Set a new password" subtitle={session.user.email ?? ""}>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="password" className="form-label">
            New password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="form-input"
            {...register("password")}
          />
          {errors.password && (
            <p className="form-error">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="form-label">
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="form-input"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="form-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        {formError && <p className="form-error">{formError}</p>}

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Update password
        </Button>
      </form>
    </AuthShell>
  );
}
