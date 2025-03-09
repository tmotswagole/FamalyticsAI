# Famalytics MVP Technical Specification

## Overview
Famalytics is an AI-powered customer sentiment analysis platform that helps businesses monitor, analyze, and respond to customer feedback across multiple channels. This document outlines the technical specifications for building the MVP.

## Tech Stack
- **Frontend**: Next.js, Tailwind CSS, shadcn UI
- **Backend**: Next.js API routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **AI/NLP**: OpenAI API
- **Hosting**: Vercel

## 1. Multi-Channel Data Ingestion

### CSV Upload
- **Implementation**: Use the `react-dropzone` library for drag-and-drop file uploads
- **Processing**: Parse CSV files using `papaparse` library
- **Validation**: Validate CSV structure (required columns: text content, date, source)
- **Storage**: Store processed data in Supabase `feedback_entries` table

### Manual Entry
- **Form**: Create a form with fields for feedback text, source, date, and optional metadata
- **Validation**: Implement client and server-side validation
- **Storage**: Store entries in the same `feedback_entries` table

### API Integration
- **Endpoint**: Create a secure API endpoint `/api/feedback` that accepts POST requests
- **Authentication**: Require API key authentication (stored in Supabase)
- **Rate Limiting**: Implement rate limiting using `@upstash/ratelimit` and `@upstash/redis`
- **Webhook Support**: Allow third-party services to push data via webhooks

### Database Schema for Feedback
```sql
CREATE TABLE feedback_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  text_content TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  feedback_date TIMESTAMP WITH TIME ZONE,
  sentiment_score NUMERIC,
  sentiment_label TEXT,
  themes JSONB,
  keywords JSONB,
  metadata JSONB,
  processed BOOLEAN DEFAULT false
);
```

## 2. Real-Time Sentiment Analysis

### OpenAI Integration
- **API**: Use OpenAI's API for sentiment analysis and keyword extraction
- **Model**: Utilize `gpt-3.5-turbo` for cost-effective analysis
- **Prompt Engineering**: Create optimized prompts for sentiment scoring and keyword extraction
- **Processing Queue**: Implement a background job system using Supabase Edge Functions

### Sentiment Processing Flow
1. New feedback entries are marked as `processed=false`
2. A scheduled function processes unprocessed entries in batches
3. For each entry:
   - Call OpenAI API with appropriate prompt
   - Parse response to extract sentiment score (-1 to 1), sentiment label (positive, neutral, negative), and keywords
   - Update the entry with analysis results and set `processed=true`

### OpenAI Prompt Template
```
Analyze the following customer feedback for sentiment and key topics:

"${feedbackText}"

Provide a response in the following JSON format:
{
  "sentiment_score": [number between -1 and 1],
  "sentiment_label": ["positive", "neutral", or "negative"],
  "keywords": [array of up to 5 key topics or issues mentioned]
}
```

## 3. Trend & Theme Extraction

### Theme Clustering
- **Implementation**: Use OpenAI's API to categorize feedback into predefined themes
- **Theme Storage**: Store theme data in a separate `themes` table with relationships to feedback entries
- **Trend Detection**: Run daily aggregation to identify emerging themes and sentiment shifts

### Database Schema for Themes
```sql
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_system_generated BOOLEAN DEFAULT false
);

CREATE TABLE feedback_themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feedback_id UUID REFERENCES feedback_entries(id),
  theme_id UUID REFERENCES themes(id),
  confidence_score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Trend Analysis
- **Daily Aggregation**: Create a scheduled function to analyze feedback patterns
- **Metrics**: Track sentiment by theme, volume changes, and emerging keywords
- **Storage**: Store trend data in a `trend_reports` table for quick dashboard access

## 4. Automated Alerts

### Alert Configuration
- **Settings**: Allow users to configure alert thresholds for sentiment scores and volume changes
- **Channels**: Support email notifications and in-app alerts
- **Frequency**: Allow setting of alert frequency (immediate, daily digest, weekly)

### Alert Processing
- **Trigger Conditions**:
  - Sentiment drops below threshold
  - Sudden increase in negative feedback
  - New theme emerges with negative sentiment
  - Volume spike for specific theme
- **Notification Delivery**: Use Supabase Edge Functions to send emails and create in-app notifications

### Database Schema for Alerts
```sql
CREATE TABLE alert_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  theme_id UUID REFERENCES themes(id),
  sentiment_threshold NUMERIC,
  volume_threshold INTEGER,
  is_active BOOLEAN DEFAULT true,
  notification_channel TEXT[], -- ['email', 'in_app']
  frequency TEXT DEFAULT 'immediate', -- 'immediate', 'daily', 'weekly'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE alert_recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_configuration_id UUID REFERENCES alert_configurations(id),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE alert_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_configuration_id UUID REFERENCES alert_configurations(id),
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  trigger_reason TEXT,
  trigger_data JSONB,
  notification_sent BOOLEAN DEFAULT false,
  notification_sent_at TIMESTAMP WITH TIME ZONE
);
```

## 5. UI Screens & Flow

### Landing Page
- **Components**: Hero section, feature highlights, pricing, testimonials
- **Authentication**: Sign up and login buttons
- **Redirection**: Authenticated users redirected to dashboard

### Home Dashboard
- **Layout**: Responsive grid layout with card components
- **Components**:
  - Sentiment overview chart (line chart showing trends)
  - Theme distribution (pie chart)
  - Recent alerts (card list)
  - Volume metrics (numeric cards with indicators)
  - Quick filters for date ranges

### Feedback Detail Screen
- **Features**:
  - Paginated list of feedback entries
  - Filtering by source, sentiment, date, themes
  - Search functionality
  - Detail view with full text and analysis results
  - Manual theme tagging capability

### Trend & Alert Screen
- **Trend View**:
  - Visualizations of sentiment over time by theme
  - Emerging themes highlighted
  - Keyword cloud visualization
- **Alert Management**:
  - List of configured alerts
  - Alert history
  - Alert creation and editing interface

### Reporting & Export
- **Report Types**:
  - Sentiment summary
  - Theme analysis
  - Volume trends
  - Custom reports
- **Export Formats**: PDF, CSV, Excel
- **Scheduling**: Allow reports to be scheduled and emailed

### Settings & Integrations
- **User Management**: Add/edit/remove users and roles
- **API Configuration**: API key management and webhook setup
- **Alert Configuration**: Global alert settings
- **Theme Management**: Create and edit custom themes
- **Account Settings**: Organization profile, billing, subscription

## 6. User Roles & Account Management

### Role Definitions
- **System Admin (SYSADMIN)**:
  - Access to all system configuration
  - User management across all organizations
  - Cannot access client-specific feedback data
- **Client Admin (CLIENTADMIN)**:
  - Full access to organization data
  - Can manage users within organization
  - Configure integrations and alerts
  - Access all reports and dashboards
- **Client Observer (OBSERVER)**:
  - Read-only access to dashboards and reports
  - Cannot modify settings or configurations
  - Cannot access user management

### Database Schema for Organizations and Users
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  stripe_customer_id TEXT,
  settings JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE user_organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id),
  role TEXT NOT NULL, -- 'SYSADMIN', 'CLIENTADMIN', 'OBSERVER'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  invited_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, organization_id)
);
```

## 7. Technical Integration Details

### API Structure
- **Authentication**: JWT-based authentication via Supabase Auth
- **Endpoints**:
  - `/api/feedback` - CRUD operations for feedback
  - `/api/themes` - Theme management
  - `/api/alerts` - Alert configuration
  - `/api/reports` - Report generation
  - `/api/organizations` - Organization management
  - `/api/users` - User management
  - `/api/integrations` - External integration management

### Error Handling
- **Client-Side**: React Error Boundaries for component-level errors
- **API Routes**: Try/catch blocks with standardized error responses
- **Logging**: Error logging to Supabase for monitoring
- **User Feedback**: Toast notifications for errors with actionable messages

### Security Measures
- **Authentication**: Supabase Auth with email/password and social login options
- **Authorization**: Row-level security in Supabase for data isolation
- **API Security**: Rate limiting, CORS configuration, input validation
- **Data Protection**: Encryption for sensitive data, HTTPS enforcement
- **Libraries**: `next-secure-headers`, `helmet` for API routes

### Performance Optimization
- **Server-Side Rendering**: Use Next.js SSR for initial page loads
- **Static Generation**: Pre-render static parts of the application
- **Data Fetching**: Implement SWR for client-side data fetching with caching
- **Lazy Loading**: Use dynamic imports for non-critical components
- **Database**: Implement indexes on frequently queried columns
- **Caching**: Use Redis for caching frequent queries
- **Background Processing**: Offload heavy tasks to background functions

## 8. Testing Strategies

### Unit Testing
- **Framework**: Jest with React Testing Library
- **Coverage**: Target 80% code coverage
- **Components**: Test all UI components for rendering and interactions
- **Utilities**: Test helper functions and data transformations

### Integration Testing
- **API Testing**: Test all API endpoints with mock data
- **Database**: Test database operations with a test database
- **Authentication**: Test authentication flows and authorization rules

### End-to-End Testing
- **Framework**: Playwright
- **Scenarios**:
  - User registration and login
  - Data ingestion workflows
  - Dashboard interactions
  - Alert configuration
  - Report generation

### Manual Testing
- **Usability**: Conduct usability testing with sample users
- **Cross-Browser**: Test on Chrome, Firefox, Safari, and Edge
- **Responsive Design**: Test on desktop, tablet, and mobile devices

## 9. Design Specifications

### Color Palette
- **Primary Color**: #00ffff (Cyan)
- **Secondary Color**: #eaecc6 (Light Yellow-Green)
- **Neutral Colors**:
  - Background: #f8fafc
  - Text: #1e293b
  - Borders: #e2e8f0
- **Semantic Colors**:
  - Positive: #10b981 (Green)
  - Neutral: #6b7280 (Gray)
  - Negative: #ef4444 (Red)

### Typography
- **Font Family**: Inter (System fallback: sans-serif)
- **Heading Sizes**:
  - H1: 2.5rem (40px)
  - H2: 2rem (32px)
  - H3: 1.5rem (24px)
  - H4: 1.25rem (20px)
- **Body Text**: 1rem (16px)
- **Small Text**: 0.875rem (14px)

### Component Design
- **Cards**: Rounded corners (8px), subtle shadow, white background
- **Buttons**: Rounded corners (6px), consistent padding (12px 16px)
- **Forms**: Clear labels, validation feedback, consistent spacing
- **Charts**: Consistent color scheme, proper labeling, responsive sizing

### Accessibility
- **Color Contrast**: Ensure WCAG AA compliance (minimum 4.5:1 for normal text)
- **Keyboard Navigation**: All interactive elements must be keyboard accessible
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus States**: Visible focus indicators for all interactive elements

## 10. Deployment & DevOps

### Environments
- **Development**: For active development work
- **Staging**: For testing before production
- **Production**: Live environment for end users

### CI/CD Pipeline
- **Platform**: GitHub Actions
- **Process**:
  - Run tests on pull requests
  - Build and deploy to staging on merge to main
  - Deploy to production after manual approval

### Monitoring
- **Error Tracking**: Sentry integration
- **Performance**: Vercel Analytics
- **Usage Metrics**: Custom analytics dashboard

### Backup Strategy
- **Database**: Daily automated backups via Supabase
- **Retention**: 30 days of backups
- **Restoration**: Documented process for data restoration

## 11. Implementation Timeline

### Phase 1: Foundation (Weeks 1-2)
- Set up project structure and tech stack
- Implement authentication and basic user management
- Create database schema and initial migrations
- Develop basic UI components and layouts

### Phase 2: Core Features (Weeks 3-5)
- Implement data ingestion (CSV, manual entry)
- Develop sentiment analysis integration
- Create basic dashboard with visualizations
- Set up feedback detail views

### Phase 3: Advanced Features (Weeks 6-8)
- Implement theme extraction and trend analysis
- Develop alert system and notifications
- Create reporting and export functionality
- Build settings and integration screens

### Phase 4: Polish & Launch (Weeks 9-10)
- Implement API integration for external data
- Conduct thorough testing and bug fixes
- Optimize performance and security
- Prepare documentation and launch materials

## 12. Future Enhancements (Post-MVP)

- Additional data source integrations (social media, review sites)
- Advanced NLP features (entity recognition, sentiment aspect analysis)
- Competitor benchmarking
- Custom dashboards and visualization builder
- Mobile application
- AI-powered recommendation engine for addressing negative feedback
