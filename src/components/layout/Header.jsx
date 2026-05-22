// Sticky top header: hamburger, search, glass toggle, gradient toggle, color picker, theme toggle, auth.
import { useState } from "react";
import { Menu, LogIn, LogOut, User } from "lucide-react";
import { Button } from "../ui/Button";
import { ThemeToggle } from "../ui/ThemeToggle";
import { GlassToggle } from "../ui/GlassToggle";
import { GradientToggle } from "../ui/GradientToggle";
import { ColorPicker } from "../ui/ColorPicker";
import { SearchInput } from "../ui/SearchInput";
import { AuthModal } from "../auth/AuthModal";
import { useAuth } from "../../context/AuthContext";
import { useAccentStyle } from "../../hooks/useAccentStyle";
import toast from "react-hot-toast";

export function Header({ onMenuClick, glassMode }) {
  const { user, signOut } = useAuth();
  const { filled } = useAccentStyle();
  const [authOpen, setAuthOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
  };

  const headerClass = glassMode
    ? "glass border-b border-white/30 dark:border-white/8"
    : "bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800";

  return (
    <>
      <header
        className={`sticky top-0 z-30 flex items-center gap-3 px-4 py-3 ${headerClass}`}
      >
        {/* Hamburger — mobile only */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="lg:hidden"
        >
          <Menu size={20} aria-hidden="true" />
        </Button>

        {/* Title — mobile only */}
        <span className="lg:hidden text-base font-semibold tracking-tight gradient-text">
          Taskflow
        </span>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <SearchInput />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <GlassToggle />
          <GradientToggle />
          <ColorPicker />
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-1 ml-1">
              <span
                className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-slate-500 dark:text-slate-400"
                title={user.email}
              >
                <User size={13} aria-hidden="true" />
                <span className="max-w-[100px] truncate">
                  {user.email?.split("@")[0]}
                </span>
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut size={16} aria-hidden="true" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              aria-label="Sign in"
              style={filled}
              className="ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            >
              <LogIn size={13} aria-hidden="true" />
              <span className="hidden sm:inline">Sign in</span>
            </button>
          )}
        </div>
      </header>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
