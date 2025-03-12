"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Client Settings</h1>
      <p>Here you can manage your client settings.</p>
      {/* Add more client-specific settings here */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
        <p>Update your account information and preferences.</p>
        <Button className="mt-2">Update Account</Button>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Notification Settings</h2>
        <p>Manage your notification preferences and channels.</p>
        <Button className="mt-2">Manage Notifications</Button>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Data Sources</h2>
        <p>Configure and manage your data sources.</p>
        <Button className="mt-2">Manage Data Sources</Button>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Sentiment Analysis</h2>
        <p>Customize sentiment analysis settings and parameters.</p>
        <Button className="mt-2">Customize Analysis</Button>
      </div>
      <Button onClick={() => router.back()} className="mt-8">
        Back
      </Button>
    </div>
  );
}
