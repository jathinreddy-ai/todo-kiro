// Authentication modal — Google sign-in + email/password sign-in and sign-up.
import { useState } from "react";
import { Mail, Lock, LogIn, UserPlus, Globe, CheckCircle2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export function AuthModal({ isOpen, onClose }) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, isConfigured } =
    useAuth();
  const [mode, setMode] = useState("signin"); // 'signin' | 'signup' | 'confirm'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    if (!isConfigured) {
      toast.error("Supabase not configured yet");
      return;
    }
    setLoading(true);
    const { error } = await signInWithGoogle();
    setLoading(false);
    // Google OAuth redirects the page — no need to close modal manually
    if (error) toast.error(error.message || "Google sign-in failed");
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    if (!isConfigured) {
      toast.error("Supabase not configured yet");
      return;
    }
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    if (mode === "signup") {
      const { data, error } = await signUpWithEmail(email, password);
      setLoading(false);

      if (error) {
        toast.error(error.message || "Sign-up failed");
        return;
      }

      // Session returned immediately = email confirmation disabled = signed in now
      if (data?.session) {
        toast.success("Account created! Welcome 🎉");
        onClose();
        return;
      }

      // User returned but no session = email confirmation required
      // Also handles the case where Supabase returns identities=[] (email already registered)
      if (data?.user) {
        const identities = data.user.identities ?? [];
        if (identities.length === 0) {
          // Email already registered — tell user to sign in instead
          toast.error(
            "An account with this email already exists. Please sign in.",
          );
          setMode("signin");
          return;
        }
        // New account, needs email confirmation
        setMode("confirm");
        return;
      }

      // Supabase sometimes returns data: { user: null, session: null } with no error
      // when email confirmation is enabled and the signup "succeeded" silently
      // Treat this as needing confirmation
      setMode("confirm");
    } else {
      // Sign in
      const { data, error } = await signInWithEmail(email, password);
      setLoading(false);

      if (error) {
        // Friendly messages for common errors
        if (error.message?.includes("Email not confirmed")) {
          toast.error("Please confirm your email first. Check your inbox.");
        } else if (error.message?.includes("Invalid login credentials")) {
          toast.error("Incorrect email or password.");
        } else {
          toast.error(error.message || "Sign-in failed");
        }
        return;
      }

      if (data?.session) {
        toast.success("Signed in!");
        onClose();
      }
    }
  };

  // ── Email confirmation pending screen ──────────────────────────────────────
  if (mode === "confirm") {
    return (
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setMode("signin");
        }}
        title="Check your email"
      >
        <div className="flex flex-col items-center text-center py-4 gap-4">
          <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
            <CheckCircle2
              size={28}
              className="text-green-500"
              aria-hidden="true"
            />
          </div>
          <div>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-1">
              Confirmation email sent to
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {email}
            </p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
            Click the link in the email to confirm your account, then come back
            and sign in.
          </p>
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => setMode("signin")}
          >
            Go to Sign In
          </Button>
        </div>
      </Modal>
    );
  }

  // ── Main auth form ─────────────────────────────────────────────────────────
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "signup" ? "Create Account" : "Sign In"}
    >
      {!isConfigured && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
            ⚠️ Supabase credentials not configured. The app works offline with
            localStorage.
          </p>
        </div>
      )}

      {/* Google sign-in */}
      <Button
        variant="outline"
        size="md"
        className="w-full mb-4"
        onClick={handleGoogle}
        loading={loading}
        disabled={!isConfigured}
      >
        <Globe size={16} aria-hidden="true" />
        Continue with Google
      </Button>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        <span className="text-xs text-slate-400">or</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Email / password form */}
      <form onSubmit={handleEmail} className="space-y-3">
        <div>
          <label
            htmlFor="auth-email"
            className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1"
          >
            Email
          </label>
          <div className="relative">
            <Mail
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="auth-password"
            className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1"
          >
            Password{" "}
            {mode === "signup" && (
              <span className="text-slate-400">(min. 6 characters)</span>
            )}
          </label>
          <div className="relative">
            <Lock
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          type="submit"
          className="w-full"
          loading={loading}
          disabled={!isConfigured}
        >
          {mode === "signup" ? (
            <>
              <UserPlus size={15} aria-hidden="true" /> Create Account
            </>
          ) : (
            <>
              <LogIn size={15} aria-hidden="true" /> Sign In
            </>
          )}
        </Button>
      </form>

      {/* Toggle mode */}
      <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
        {mode === "signin"
          ? "Don't have an account? "
          : "Already have an account? "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setEmail("");
            setPassword("");
          }}
          className="text-brand-500 hover:text-brand-600 font-medium focus-visible:outline-none focus-visible:underline"
        >
          {mode === "signin" ? "Sign up" : "Sign in"}
        </button>
      </p>
    </Modal>
  );
}
