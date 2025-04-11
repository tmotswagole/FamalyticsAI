import Link from "next/link";
import { createClient } from "@/utils/supabase/middleware";
import { NextRequest } from "next/server";
import { Button } from "./ui/button";
import { BarChart3 } from "lucide-react";
import UserProfile from "./user-profile";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSelector } from "./language-selector";
import { t } from "@/lib/content";

export default async function Navbar() {
  // Safely retrieve the current URL
  const currentUrl =
    typeof window !== "undefined"
      ? new URL(window.location.href)
      : "http://localhost:3000/";

  if (!currentUrl) {
    throw new Error("Unable to retrieve the current URL.");
  }

  // Create a NextRequest object
  const request = new NextRequest(currentUrl.toString());

  const createClientResponse = createClient(request);
  const supabase = createClientResponse.supabase;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="w-full border-b bg-background py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="text-xl font-bold flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-foreground" />
          <span>{t("app.name")}</span>
        </Link>
        <div className="hidden md:flex gap-6 items-center">
          <Link
            href="#"
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            {t("nav.features")}
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            {t("nav.howItWorks")}
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            {t("nav.pricing")}
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <LanguageSelector />
          <ThemeToggle />
          {user ? (
            <>
              {(() => {
                if (user.role === "SYSADMIN") {
                  return (
                    <Link
                      href="/admin/dashboard"
                      className="px-4 py-2 text-sm font-medium"
                    >
                      <Button>{t("nav.dashboard")}</Button>
                    </Link>
                  );
                } else if (user.role === "CLIENTADMIN") {
                  return (
                    <Link
                      href="/dashboard"
                      className="px-4 py-2 text-sm font-medium"
                    >
                      <Button>{t("nav.dashboard")}</Button>
                    </Link>
                  );
                }
              })()}
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-foreground hover:opacity-75 hover:scale-[1.01] hover:text-primary transition-transform shadow-md"
              >
                {t("nav.signIn")}
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-foreground rounded-md transition-transform hover:text-button-secondary hover:scale-[1.01] opacity-75 shadow-md"
              >
                {t("nav.signUp")}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
