import Link from "next/link";
import { Mic } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";
import { UserMenu } from "@/components/layout/UserMenu";

export function Header() {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Mic className="h-5 w-5 text-indigo-500" />
          InterviewPrep
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/interview" className={buttonStyles("primary", "py-2")}>
            Start practicing
          </Link>
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}