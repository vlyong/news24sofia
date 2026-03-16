"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 hover:bg-white/5 rounded-full transition-colors w-9 h-9 border border-white/10 dark:border-white/10 border-black/10 flex items-center justify-center">
        <div className="w-5 h-5 bg-transparent" />
      </button>
    );
  }

  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 hover:bg-black/5 dark:hover:bg-white/5 bg-white/5 dark:bg-black/20 rounded-full transition-colors w-9 h-9 border border-black/10 dark:border-white/10 flex items-center justify-center text-foreground"
      aria-label="Включи/изключи тъмна тема"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-brand-red" />
      ) : (
        <Moon className="w-4 h-4 text-brand-red" />
      )}
    </button>
  );
}
