"use client";

import Link from "next/link";
import { createClient } from "../../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { UserCircle, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminNavbar() {
  const supabase = createClient();
  const router = useRouter();

  return (
    <nav className="w-full border-b border-border bg-background text-foreground py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            prefetch
            className="text-xl font-bold flex items-center gap-2"
          >
            <Shield className="h-6 w-6" />
            <span>Admin Portal</span>
          </Link>
          <Link
            href="/admin/dashboard"
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/users"
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            Users
          </Link>
          <Link
            href="/admin/organizations"
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            Organizations
          </Link>
          <Link
            href="/admin/logs"
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            System Logs
          </Link>
          <Link
            href="/admin/integrations"
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            Integrations
          </Link>
          <Link
            href="/admin/ai-performance"
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            AI Performance
          </Link>
          <Link
            href="/admin/security"
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            Security
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <Button
            variant="outline"
            size="sm"
            className="border-border"
            onClick={() => router.push("/admin/dashboard")}
          >
            Exit Admin Mode
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/admin/settings");
                }}
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/");
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
