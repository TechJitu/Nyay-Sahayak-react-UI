# Nyay Sahayak - AI Legal Assistant for Indians

> **Your Personal Legal Aid Companion** - Get instant legal guidance, file complaints, and access government services in your preferred language.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Web-orange)

## Features

- **AI Legal Assistant** - Get instant legal advice powered by Llama 3.3
- **Voice Assistant** - Speak in Hindi/English/Hinglish, get responses in the same language
- **Document Generation** - Generate legal notices, rent agreements, and more
- **Google Authentication** - Secure login with Firebase
- **Chat History** - Your conversations saved securely
- **Multi-language Support** - Hindi, English, Hinglish, and regional languages
- **Responsive Design** - Works on desktop and mobile

## Tech Stack

### Frontend
- React 18 + Vite
- TailwindCSS
- Firebase (Auth & Firestore)
- Lucide React Icons

### Backend
- FastAPI (Python)
- Groq AI (Llama 3.3 70B)
- ChromaDB (Vector Database)
- Whisper (Voice Transcription)

## Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.10+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/TechJitu/Nyay-Sahayak-react-UI
cd Nyay-Sahayak-react-UI
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set your GROQ API key (REQUIRED!)
# Windows:
set GROQ_API_KEY=your_groq_api_key_here

# Linux/Mac:
export GROQ_API_KEY=your_groq_api_key_here

# Start the server
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

**Get your free GROQ API key at: https://console.groq.com/**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Configuration

### Environment Variables

#### Backend (`/backend`)
| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key for AI models | Yes |

#### Frontend (`/frontend`)
Firebase configuration is in `src/firebase.js`. To use your own Firebase project:

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Google provider)
3. Enable Firestore Database
4. Copy your config to `src/firebase.js`

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Project Structure

```
Nyay-Sahayak-react-UI/
├── backend/
│   ├── api.py              # FastAPI backend
│   ├── requirements.txt    # Python dependencies
│   └── nyay_memory/        # ChromaDB storage
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── firebase.js     # Firebase config
│   │   └── App.tsx         # Main app
│   ├── package.json
│   └── index.html
│
└── README.md
```

## Voice Assistant Usage

1. Click the **microphone button** on the chat interface
2. Speak your legal question in any language (Hindi/English/Hinglish)
3. AI responds in the **same language** you spoke
4. Click the speaker icon to hear the response

## Security Notes

- **Never commit API keys** to version control
- GROQ API key is loaded from environment variables
- Firebase API keys are safe to expose (restricted by domain rules)
- All user data is stored securely in Firebase

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Developers

- **@zubershk** - Lead Developer
- **@techJitu** - Backend Developer

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Groq](https://groq.com/) - For blazing fast AI inference
- [Firebase](https://firebase.google.com/) - For authentication and database
- [LangChain](https://langchain.com/) - For AI chain orchestration

---

<p align="center">
  Made with love in India
</p>
