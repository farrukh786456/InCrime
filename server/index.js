const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { protect } = require('./middleware/auth');

const { GoogleGenAI } = require('@google/genai');

const Chat = require('./models/Chat');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const app = express();
function normalizeQuestion(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/what is|explain|tell me|define|kya hai|kya hoti hai/g, '')
    .trim();
}

// CORS - Allow frontend Vercel URL
const allowedOrigins = [
  'http://localhost:3000',
  'https://in-crime.vercel.app',
  'http://localhost:3001',
];
if (process.env.CLIENT_URL) allowedOrigins.push(process.env.CLIENT_URL);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.log('CORS blocked:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedAdmin();
  })
  .catch(err => console.error('MongoDB error:', err));

async function seedAdmin() {
  try {
    const User = require('./models/User');
    const Category = require('./models/Category');
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({
        fullName: 'Admin',
        username: 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@incrime.pk',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'admin',
      });
      console.log('Admin created: admin / Admin@123456');
    }
    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      await Category.insertMany([
        { name: 'Criminal Cases', slug: 'criminal', type: 'criminal', icon: 'shield', description: 'Bail, theft, harassment, challan applications', isActive: true },
        { name: 'Family Cases', slug: 'family', type: 'family', icon: 'users', description: 'Nikah, divorce, custody, Dar-ul-Aman applications', isActive: true },
      ]);
      console.log('Default categories seeded');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/chatbot', require('./routes/chatbot'));

// Gemini AI Route
app.post('/api/ai-chat', protect, async (req, res) => {
  try {
 const rawMessage = req.body.message?.trim() || "";
 const userMessage = normalizeQuestion(rawMessage);

if (!userMessage) {
  return res.status(400).json({
    success: false,
    message: "Message is required",
  });
}

// AI cache check
const existingChat = await Chat.findOne({
  message: userMessage
});

if (existingChat) {
  return res.json({
    success: true,
    reply: existingChat.reply
  });
}

    const previousChats = await Chat.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(7);

    const conversationHistory = previousChats.length
      ? previousChats
          .reverse()
          .map(chat => `User: ${chat.message}\nAI: ${chat.reply}`)
          .join("\n")
      : "";

    // ✅ PROMPT HERE
    const systemPrompt = `
You are a professional legal assistant for Pakistan.

Rules:
- Answer only according to Pakistan law.
- If question is outside Pakistan law, politely refuse.
- Keep answers short, clear and structured.
- Do not give personal opinions.
`;

let response;

try {

  response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
${systemPrompt}

Conversation History:
${conversationHistory}

User: ${rawMessage}
AI:
`
  });

} catch (geminiError) {

  console.error("Gemini Error:", geminiError.message);

  return res.json({
    success: true,
    reply: "AI service temporarily unavailable. Please try again.",
    suggestions: [
      "How to file FIR?",
      "How to apply for bail?",
      "What are my rights if arrested?"
    ]
  });

}

const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || null;

if (!text) {
  return res.json({
    success: true,
    reply: "I couldn't generate a response right now."
  });
}

try {

await Chat.create({
  user: req.user._id,
  message: userMessage,
  reply: text
});
} catch (dbError) {

  console.error("Chat Save Error:", dbError.message);

}

res.json({
  success: true,
  reply: text
});

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ success: false });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
app.get('/', (req, res) => res.json({ message: 'InCrime API running', version: '1.0.0' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));

