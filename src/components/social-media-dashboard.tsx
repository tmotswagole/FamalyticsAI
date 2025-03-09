"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  MessageSquare,
  Share2,
  ThumbsUp,
  Eye,
  Loader2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EngagementMetrics } from "@/lib/social-media";
import { t } from "@/lib/content";

interface SocialMediaDashboardProps {
  organizationId: string;
}

export default function SocialMediaDashboard({
  organizationId,
}: SocialMediaDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [engagementData, setEngagementData] = useState<EngagementMetrics[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [timeframe, setTimeframe] = useState<string>("30");
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [syncingData, setSyncingData] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [newAccount, setNewAccount] = useState({
    platform: "facebook",
    name: "",
    username: "",
    accessToken: "",
    accessSecret: "",
    pageId: "",
    groupId: "",
  });

  // Platform icons mapping
  const platformIcons = {
    facebook: <Facebook className="h-5 w-5 text-blue-600" />,
    twitter: <Twitter className="h-5 w-5 text-blue-400" />,
    instagram: <Instagram className="h-5 w-5 text-pink-500" />,
    linkedin: <Linkedin className="h-5 w-5 text-blue-700" />,
  };

  // Fetch social media accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(
          `/api/social-media?organization_id=${organizationId}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch social media accounts");
        }
        const data = await response.json();
        setAccounts(data);
      } catch (err) {
        console.error("Error fetching social media accounts:", err);
        setError("Failed to load social media accounts");
      }
    };

    fetchAccounts();
  }, [organizationId]);

  // Fetch engagement data
  useEffect(() => {
    const fetchEngagementData = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = `/api/social-media/engagement?organization_id=${organizationId}&days=${timeframe}&analyze_sentiment=true`;

        if (selectedPlatform !== "all") {
          url += `&platform=${selectedPlatform}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch social media engagement data");
        }

        const data = await response.json();
        setEngagementData(data);

        // Update last synced time if we have accounts
        if (accounts.length > 0) {
          const mostRecentSync = accounts.reduce(
            (latest: string | null, account: any) => {
              if (!account.last_synced) return latest;
              if (!latest) return account.last_synced;
              return new Date(account.last_synced) > new Date(latest)
                ? account.last_synced
                : latest;
            },
            null,
          );

          setLastSynced(mostRecentSync);
        }
      } catch (err) {
        console.error("Error fetching engagement data:", err);
        setError("Failed to load social media engagement data");
      } finally {
        setLoading(false);
      }
    };

    if (accounts.length > 0) {
      fetchEngagementData();
    } else {
      setLoading(false);
    }
  }, [organizationId, selectedPlatform, timeframe, accounts]);

  // Handle manual sync of social media data
  const handleSyncData = async () => {
    if (syncingData || accounts.length === 0) return;

    setSyncingData(true);
    setError(null);

    try {
      const response = await fetch("/api/social-media/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organization_id: organizationId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to sync social media data");
      }

      // Refresh accounts and data after sync
      const accountsResponse = await fetch(
        `/api/social-media?organization_id=${organizationId}`,
      );
      const accountsData = await accountsResponse.json();
      setAccounts(accountsData);

      // Set last synced to now
      setLastSynced(new Date().toISOString());
    } catch (err) {
      console.error("Error syncing social media data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to sync social media data",
      );
    } finally {
      setSyncingData(false);
    }
  };

  // Handle adding a new social media account
  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Prepare credentials based on platform
      const credentials: any = {
        accessToken: newAccount.accessToken,
      };

      if (newAccount.platform === "facebook") {
        if (newAccount.pageId) credentials.pageId = newAccount.pageId;
        if (newAccount.groupId) credentials.groupId = newAccount.groupId;
      } else if (newAccount.platform === "twitter") {
        credentials.accessSecret = newAccount.accessSecret;
        credentials.username = newAccount.username;
      } else if (newAccount.platform === "instagram") {
        credentials.pageId = newAccount.pageId; // Instagram uses Facebook Page ID
      } else if (newAccount.platform === "linkedin") {
        credentials.pageId = newAccount.pageId; // LinkedIn Company ID/URN
      }

      const response = await fetch("/api/social-media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organization_id: organizationId,
          platform: newAccount.platform,
          name: newAccount.name,
          username: newAccount.username,
          credentials,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to add social media account",
        );
      }

      // Reset form and refresh accounts
      setNewAccount({
        platform: "facebook",
        name: "",
        username: "",
        accessToken: "",
        accessSecret: "",
        pageId: "",
        groupId: "",
      });
      setShowAddAccount(false);

      // Refresh accounts list
      const accountsResponse = await fetch(
        `/api/social-media?organization_id=${organizationId}`,
      );
      const accountsData = await accountsResponse.json();
      setAccounts(accountsData);
    } catch (err) {
      console.error("Error adding social media account:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to add social media account",
      );
    }
  };

  // Calculate summary metrics
  const calculateSummary = () => {
    if (!engagementData || engagementData.length === 0) {
      return {
        totalPosts: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        platformBreakdown: {},
        sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 },
      };
    }

    const totalPosts = engagementData.length;
    const totalLikes = engagementData.reduce(
      (sum, post) => sum + post.likes,
      0,
    );
    const totalComments = engagementData.reduce(
      (sum, post) => sum + post.comments,
      0,
    );
    const totalShares = engagementData.reduce(
      (sum, post) => sum + post.shares,
      0,
    );

    // Platform breakdown
    const platformBreakdown: Record<string, number> = {};
    engagementData.forEach((post) => {
      platformBreakdown[post.platform] =
        (platformBreakdown[post.platform] || 0) + 1;
    });

    // Sentiment breakdown
    const sentimentBreakdown = {
      positive: engagementData.filter(
        (post) => post.sentiment?.label === "positive",
      ).length,
      neutral: engagementData.filter(
        (post) => post.sentiment?.label === "neutral",
      ).length,
      negative: engagementData.filter(
        (post) => post.sentiment?.label === "negative",
      ).length,
    };

    return {
      totalPosts,
      totalLikes,
      totalComments,
      totalShares,
      platformBreakdown,
      sentimentBreakdown,
    };
  };

  const summary = calculateSummary();

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    return (
      platformIcons[platform as keyof typeof platformIcons] || (
        <BarChart3 className="h-5 w-5" />
      )
    );
  };

  // Get sentiment color class
  const getSentimentColorClass = (sentiment?: { label: string }) => {
    if (!sentiment) return "bg-gray-100 text-gray-800";
    switch (sentiment.label) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading && accounts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading social media data...</span>
      </div>
    );
  }

  if (accounts.length === 0 && !loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Media Integration</CardTitle>
          <CardDescription>
            Connect your social media accounts to analyze engagement and
            sentiment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="mb-4">No social media accounts connected yet.</p>
            <Button onClick={() => setShowAddAccount(true)}>
              Connect Account
            </Button>
          </div>

          {showAddAccount && (
            <div className="mt-6 p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-4">
                Add Social Media Account
              </h3>
              <form onSubmit={handleAddAccount}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Select
                      value={newAccount.platform}
                      onValueChange={(value) =>
                        setNewAccount({ ...newAccount, platform: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="twitter">Twitter/X</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="name">Account Name</Label>
                    <Input
                      id="name"
                      value={newAccount.name}
                      onChange={(e) =>
                        setNewAccount({ ...newAccount, name: e.target.value })
                      }
                      placeholder="My Company Facebook"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <Label htmlFor="username">Username/Handle</Label>
                  <Input
                    id="username"
                    value={newAccount.username}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, username: e.target.value })
                    }
                    placeholder="@username"
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="accessToken">Access Token</Label>
                  <Input
                    id="accessToken"
                    value={newAccount.accessToken}
                    onChange={(e) =>
                      setNewAccount({
                        ...newAccount,
                        accessToken: e.target.value,
                      })
                    }
                    placeholder="Access Token"
                    required
                  />
                </div>

                {newAccount.platform === "twitter" && (
                  <div className="mb-4">
                    <Label htmlFor="accessSecret">Access Secret</Label>
                    <Input
                      id="accessSecret"
                      value={newAccount.accessSecret}
                      onChange={(e) =>
                        setNewAccount({
                          ...newAccount,
                          accessSecret: e.target.value,
                        })
                      }
                      placeholder="Access Secret"
                      required
                    />
                  </div>
                )}

                {(newAccount.platform === "facebook" ||
                  newAccount.platform === "instagram") && (
                  <div className="mb-4">
                    <Label htmlFor="pageId">Page ID</Label>
                    <Input
                      id="pageId"
                      value={newAccount.pageId}
                      onChange={(e) =>
                        setNewAccount({ ...newAccount, pageId: e.target.value })
                      }
                      placeholder="Page ID"
                    />
                  </div>
                )}

                {newAccount.platform === "facebook" && (
                  <div className="mb-4">
                    <Label htmlFor="groupId">Group ID (if applicable)</Label>
                    <Input
                      id="groupId"
                      value={newAccount.groupId}
                      onChange={(e) =>
                        setNewAccount({
                          ...newAccount,
                          groupId: e.target.value,
                        })
                      }
                      placeholder="Group ID"
                    />
                  </div>
                )}

                {newAccount.platform === "linkedin" && (
                  <div className="mb-4">
                    <Label htmlFor="pageId">Company ID/URN</Label>
                    <Input
                      id="pageId"
                      value={newAccount.pageId}
                      onChange={(e) =>
                        setNewAccount({ ...newAccount, pageId: e.target.value })
                      }
                      placeholder="urn:li:organization:12345"
                      required
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddAccount(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add Account</Button>
                </div>
              </form>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Social Media Engagement</h2>
        <div className="flex items-center space-x-2">
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="twitter">Twitter/X</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={handleSyncData}
            disabled={loading || accounts.length === 0}
          >
            {syncingData ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>Sync Now</>
            )}
          </Button>

          <Button onClick={() => setShowAddAccount(true)}>Add Account</Button>
        </div>
      </div>

      {/* Connected accounts and last synced info */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-wrap gap-2">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full text-sm"
            >
              {getPlatformIcon(account.platform)}
              <span>{account.name}</span>
            </div>
          ))}
        </div>

        {lastSynced && (
          <div className="text-sm text-muted-foreground">
            Last synced: {formatDate(lastSynced)}
          </div>
        )}
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Posts
              </p>
              <h3 className="text-2xl font-bold mt-1">
                {summary.totalPosts.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Likes
              </p>
              <h3 className="text-2xl font-bold mt-1">
                {summary.totalLikes.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <ThumbsUp className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Comments
              </p>
              <h3 className="text-2xl font-bold mt-1">
                {summary.totalComments.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Shares
              </p>
              <h3 className="text-2xl font-bold mt-1">
                {summary.totalShares.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <Share2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading social media posts...</span>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : engagementData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No posts found for the selected criteria.
              </p>
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Platform
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Date
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Content
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Likes
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Comments
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Shares
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Sentiment
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {engagementData.map((post) => (
                          <tr
                            key={post.postId}
                            className="border-b transition-colors hover:bg-muted/50"
                          >
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                {getPlatformIcon(post.platform)}
                                <span className="capitalize">
                                  {post.platform}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              {formatDate(post.postDate)}
                            </td>
                            <td className="p-4 align-middle">
                              <div className="max-w-md truncate">
                                <a
                                  href={post.postUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {post.content.length > 100
                                    ? `${post.content.substring(0, 100)}...`
                                    : post.content || "[No text content]"}
                                </a>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              {post.likes.toLocaleString()}
                            </td>
                            <td className="p-4 align-middle">
                              {post.comments.toLocaleString()}
                            </td>
                            <td className="p-4 align-middle">
                              {post.shares.toLocaleString()}
                            </td>
                            <td className="p-4 align-middle">
                              {post.sentiment ? (
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSentimentColorClass(post.sentiment)}`}
                                >
                                  {post.sentiment.label
                                    .charAt(0)
                                    .toUpperCase() +
                                    post.sentiment.label.slice(1)}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>
                  Breakdown of posts by platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  {loading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  ) : Object.keys(summary.platformBreakdown).length > 0 ? (
                    <div className="w-full">
                      {Object.entries(summary.platformBreakdown).map(
                        ([platform, count]) => (
                          <div key={platform} className="mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                {getPlatformIcon(platform)}
                                <span className="capitalize">{platform}</span>
                              </div>
                              <span>{count} posts</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div
                                className="bg-primary h-2.5 rounded-full"
                                style={{
                                  width: `${(count / summary.totalPosts) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
                <CardDescription>
                  Breakdown of sentiment across posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  {loading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  ) : engagementData.length > 0 ? (
                    <div className="w-full">
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span>Positive</span>
                          <span>
                            {summary.sentimentBreakdown.positive} posts
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div
                            className="bg-green-500 h-2.5 rounded-full"
                            style={{
                              width: `${(summary.sentimentBreakdown.positive / summary.totalPosts) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span>Neutral</span>
                          <span>
                            {summary.sentimentBreakdown.neutral} posts
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div
                            className="bg-yellow-500 h-2.5 rounded-full"
                            style={{
                              width: `${(summary.sentimentBreakdown.neutral / summary.totalPosts) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span>Negative</span>
                          <span>
                            {summary.sentimentBreakdown.negative} posts
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div
                            className="bg-red-500 h-2.5 rounded-full"
                            style={{
                              width: `${(summary.sentimentBreakdown.negative / summary.totalPosts) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No sentiment data available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>
                Manage your social media connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              {accounts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="mb-4">
                    No social media accounts connected yet.
                  </p>
                  <Button onClick={() => setShowAddAccount(true)}>
                    Connect Account
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getPlatformIcon(account.platform)}
                        <div>
                          <h4 className="font-medium">{account.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {account.username || account.platform}
                            {account.last_synced &&
                              ` • Last synced: ${formatDate(account.last_synced)}`}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  ))}
                  <div className="mt-6">
                    <Button onClick={() => setShowAddAccount(true)}>
                      Add Another Account
                    </Button>
                  </div>
                </div>
              )}

              {showAddAccount && (
                <div className="mt-6 p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">
                    Add Social Media Account
                  </h3>
                  <form onSubmit={handleAddAccount}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="platform">Platform</Label>
                        <Select
                          value={newAccount.platform}
                          onValueChange={(value) =>
                            setNewAccount({ ...newAccount, platform: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="twitter">Twitter/X</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="name">Account Name</Label>
                        <Input
                          id="name"
                          value={newAccount.name}
                          onChange={(e) =>
                            setNewAccount({
                              ...newAccount,
                              name: e.target.value,
                            })
                          }
                          placeholder="My Company Facebook"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <Label htmlFor="username">Username/Handle</Label>
                      <Input
                        id="username"
                        value={newAccount.username}
                        onChange={(e) =>
                          setNewAccount({
                            ...newAccount,
                            username: e.target.value,
                          })
                        }
                        placeholder="@username"
                      />
                    </div>

                    <div className="mb-4">
                      <Label htmlFor="accessToken">Access Token</Label>
                      <Input
                        id="accessToken"
                        value={newAccount.accessToken}
                        onChange={(e) =>
                          setNewAccount({
                            ...newAccount,
                            accessToken: e.target.value,
                          })
                        }
                        placeholder="Access Token"
                        required
                      />
                    </div>

                    {newAccount.platform === "twitter" && (
                      <div className="mb-4">
                        <Label htmlFor="accessSecret">Access Secret</Label>
                        <Input
                          id="accessSecret"
                          value={newAccount.accessSecret}
                          onChange={(e) =>
                            setNewAccount({
                              ...newAccount,
                              accessSecret: e.target.value,
                            })
                          }
                          placeholder="Access Secret"
                          required
                        />
                      </div>
                    )}

                    {(newAccount.platform === "facebook" ||
                      newAccount.platform === "instagram") && (
                      <div className="mb-4">
                        <Label htmlFor="pageId">Page ID</Label>
                        <Input
                          id="pageId"
                          value={newAccount.pageId}
                          onChange={(e) =>
                            setNewAccount({
                              ...newAccount,
                              pageId: e.target.value,
                            })
                          }
                          placeholder="Page ID"
                        />
                      </div>
                    )}

                    {newAccount.platform === "facebook" && (
                      <div className="mb-4">
                        <Label htmlFor="groupId">
                          Group ID (if applicable)
                        </Label>
                        <Input
                          id="groupId"
                          value={newAccount.groupId}
                          onChange={(e) =>
                            setNewAccount({
                              ...newAccount,
                              groupId: e.target.value,
                            })
                          }
                          placeholder="Group ID"
                        />
                      </div>
                    )}

                    {newAccount.platform === "linkedin" && (
                      <div className="mb-4">
                        <Label htmlFor="pageId">Company ID/URN</Label>
                        <Input
                          id="pageId"
                          value={newAccount.pageId}
                          onChange={(e) =>
                            setNewAccount({
                              ...newAccount,
                              pageId: e.target.value,
                            })
                          }
                          placeholder="urn:li:organization:12345"
                          required
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddAccount(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Add Account</Button>
                    </div>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
