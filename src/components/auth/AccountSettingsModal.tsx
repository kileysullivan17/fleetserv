import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

const profileSchema = z.object({
  displayName: z
    .string()
    .min(1, "Name is required")
    .max(80, "Name is too long"),
});
type ProfileValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "The new passwords do not match",
    path: ["confirmPassword"],
  });
type PasswordValues = z.infer<typeof passwordSchema>;

interface AccountSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// The signed-in user's own account panel: update the display name and change
// the password. Everything here runs against the user's own session, so no
// admin access is required. This is what lets a handed-over user set their own
// password without the owner's involvement.
export function AccountSettingsModal({
  open,
  onOpenChange,
}: AccountSettingsModalProps) {
  const { session, signIn, updateDisplayName, updatePassword } = useAuth();
  const email = session?.user.email ?? "";
  const currentName =
    (session?.user.user_metadata?.display_name as string | undefined) ?? "";

  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: { displayName: currentName },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSaveProfile = profileForm.handleSubmit(async ({ displayName }) => {
    setProfileSaved(false);
    setProfileError(false);
    try {
      await updateDisplayName(displayName.trim());
      setProfileSaved(true);
    } catch {
      setProfileError(true);
    }
  });

  const onChangePassword = passwordForm.handleSubmit(async (values) => {
    setPasswordSaved(false);
    setPasswordError(null);

    // Verify the current password by re-authenticating before allowing a
    // change. Supabase does not require it, but this stops someone using an
    // unattended, already-signed-in session from taking over the account.
    try {
      await signIn(email, values.currentPassword);
    } catch {
      setPasswordError("Your current password is incorrect.");
      return;
    }

    try {
      await updatePassword(values.newPassword);
    } catch {
      setPasswordError("Could not update the password. Please try again.");
      return;
    }

    passwordForm.reset();
    setPasswordSaved(true);
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Account settings"
      description={email}
    >
      <div className="space-y-8">
        {/* Profile */}
        <form onSubmit={onSaveProfile} className="space-y-3" noValidate>
          <div>
            <label htmlFor="displayName" className="form-label">
              Display name
            </label>
            <input
              id="displayName"
              type="text"
              className="form-input"
              placeholder="Your name"
              {...profileForm.register("displayName")}
            />
            {profileForm.formState.errors.displayName && (
              <p className="form-error">
                {profileForm.formState.errors.displayName.message}
              </p>
            )}
            {profileError && (
              <p className="form-error">
                Could not save your name. Please try again.
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              size="sm"
              loading={profileForm.formState.isSubmitting}
            >
              Save name
            </Button>
            {profileSaved && (
              <span className="text-xs font-medium text-brand-teal">Saved.</span>
            )}
          </div>
        </form>

        <div className="border-t border-brand-sand-dark" />

        {/* Change password */}
        <form onSubmit={onChangePassword} className="space-y-3" noValidate>
          <div>
            <h3 className="text-sm font-semibold text-brand-navy">
              Change password
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              Set a new password for {email}.
            </p>
          </div>
          <div>
            <label htmlFor="currentPassword" className="form-label">
              Current password
            </label>
            <input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              className="form-input"
              {...passwordForm.register("currentPassword")}
            />
            {passwordForm.formState.errors.currentPassword && (
              <p className="form-error">
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="newPassword" className="form-label">
              New password
            </label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              className="form-input"
              {...passwordForm.register("newPassword")}
            />
            {passwordForm.formState.errors.newPassword && (
              <p className="form-error">
                {passwordForm.formState.errors.newPassword.message}
              </p>
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
              {...passwordForm.register("confirmPassword")}
            />
            {passwordForm.formState.errors.confirmPassword && (
              <p className="form-error">
                {passwordForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
          {passwordError && <p className="form-error">{passwordError}</p>}
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              size="sm"
              loading={passwordForm.formState.isSubmitting}
            >
              Update password
            </Button>
            {passwordSaved && (
              <span className="text-xs font-medium text-brand-teal">
                Password updated.
              </span>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
}
