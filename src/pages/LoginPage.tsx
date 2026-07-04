import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
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
    <div className="min-h-screen bg-brand-sand flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Wordmark: brand block copied from the sidebar, recolored for the
            light sand background. */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-brand-teal shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path d="M1 17 L5 7 L14 7 L18 17 Z" />
              <rect x="3" y="17" width="3" height="2" rx="0.5" />
              <rect x="16" y="17" width="3" height="2" rx="0.5" />
            </svg>
          </div>
          <div>
            <span className="text-lg font-semibold text-brand-navy leading-none">
              FleetServ
            </span>
            <span className="block text-2xs font-medium text-brand-teal leading-none mt-0.5 tracking-wide uppercase">
              Hawaii
            </span>
          </div>
        </div>

        <div className="rounded-lg bg-surface-card shadow-card p-6">
          <h1 className="text-base font-semibold text-brand-navy">Sign in</h1>
          <p className="mt-1 mb-6 text-sm text-gray-500">
            Access the FleetServ Hawaii workspace.
          </p>

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
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
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

            {authError && (
              <p className="form-error">Invalid email or password.</p>
            )}

            <Button type="submit" className="w-full" loading={isSubmitting}>
              Sign In
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-2xs text-gray-400">
          Accounts are created by an administrator in the Supabase dashboard.
          There is no self sign-up.
        </p>
      </div>
    </div>
  );
}
