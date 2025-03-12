"use client";
import { UserCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { createClient } from "../../supabase/client";
import { t } from "@/lib/content";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";

export default function UserProfile() {
  const supabase = createClient();
  const router = useRouter();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const cookies = parseCookies();
    const user = cookies.user ? JSON.parse(cookies.user) : null;
    if (user) {
      setUserRole(user.role);
    }
  }, []);

  const handleSignOut = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();

    // Redirect to sign-in page (cookies will be cleared by middleware)
    router.push("/sign-in");
  };

  const handleSettings = () => {
    if (userRole === "SYSADMIN") {
      router.push("/admin/settings");
    } else if (userRole === "CLIENTADMIN") {
      router.push("/settings");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <UserCircle className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSettings}>
          {t("nav.settings")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          {t("nav.signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
