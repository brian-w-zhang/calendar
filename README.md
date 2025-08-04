# Bond Calendar

<img width="1512" height="854" alt="image" src="https://github.com/user-attachments/assets/7c62db27-ab9e-480b-a5ae-3f347c6deebe" />
<img width="1512" height="856" alt="image" src="https://github.com/user-attachments/assets/d23213a1-5f14-45ce-81de-735e5185ee2f" />


Bond Calendar is a privacy-first web application that helps you understand yourself through your Google Calendar data. Built with Next.js, TypeScript, shadcn/ui, and OpenAI, this project lets you securely connect your Google Calendar, analyzes your events in real time, and generates a personalized AI summary about your habits, lifestyle, and productivity patterns. No user data is ever stored - everything is processed in-memory, and your information is wiped as soon as you refresh, close the tab, or clear cookies. There are no databases, no local storage, and no tracking.

## How It Works

When you visit the site, you are prompted to connect your Google Calendar using secure OAuth via the Google Cloud Calendar API. You can choose the timeframe for analysis: last 30 days, last year, or all time. Once connected, your calendar events are fetched (read-only), preprocessed to remove unnecessary or sensitive details, and then sent to OpenAI's API. 

The AI generates a tailored summary about you - highlighting your key activities, social patterns, work/life balance, and even how your priorities may have changed over time. The summary is conversational, insightful, and sometimes a bit witty or gently sarcastic, making the experience both useful and fun. You'll also see quick stats and recent events, but all data is ephemeral and never leaves your session.

## Tech Stack

The project uses Next.js for the frontend and API routes, shadcn/ui for beautiful and accessible UI components, and TypeScript for type safety. The Google Calendar integration is handled via the official Google Identity Services and Calendar API. All AI analysis is powered by OpenAI's GPT models, with prompts carefully engineered to provide authentic and engaging summaries.

## Key Features

- **Live Site**: Hosted on Vercel at https://bond-calendar.vercel.app/
- **Zero Data Storage**: No user information is stored - sessions are stateless and wiped on refresh or logout
- **AI-Powered Insights**: Generated summaries designed to help users make decisions or gain self-insight
- **Full TypeScript**: Entire codebase written in TypeScript for type safety
- **Privacy First**: No tracking, no databases, no local storage

## Getting Started Locally

### 1. Clone the repo and install dependencies

```bash
npm install
```

### 2. Set up your `.env.local` file

Create a `.env.local` file in the root directory and add your Google and OpenAI API keys:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
OPENAI_API_KEY=your_openai_api_key
```

### 3. Run the development server

You can use any of the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then open your browser to:

```
http://localhost:3000
```

### 4. Start editing

You can edit the main page in:

```
app/page.tsx
```

The UI uses the **Geist** font via `next/font` for a modern look. For more details on the tech stack, explore the code in the following directories:

* `components/`
* `hooks/`
* `lib/`

---

## Privacy & Security

This project is a demonstration of **privacy-first**, **AI-powered** personal analytics:

* ❌ No tracking
* ❌ No data storage
* ✅ All calendar data is processed **in real-time** and immediately **discarded** after generating your summary.
