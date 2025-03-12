"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>
      <p>Here you can manage your admin settings.</p>
      {/* Add more admin-specific settings here */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">User Management</h2>
        <p>Manage user roles, permissions, and access levels.</p>
        <Button className="mt-2">Manage Users</Button>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Platform Settings</h2>
        <p>Configure platform-wide settings and integrations.</p>
        <Button className="mt-2">Configure Platform</Button>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Data Management</h2>
        <p>Manage data sources, storage, and retention policies.</p>
        <Button className="mt-2">Manage Data</Button>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Analytics & Reporting</h2>
        <p>Generate and customize reports and analytics dashboards.</p>
        <Button className="mt-2">Generate Reports</Button>
      </div>
      <Button onClick={() => router.back()} className="mt-8">
        Back
      </Button>
    </div>
  );
}
