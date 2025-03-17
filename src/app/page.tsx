import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import {
  ArrowUpRight,
  BarChart3,
  MessageSquare,
  LineChart,
  BellRing,
  Upload,
  Bot,
} from "lucide-react";
import PricingButton from "@/components/pricing-button";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Use mock data directly instead of fetching from API
  const plans = [
    {
      id: "price_starter",
      name: "Starter",
      description: "Perfect for small businesses just getting started",
      amount: 99,
      interval: "month",
      features: [
        "Up to 1,000 feedback entries/month",
        "Basic sentiment analysis",
        "CSV imports",
        "Email support",
      ],
      popular: false,
    },
    {
      id: "price_pro",
      name: "Pro",
      description: "Advanced features for growing businesses",
      amount: 299,
      interval: "month",
      features: [
        "Up to 5,000 feedback entries/month",
        "Advanced sentiment analysis",
        "Theme extraction",
        "API access",
        "Priority support",
      ],
      popular: true,
    },
    {
      id: "price_enterprise",
      name: "Enterprise",
      description: "Custom solutions for large organizations",
      amount: 499,
      interval: "month",
      features: [
        "Unlimited feedback entries",
        "Custom AI models",
        "White-labeling",
        "Dedicated account manager",
        "24/7 support",
        "Custom integrations",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navbar />
      <Hero />
      {/* Features Section */}
      <section className="py-15 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-foreground text-3xl font-bold mb-4">
              Comprehensive Sentiment Analysis
            </h2>
            <p className="text-foreground max-w-2xl mx-auto">
              Famalytics helps businesses monitor, analyze, and respond to
              customer feedback across multiple channels using advanced AI
              technology.
            </p>
          </div>

          <div className="text-foreground grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Multi-Channel Dashboard",
                description:
                  "Real-time sentiment trends and visualizations across all your feedback channels",
              },
              {
                icon: <Upload className="w-6 h-6" />,
                title: "Easy Data Ingestion",
                description:
                  "CSV uploads, manual entry, and API integration for seamless data collection",
              },
              {
                icon: <Bot className="w-6 h-6" />,
                title: "AI-Powered Analysis",
                description:
                  "Automatically score sentiment and extract key themes from customer feedback",
              },
              {
                icon: <BellRing className="w-6 h-6" />,
                title: "Customizable Alerts",
                description:
                  "Get notified when sentiment drops below your defined thresholds",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-button-secondary rounded-xl shadow-sm hover:shadow-md transition-transform"
              >
                <div className="text-foreground mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-foreground text-3xl font-bold mb-4">
              How Famalytics Works
            </h2>
            <p className="text-foreground max-w-2xl mx-auto">
              Our platform makes it easy to understand what your customers are
              really saying
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                1. Import Your Data
              </h3>
              <p className="text-foreground">
                Upload customer feedback from multiple sources or connect via
                API
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. AI Analysis</h3>
              <p className="text-foreground">
                Our AI automatically scores sentiment and identifies key themes
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center mb-4">
                <LineChart className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                3. Actionable Insights
              </h3>
              <p className="text-foreground">
                View trends, set alerts, and export reports to improve customer
                satisfaction
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-20 bg-card text-foreground">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">85%</div>
              <div className="text-foreground">Faster Insight Discovery</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">3x</div>
              <div className="text-foreground">
                Customer Satisfaction Improvement
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-foreground">Sentiment Monitoring</div>
            </div>
          </div>
        </div>
      </section>
      {/* Use Cases Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-foreground text-3xl font-bold mb-4">
              Who Benefits from Famalytics
            </h2>
            <p className="text-foreground max-w-2xl mx-auto">
              Our platform is designed for businesses that value customer
              feedback
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-popover p-8 rounded-xl">
              <MessageSquare className="w-10 h-10 text-popover-foreground mb-4" />
              <h3 className="text-popover-foreground text-xl font-semibold mb-3">
                Customer Support Teams
              </h3>
              <p className="text-popover-foreground mb-4">
                Identify recurring issues and track sentiment trends across
                support channels
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-success mr-2">✓</span>
                  <span className="text-popover-foreground">
                    Reduce response time to negative feedback
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-success mr-2">✓</span>
                  <span className="text-popover-foreground">
                    Prioritize issues based on sentiment impact
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-popover p-8 rounded-xl">
              <BarChart3 className="w-10 h-10 text-popover-foreground mb-4" />
              <h3 className="text-popover-foreground text-xl font-semibold mb-3">
                Product Teams
              </h3>
              <p className="text-popover-foreground mb-4">
                Understand how customers feel about specific product features
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-success mr-2">✓</span>
                  <span className="text-popover-foreground">
                    Extract feature-specific feedback automatically
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-success mr-2">✓</span>
                  <span className="text-popover-foreground">
                    Track sentiment changes after product updates
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section className="py-24 bg-background" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-foreground text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your customer feedback analysis needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans?.map((item: any) =>
              item.popular ? (
                <div
                  key={item.id}
                  className="flex flex-col rounded-lg overflow-hidden bg-card scale-[1.07] shadow-lg border border-foreground transition-all hover:shadow-xl"
                >
                  <div className="bg-card-foregroundSecondary text-primary-secondary text-center py-2 font-medium">
                    Most Popular
                  </div>
                  <div className="p-6 flex-grow">
                    <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                    <p className="text-foreground mb-6">{item.description}</p>
                    <div className="flex items-baseline mb-6">
                      <span className="text-4xl font-bold">
                        ${(item.amount / 100).toFixed(2)}
                      </span>
                      <span className="text-foreground ml-2">
                        /{item.interval}
                      </span>
                    </div>
                    <div className="border-t border-primary pt-6 mb-6">
                      <h4 className="font-semibold mb-4">Features include:</h4>
                      <ul className="space-y-3">
                        {item.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-success mr-2">✓</span>
                            <span className="text-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="p-6 bg-card-primary-secondary border-t border-primary">
                    <PricingButton item={item} user={user ?? undefined} />
                  </div>
                </div>
              ) : (
                <div
                  key={item.id}
                  className="flex flex-col rounded-lg overflow-hidden bg-card shadow-lg border border-primary transition-all hover:shadow-xl"
                >
                  <div className="p-6 flex-grow">
                    <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                    <p className="text-foreground mb-6">{item.description}</p>
                    <div className="flex items-baseline mb-6">
                      <span className="text-4xl font-bold">
                        ${(item.amount / 100).toFixed(2)}
                      </span>
                      <span className="text-foreground ml-2">
                        /{item.interval}
                      </span>
                    </div>
                    <div className="border-t border-primary pt-6 mb-6">
                      <h4 className="font-semibold mb-4">Features include:</h4>
                      <ul className="space-y-3">
                        {item.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-success mr-2">✓</span>
                            <span className="text-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="p-6 bg-card-foregroundSecondary border-t border-primary">
                    <PricingButton item={item} user={user ?? undefined} />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-foreground text-3xl font-bold mb-4">
            Ready to Understand Your Customers Better?
          </h2>
          <p className="text-foreground mb-8 max-w-2xl mx-auto">
            Start analyzing customer sentiment across all your channels today.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-foreground transition-transform bg-button-secondary rounded-lg hover:opacity-75 hover:scale-[1.01]"
          >
            Get Started Free
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
}
