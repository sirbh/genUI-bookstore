# 📚 BookBot – AI-Powered Conversational Book Explorer

BookBot is a modern web application that lets users **search, filter, and explore books** using natural language. Instead of clicking through traditional filters, users can simply talk to the bot – and relevant book cards, graphs, and components are **streamed in real-time** to the frontend.

> ⚡ Built for the future of user interfaces – where the UI builds itself.

---

## ✨ Features

- 🔍 **Conversational Search** – Ask "Show me fantasy books under $20" and get instant results.
- ⚛️ **Component Streaming** – UI components are dynamically generated and streamed to the frontend.
- 🤖 **AI SDK Integration** – Backend uses LLMs to process intent and generate structured components.
- 🔐 **Coming Soon:** Auth, Save Books, Personal Collections
- 📚 Powered by the [Google Books API](https://developers.google.com/books)

---

## 🧠 Tech Stack

- **Frontend:** React (with support for streamed components)
- **AI SDK:** Custom LLM integration (supports prompt-to-component flow)
- **Backend:** Node.js / Express (optional depending on deployment)
- **Data Source:** Google Books API
- **Streaming:** Server-Sent Events / WebSockets for real-time UI updates

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/sirbh/genUI-bookstore.git
cd bookbot

# Install dependencies
npm install

# Start the dev server
npm run dev
```
