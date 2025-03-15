import Link from "next/link";
import { Twitter, Linkedin, BarChart3 } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-popover border-t border-primary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Product Column */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-foreground hover:text-primary">
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-foreground hover:text-primary"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground hover:text-primary">
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions Column */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Solutions</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-foreground hover:text-primary">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground hover:text-primary">
                  Product Teams
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground hover:text-primary">
                  Marketing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground hover:text-primary">
                  Executive Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/documentation"
                  className="text-foreground hover:text-primary"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground hover:text-primary">
                  Sentiment Analysis Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground hover:text-primary">
                  Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-primary">
          <div className="flex items-center text-foreground mb-4 md:mb-0">
            <BarChart3 className="w-5 h-5 mr-2 text-foreground" />
            <span>© {currentYear} Famalytics. All rights reserved.</span>
          </div>

          <div className="flex space-x-6">
            <a href="/#" className="text-foreground hover:text-primary hover:scale-[1.05]">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a href="/#" className="text-foreground transition-transform hover:text-primary hover:scale-[1.05]">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
