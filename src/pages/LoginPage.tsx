import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { AuthShell } from "@/components/auth/AuthShell";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { session, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setAuthError(false);
    try {
      await signIn(email, password);
      navigate("/fleets", { replace: true });
    } catch {
      setAuthError(true);
    }
  });

  // Already signed in: no reason to show the form.
  if (!loading && session) {
    return <Navigate to="/fleets" replace />;
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Access the FleetServ Hawaii workspace."
      footer={
        <>
          Need an account?{" "}
          <Link to="/signup" className="text-brand-teal hover:underline">
            Create one
          </Link>
        </>
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

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-brand-teal hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="form-input"
            placeholder="Your password"
            {...register("password")}
          />
          {errors.password && (
            <p className="form-error">{errors.password.message}</p>
          )}
        </div>

        {authError && <p className="form-error">Invalid email or password.</p>}

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Sign In
        </Button>
      </form>
    </AuthShell>
  );
}
