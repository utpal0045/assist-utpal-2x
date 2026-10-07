import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const MODEL = process.env.MODEL || 'gpt-5.6-luna';
const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

app.use(express.json({limit:'1mb'}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/api/status', (req,res)=>res.json({ok:true, configured:!!client, model:MODEL}));

app.post('/api/chat', async (req,res)=>{
  try {
    if (!client) return res.status(503).json({error:'AI API is not configured. Add OPENAI_API_KEY on the server.'});
    const {message, history=[]} = req.body || {};
    if (!message || typeof message !== 'string') return res.status(400).json({error:'Message is required.'});

    const safeHistory = Array.isArray(history) ? history.slice(-12).map(x=>({
      role:x.role === 'assistant' ? 'assistant':'user',
      content:String(x.content || '').slice(0,6000)
    })) : [];

    const response = await client.responses.create({
      model: MODEL,
      tools:[{type:'web_search'}],
      input:[
        {role:'developer',content:`You are ASSIST UTPAL 2X, a helpful general AI assistant. Answer in the user's language when possible, especially Assamese. Help with study, explanations, writing, coding, general information and everyday problems. Be clear and practical. For current or changing facts, use web search. Never claim certainty when information is unavailable. For schoolwork, explain step-by-step rather than only giving a bare answer.`},
        ...safeHistory,
        {role:'user',content:message}
      ]
    });
    res.json({answer:response.output_text || 'I could not generate an answer.'});
  } catch (err) {
    console.error(err);
    res.status(500).json({error:'AI request failed. Check your API key, billing, model access, and server logs.'});
  }
});

app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
app.listen(PORT,()=>console.log(`ASSIST UTPAL 2X running on http://localhost:${PORT}`));
