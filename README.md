# 🔍 AI Code Review Assistant

An intelligent code review application powered by **Mistral AI** that provides instant, detailed feedback on your code. Built with Next.js, TypeScript, and Tailwind CSS.

![Mistral AI](https://img.shields.io/badge/Mistral-AI-FF7000?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

<img width="1462" height="895" alt="Screenshot_20251106_225354" src="https://github.com/user-attachments/assets/12b1518b-892e-4a07-9606-3cc0bed94688" />


---

## ✨ Features

- **🤖 AI-Powered Reviews**: Uses Mistral AI's Chat Completion API for intelligent code analysis
- **🎯 Multi-Language Support**: JavaScript, TypeScript, Python, Go, and Rust
- **📊 Code Metrics**: Automatic calculation of lines, functions, complexity score, and read time
- **✨ Syntax Highlighting**: Beautiful code display in both input and output
---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Mistral AI API key from [console.mistral.ai](https://console.mistral.ai/)

### Installation

```bash
# Clone and install
git clone <your-repo>
cd mix-tral-app
npm install

# Set up environment
echo "MISTRAL_API_KEY=your_key_here" > .env.local

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Project Structure

```
mix-tral-app/
├── app/
│   ├── api/review/route.ts    # API endpoint
│   └── page.tsx                # Main UI
├── lib/
│   ├── mistral-agent.ts        # Mistral integration
│   ├── code-analyzer.ts        # Metrics calculation
│   └── types.ts                # TypeScript types
├── components/
│   └── PixelBlast.tsx          # Animated background
└── .env.local                  # API key (create this)
```

---

## 💡 How It Works

1. **User submits code** → Frontend sends to `/api/review`
2. **Mistral analyzes** → Chat Completion API processes code
3. **Metrics calculated** → Backend computes complexity metrics
4. **Results displayed** → Formatted review with metrics card
