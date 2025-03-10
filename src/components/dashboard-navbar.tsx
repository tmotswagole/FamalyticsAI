"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { UserCircle, Home, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { t } from "@/lib/content";
import { useEffect, useState } from "react";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const getUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("auth.users")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (data) {
          setUserRole(data.role);
        }
      }
    };

    getUserRole();
  }, [supabase]);

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" prefetch className="text-xl font-bold">
            Logo
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {t("dashboard.title")}
          </Link>
          <Link
            href="/dashboard/feedback"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {t("feedback.title")}
          </Link>
          <Link
            href="/dashboard/analytics"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {t("analytics.title")}
          </Link>
          <Link
            href="/dashboard/social-media"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Social Media
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Reports
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Settings
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          {userRole === "SYSADMIN" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin/dashboard")}
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin Portal
            </Button>
          )}
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
