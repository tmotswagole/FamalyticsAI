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
    <nav className="w-full border-b border-gray-200 bg-primary text-primary-foreground py-4">
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
            className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/users"
            className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground"
          >
            Users
          </Link>
          <Link
            href="/admin/organizations"
            className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground"
          >
            Organizations
          </Link>
          <Link
            href="/admin/logs"
            className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground"
          >
            System Logs
          </Link>
          <Link
            href="/admin/integrations"
            className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground"
          >
            Integrations
          </Link>
          <Link
            href="/admin/ai-performance"
            className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground"
          >
            AI Performance
          </Link>
          <Link
            href="/admin/security"
            className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground"
          >
            Security
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <Button
            variant="outline"
            size="sm"
            className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20"
            onClick={() => router.push("/dashboard")}
          >
            Exit Admin Mode
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
