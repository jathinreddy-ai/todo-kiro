// Authentication modal — Google sign-in + email/password sign-in and sign-up.
// Shows a "not configured" notice when Supabase credentials are missing.
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, UserPlus, Globe } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export function AuthModal({ isOpen, onClose }) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, isConfigured } =
    useAuth();
  const [mode, setMode] = useState("signin"); // 'signin' | 'signup'
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
    if (error) toast.error(error.message || "Google sign-in failed");
    else onClose();
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
    setLoading(true);
    const fn = mode === "signup" ? signUpWithEmail : signInWithEmail;
    const { error } = await fn(email, password);
    setLoading(false);
    if (error) {
      toast.error(error.message || "Authentication failed");
    } else {
      toast.success(
        mode === "signup" ? "Account created! Check your email." : "Signed in!",
      );
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "signup" ? "Create Account" : "Sign In"}
    >
      {!isConfigured && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
            ⚠️ Supabase credentials not configured yet. Add them to your{" "}
            <code>.env</code> file to enable cloud sync. The app works fully
            offline with local storage in the meantime.
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
            Password
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
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="text-brand-500 hover:text-brand-600 font-medium focus-visible:outline-none focus-visible:underline"
        >
          {mode === "signin" ? "Sign up" : "Sign in"}
        </button>
      </p>
    </Modal>
  );
}
