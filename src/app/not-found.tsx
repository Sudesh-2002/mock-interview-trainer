import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-5xl font-bold text-indigo-500">404</p>
      <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        That page doesn&apos;t exist, or it isn&apos;t yours to view.
      </p>
      <Link href="/" className={buttonStyles("primary", "mt-6")}>
        Back home
      </Link>
    </div>
  );
}