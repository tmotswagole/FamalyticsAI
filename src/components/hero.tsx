import Link from "next/link";
import { ArrowUpRight, Check, BarChart3, MessageSquare } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-8 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                AI-Powered
              </span>{" "}
              Customer Sentiment Analysis
            </h1>

            <p className="text-xl text-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Understand what your customers are really saying. Famalytics
              analyzes feedback across all channels to help you make data-driven
              decisions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-foreground bg-button-secondary rounded-lg hover:opacity-75 hover:scale-[1.01] transition-transform text-lg font-medium"
              >
                Get Started Free
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="#pricing"
                className="inline-flex items-center px-8 py-4 text-background bg-foreground rounded-lg hover:opacity-75 hover:scale-[1.01] transition-transform text-lg font-medium"
              >
                View Pricing
              </Link>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-success" />
                <span>Multi-channel analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-success" />
                <span>Real-time sentiment tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-success" />
                <span>Customizable alerts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
