"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <h1 className="text-2xl font-bold mb-4">Client Settings</h1>
      <p>Here you can manage your client settings.</p>
      {/* Add more client-specific settings here */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
        <p>Update your account information and preferences.</p>
        <Button className="mt-2 bg-[hsl(var(--button-bg))] text-[hsl(var(--button-primary))]">
          Update Account
        </Button>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Notification Settings</h2>
        <p>Manage your notification preferences and channels.</p>
        <Button className="mt-2 bg-[hsl(var(--button-bg))] text-[hsl(var(--button-primary))]">
          Manage Notifications
        </Button>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Data Sources</h2>
        <p>Configure and manage your data sources.</p>
        <Button className="mt-2 bg-[hsl(var(--button-bg))] text-[hsl(var(--button-primary))]">
          Manage Data Sources
        </Button>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Sentiment Analysis</h2>
        <p>Customize sentiment analysis settings and parameters.</p>
        <Button className="mt-2 bg-[hsl(var(--button-bg))] text-[hsl(var(--button-primary))]">
          Customize Analysis
        </Button>
      </div>
      <Button
        onClick={() => router.back()}
        className="mt-8 bg-[hsl(var(--button-bg))] text-[hsl(var(--button-primary))]"
      >
        Back
      </Button>
    </div>
  );
}
