import os
import base64
import io
import json
import shutil
import chromadb
# Google imports removed
from chromadb.utils import embedding_functions
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Request, Response
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_groq import ChatGroq
from groq import Groq # ✅ Import Groq Client for Audio
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse, Gather
from fpdf import FPDF
from docx import Document
import PyPDF2
import speech_recognition as sr
import pyttsx3
import requests
import time

# ==========================================
# 👇 API KEYS
# ==========================================
GROQ_API_KEY = "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" 

TWILIO_SID = "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
TWILIO_AUTH_TOKEN = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
TWILIO_PHONE_NUMBER = "+12765798633" 
VERIFIED_FRIENDS = ["+918976021711"] 

app = FastAPI(title="Nyay Sahayak API", version="Final Hackathon Edition")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 🧠 DATABASE SETUP ---
try:
    chroma_client = chromadb.PersistentClient(path="./nyay_memory") 
    sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
    vector_db = chroma_client.get_or_create_collection(name="legal_cases", embedding_function=sentence_transformer_ef)
    print("✅ Database Connected!")
except Exception as e:
    print(f"⚠️ Database Error: {e}")
    vector_db = None

# --- 🤖 AI MODEL SETUP (GROQ ONLY) ---
try:
    # 1. For Chat/Text Generation
    draft_llm = ChatGroq(groq_api_key=GROQ_API_KEY, model_name="llama-3.3-70b-versatile", temperature=0.3)
    vision_llm = ChatGroq(groq_api_key=GROQ_API_KEY, model_name="llama-3.2-11b-vision-preview", temperature=0)
    
    # 2. For Audio/Whisper (Direct Client)
    groq_client = Groq(api_key=GROQ_API_KEY)
    
    print("✅ Groq Models Ready!")
except Exception as e:
    print(f"❌ Model Error: {e}")
    draft_llm = None
    vision_llm = None
    groq_client = None

try:
    twilio_client = Client(TWILIO_SID, TWILIO_AUTH_TOKEN)
    print("✅ Twilio Client Ready!")
except:
    twilio_client = None
    print("⚠️ Twilio Credentials Missing or Wrong")

# --- DATA MODELS ---
class UserQuery(BaseModel):
    question: str
    user_name: str = "User"
    role: str = "Citizen"
    language: str = "Hinglish"
    detail_level: str = "Detailed"
    state: str = "India (General)" 
    history: str = "" 

class ChatRequest(BaseModel):
    message: str
    history: str = ""

class RentAgreementQuery(BaseModel):
    landlord: str
    tenant: str
    rent: str
    address: str
    date: str

class NoticeRequest(BaseModel):
    voice_input: str

class ReportChatRequest(BaseModel):
    user_input: str 
    history: str = ""

# ==========================================
# ⚡ LIVE STREAMING CHAT (GROQ LLAMA-3)
# ==========================================

async def generate_live_response(message, history):
    system_prompt = "You are Nyay Sahayak, an AI Legal Assistant for Indians. Provide accurate, helpful legal advice in Hinglish. Keep it conversational but professional."
    full_prompt = f"{system_prompt}\n\nCONVERSATION HISTORY:\n{history}\n\nUSER: {message}\nAI:"
    
    try:
        if not draft_llm:
            yield "⚠️ Groq API Key missing or invalid."
            return

        # ✅ Using LangChain's astream for live tokens from Groq
        async for chunk in draft_llm.astream(full_prompt):
            if chunk.content:
                yield chunk.content
    except Exception as e:
        yield f"Error: {str(e)}"

@app.post("/stream-chat")
async def stream_chat(request: ChatRequest):
    return StreamingResponse(
        generate_live_response(request.message, request.history), 
        media_type="text/plain"
    )

# ==========================================
# 🕵️‍♂️ FILE REPORT INTERVIEW
# ==========================================
@app.post("/file-report-interview")
async def file_report_interview(data: ReportChatRequest):
    system_instruction = """
    ACT AS: An experienced, empathetic Police Officer (S.H.O) in India.
    GOAL: Gather details for an FIR (First Information Report).
    RULES: Ask ONLY ONE question at a time. Step-by-step. Speak in Hinglish.
    Once all details are gathered, say "REPORT_COLLECTED".
    """
    full_prompt = f"{system_instruction}\nHISTORY:\n{data.history}\nUser: {data.user_input}\nAI:"
    
    try:
        if not draft_llm:
            return {"answer": "AI Offline"}
        res = draft_llm.invoke(full_prompt)
        return {"answer": res.content, "status": "active"}
    except Exception as e:
        return {"error": str(e)}

# ==========================================
# 🎤 VOICE MESSAGE (GROQ WHISPER)
# ==========================================
@app.post("/voice-message")
async def voice_message(file: UploadFile = File(...), history: str = Form(default="")):
    print(f"🎤 Receiving Voice Note: {file.filename}")
    try:
        temp_filename = f"temp_{file.filename}"
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Transcribe using Groq Whisper
        if not groq_client:
             os.remove(temp_filename)
             return {"answer": "AI Config Error", "user_text": "Error"}

        with open(temp_filename, "rb") as audio_file:
            # ✅ UPDATED: Auto-Detect Language (Removed language='en')
            transcription = groq_client.audio.transcriptions.create(
                file=(temp_filename, audio_file.read()),
                model="whisper-large-v3", # Standard model
                response_format="json",
                # language="en",  <-- REMOVED THIS LINE TO ALLOW HINDI
                temperature=0.0
            )
        user_text = transcription.text
        
        # AI Response (Short & Conversational)
        full_prompt = f"ACT AS: Lawyer/Police. Reply in Hinglish. Keep it short and helpful.\nHISTORY:\n{history}\nUSER SAID: {user_text}"
        res = draft_llm.invoke(full_prompt)
        ai_response = res.content

        os.remove(temp_filename)
        return {"user_text": user_text, "answer": ai_response}
    except Exception as e:
        print(f"Voice Error: {e}")
        return {"answer": "Error processing audio.", "user_text": "Error"}

# ==========================================
# 📄 DOC GENERATORS (PDF/DOCX)
# ==========================================
@app.post("/generate-legal-notice")
async def generate_legal_notice(data: NoticeRequest):
    extraction_prompt = f"""
    Extract details for Legal Notice. JSON ONLY.
    User Complaint: "{data.voice_input}"
    Keys: sender_name, receiver_name, amount, reason, act
    """
    try:
        res = draft_llm.invoke(extraction_prompt)
        content = res.content.replace("```json", "").replace("```", "").strip()
        details = json.loads(content)
        
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", 'B', 16)
        pdf.cell(0, 10, txt="LEGAL NOTICE", ln=True, align='C')
        pdf.ln(10)
        pdf.set_font("Arial", size=12)
        notice_text = f"""To, {details.get('receiver_name', 'Receiver')}\n\nSubject: Legal Notice\n\nSir/Madam,\nOn behalf of {details.get('sender_name', 'Client')}, I state that you must resolve: {details.get('reason', 'Issue')}.\nOutstanding: {details.get('amount', 'N/A')}.\nFailure will lead to legal action under {details.get('act', 'Indian Laws')}."""
        pdf.multi_cell(0, 8, txt=notice_text)
        
        filename = f"Legal_Notice.pdf"
        pdf.output(filename)
        return FileResponse(path=filename, filename=filename, media_type='application/pdf')
    except Exception as e:
        return {"error": str(e)}

@app.post("/generate-rent-agreement")
async def generate_rent_agreement(data: RentAgreementQuery):
    try:
        doc = Document()
        doc.add_heading('RENT AGREEMENT', 0)
        doc.add_paragraph('Date: ' + data.date)
        doc.add_paragraph(f'LANDLORD: {data.landlord}', style='List Bullet')
        doc.add_paragraph(f'TENANT: {data.tenant}', style='List Bullet')
        filename = f"Rent_Agreement.docx"
        doc.save(filename)
        return FileResponse(path=filename, filename=filename, media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    except Exception as e:
        return {"error": str(e)}

# ==========================================
# 📞 TWILIO VOICE
# ==========================================
@app.post("/voice")
async def voice_handler(request: Request):
    resp = VoiceResponse()
    gather = Gather(num_digits=1, action='/handle-key', method='POST')
    gather.say("Welcome to Nyay Sahayak. Press 1 for Emergency.", voice='alice')
    resp.append(gather)
    return Response(content=str(resp), media_type="application/xml")

@app.post("/handle-key")
async def handle_key(Digits: str = Form(...)):
    resp = VoiceResponse()
    if Digits == '1':
        resp.say("Alerting contacts.", voice='alice')
        if twilio_client:
            for friend in VERIFIED_FRIENDS:
                try: twilio_client.messages.create(body="🚨 URGENT HELP!", from_=TWILIO_PHONE_NUMBER, to=friend)
                except: pass
    return Response(content=str(resp), media_type="application/xml")

