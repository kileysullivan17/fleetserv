import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { AuthShell } from "@/components/auth/AuthShell";
import { useAuth } from "@/hooks/useAuth";

// Shared access code that gates sign-up, set via VITE_SIGNUP_ACCESS_CODE in
// .env.local (local) and Vercel (production). It ships in the client bundle,
// so it is a deterrent against drive-by registration, not a hard secret. If it
// is unset, sign-up is disabled (fail safe) rather than open to anyone.
const ACCESS_CODE = import.meta.env.VITE_SIGNUP_ACCESS_CODE as
  | string
  | undefined;

const signUpSchema = z
  .object({
    accessCode: z.string().min(1, "Access code is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "The passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpPage() {
  const { session, loading, signUp } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    if (!ACCESS_CODE || values.accessCode.trim() !== ACCESS_CODE) {
      setError("accessCode", { message: "That access code is not valid." });
      return;
    }

    try {
      const { needsConfirmation } = await signUp(
        values.email.trim(),
        values.password
      );
      if (needsConfirmation) {
        setConfirmationSent(true);
      } else {
        navigate("/fleets", { replace: true });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not create the account.";
      setFormError(message);
    }
  });

  // Already signed in: nothing to do here.
  if (!loading && session) {
    return <Navigate to="/fleets" replace />;
  }

  // Fail safe: no access code configured means sign-up is turned off.
  if (!ACCESS_CODE) {
    return (
      <AuthShell
        title="Sign-up unavailable"
        footer={
          <Link to="/login" className="text-brand-teal hover:underline">
            Back to sign in
          </Link>
        }
      >
        <p className="text-sm text-gray-600">
          Sign-up is not enabled. An access code has not been configured for
          this site. Contact the site owner for an account.
        </p>
      </AuthShell>
    );
  }

  if (confirmationSent) {
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
          Your account has been created. Check your inbox for a confirmation
          link, then come back and sign in.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create an account"
      subtitle="You will need the access code from the site owner."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-brand-teal hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="accessCode" className="form-label">
            Access code
          </label>
          <input
            id="accessCode"
            type="text"
            autoComplete="off"
            className="form-input"
            placeholder="Team access code"
            {...register("accessCode")}
          />
          {errors.accessCode && (
            <p className="form-error">{errors.accessCode.message}</p>
          )}
        </div>

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
          <label htmlFor="password" className="form-label">
            Password
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
            Confirm password
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
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
