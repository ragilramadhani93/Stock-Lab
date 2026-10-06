# MICROSTOCK ASSET LAB

An enterprise-grade AI production studio designed for commercial digital asset creators to research profitable topics, score market opportunities, synthesize stock-safe assets, audit quality and intellectual property compliance, generate layered search metadata, and export packages ready for submission to Adobe Stock, Shutterstock, and iStock / Getty Images.

---

## 1. Installation

Clone the repository and install all required dependencies:

```bash
npm install
```

---

## 2. Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```env
# Gemini API Key for server-side opportunity discovery and prompt synthesis
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Application URL
APP_URL="http://localhost:3000"
```

*Note: In Google AI Studio Build, `GEMINI_API_KEY` is automatically injected from the Secrets panel at runtime.*

---

## 3. Supabase Setup (Optional Database Integration)

For long-term multi-user cloud catalog storage, create a Supabase project and execute the following SQL migration:

```sql
-- Opportunities Table
CREATE TABLE research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  topic TEXT NOT NULL,
  opportunity_score INT NOT NULL,
  platform TEXT NOT NULL,
  content_type TEXT NOT NULL,
  market_gap JSONB,
  buyer_use_cases TEXT[],
  keyword_clusters TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Commercial Assets Table
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_id UUID REFERENCES research_projects(id),
  filename TEXT NOT NULL,
  title TEXT NOT NULL,
  format TEXT NOT NULL,
  data_url TEXT,
  vector_svg TEXT,
  prompt_details JSONB,
  quality_check JSONB,
  metadata JSONB,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. AI API Setup

The application uses Google GenAI with `@google/genai` TypeScript SDK on the server side:
- **Reasoning & Scoring**: `gemini-3.8-flash`
- **Telemetry Header**: User-Agent set to `aistudio-build`

If an external API is temporarily unreachable or API keys are in preview, the application utilizes an algorithmic market gap fallback engine to ensure continuous operation without broken screens.

---

## 5. Local Development

Run the development server with Vite:

```bash
npm run dev
```

The application will start on `http://localhost:3000`.

---

## 6. Production Deployment

To build and run in production:

```bash
npm run build
npm run preview
```

---

## 7. How to Add a New Stock Platform

To add a new platform (e.g. Freepik, Pond5):

1. Add the platform key to `Platform` in `src/types/index.ts`:
   ```typescript
   export type Platform = 'adobe_stock' | 'shutterstock' | 'istock' | 'generic' | 'freepik';
   ```

2. Add rule parameters to `src/config/platformRules.ts`:
   ```typescript
   freepik: {
     id: 'freepik',
     name: 'Freepik',
     titleMaxChars: 80,
     descriptionRequired: false,
     keywordsMin: 5,
     keywordsMax: 30,
     topKeywordsPriorityCount: 5,
     requiresAiFlag: true,
     allowedFormats: ['svg', 'jpg', 'eps'],
     categories: ['Vectors', 'Photos', 'Icons']
   }
   ```

3. Add CSV export transformation function in `src/services/csvExporter.ts`.

---

## 8. How to Update Platform Metadata Rules

Platform requirements (such as title character limits or keyword counts) are centrally defined in `src/config/platformRules.ts`:
- **Adobe Stock**: Max 70 characters title, max 49 keywords, first 10 keywords ordered by priority, Generative AI flag.
- **Shutterstock**: Descriptive sentence (7-200 characters), 7-50 keywords, primary category, illustration flag.
- **RFC 4180 CSV compliance**: Handled automatically in `src/services/csvExporter.ts`.
