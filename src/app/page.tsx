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

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />
      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-gray-600 text-3xl font-bold mb-4">
              Comprehensive Sentiment Analysis
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Famalytics helps businesses monitor, analyze, and respond to
              customer feedback across multiple channels using advanced AI
              technology.
            </p>
          </div>

          <div className="text-gray-600 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-gray-600 text-3xl font-bold mb-4">
              How Famalytics Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to understand what your customers are
              really saying
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                1. Import Your Data
              </h3>
              <p className="text-gray-600">
                Upload customer feedback from multiple sources or connect via
                API
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. AI Analysis</h3>
              <p className="text-gray-600">
                Our AI automatically scores sentiment and identifies key themes
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <LineChart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                3. Actionable Insights
              </h3>
              <p className="text-gray-600">
                View trends, set alerts, and export reports to improve customer
                satisfaction
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">85%</div>
              <div className="text-blue-100">Faster Insight Discovery</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">3x</div>
              <div className="text-blue-100">
                Customer Satisfaction Improvement
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Sentiment Monitoring</div>
            </div>
          </div>
        </div>
      </section>
      {/* Use Cases Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-gray-600 text-3xl font-bold mb-4">
              Who Benefits from Famalytics
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform is designed for businesses that value customer
              feedback
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-xl">
              <MessageSquare className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-blue-600 text-xl font-semibold mb-3">
                Customer Support Teams
              </h3>
              <p className="text-gray-600 mb-4">
                Identify recurring issues and track sentiment trends across
                support channels
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">
                    Reduce response time to negative feedback
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">
                    Prioritize issues based on sentiment impact
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <BarChart3 className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-blue-600 text-xl font-semibold mb-3">
                Product Teams
              </h3>
              <p className="text-gray-600 mb-4">
                Understand how customers feel about specific product features
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">
                    Extract feature-specific feedback automatically
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600">
                    Track sentiment changes after product updates
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section className="py-24 bg-gray-50" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-gray-600 text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your customer feedback analysis needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans?.map((item: any) => (
              <PricingCard key={item.id} item={item} user={user} />
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-gray-600 text-3xl font-bold mb-4">
            Ready to Understand Your Customers Better?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Start analyzing customer sentiment across all your channels today.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
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
