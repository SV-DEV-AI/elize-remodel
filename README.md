# Elize AI Chatbot

A premium, production-ready AI chatbot web application built with Next.js 15, React, Tailwind CSS, and shadcn/ui. 
Supports multiple AI providers including OpenAI, Anthropic, and Google Gemini.

## Features
- **Multi-Provider Support**: Switch seamlessly between OpenAI, Anthropic, and Gemini models.
- **Local Storage Security**: API keys are saved securely in your browser's local storage and are never saved to our servers.
- **Persistent Chat History**: Your conversations are saved locally and persist across page reloads.
- **Premium UI**: Features a beautiful dark-mode interface with glassmorphism effects and smooth animations.
- **Streaming Responses**: Real-time message streaming using the Vercel AI SDK.

## Setup Instructions

### Prerequisites
- Node.js 18.17 or later

### Installation

1. Clone the repository or download the source code.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.
5. Go to the **Settings** page and enter your API keys.

## Deployment on Vercel

This application is fully optimized for Vercel deployment.

1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Deploy to production:
   ```bash
   vercel deploy --prod
   ```
3. Once deployed, users can visit the URL, navigate to Settings, input their own API keys locally, and start chatting immediately without you needing to configure server environment variables!
