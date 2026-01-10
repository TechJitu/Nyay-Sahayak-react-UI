import os
import base64
import io
import json
import chromadb
from chromadb.utils import embedding_functions
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Request, Response
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_groq import ChatGroq
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse, Gather
from fpdf import FPDF
from docx import Document
import PyPDF2

# ==========================================
# 👇 API KEYS (APNI KEYS YAHAN DALNA)
# ==========================================
GROQ_API_KEY = "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" 
TWILIO_SID = "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
TWILIO_AUTH_TOKEN = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
TWILIO_PHONE_NUMBER = "+1xxxxxxxxxx" 
VERIFIED_FRIENDS = ["+919876543210", "+919988776655"] 
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

# --- 🤖 AI MODEL SETUP ---
try:
    draft_llm = ChatGroq(groq_api_key=GROQ_API_KEY, model_name="llama-3.3-70b-versatile", temperature=0.3)
    vision_llm = ChatGroq(groq_api_key=GROQ_API_KEY, model_name="llama-3.2-11b-vision-preview", temperature=0)
    print("✅ AI Models Ready!")
except Exception as e:
    print(f"❌ Model Error: {e}")
    draft_llm = None
    vision_llm = None

try:
    twilio_client = Client(TWILIO_SID, TWILIO_AUTH_TOKEN)
    print("✅ Twilio Client Ready!")
except:
    twilio_client = None
    print("⚠️ Twilio Credentials Missing or Wrong")

report_memory = ""

# --- DATA MODELS ---
class UserQuery(BaseModel):
    question: str
    user_name: str = "User"
    role: str = "Citizen"
    language: str = "Hinglish"
    detail_level: str = "Detailed"
    state: str = "India (General)" 

class RentAgreementQuery(BaseModel):
    landlord: str
    tenant: str
    rent: str
    address: str
    date: str

class NoticeRequest(BaseModel):
    voice_input: str

# ==========================================
# 🧠 MAIN INTELLIGENCE (ASK)
# ==========================================

@app.post("/ask")
async def ask_question(query: UserQuery):
    print(f"📍 Query: {query.question} | State: {query.state}")
    try:
        results = vector_db.query(query_texts=[query.question], n_results=2)
        context = "\n".join(results['documents'][0]) if results['documents'] else "No case law."
    except: context = "DB Unavailable"

    state_instruction = ""
    if query.state != "India (General)":
        state_instruction = f"Prioritize **{query.state} State Laws**."

    prompt = f"""
    ACT AS: Legal Assistant. {state_instruction}
    Context: {context}
    Question: {query.question}
    Answer in {query.language}:
    """
    
    if not draft_llm: return {"answer": "⚠️ AI Key Missing."}
    res = draft_llm.invoke(prompt)
    return {"answer": res.content, "status": "success"}

# ==========================================
# 🔥 USP: NYAY PATRA (VOICE TO LEGAL NOTICE)
# ==========================================

@app.post("/generate-legal-notice")
async def generate_legal_notice(data: NoticeRequest):
    # 1. AI se Data Extract Karo
    extraction_prompt = f"""
    You are a Senior Legal Clerk. Extract specific details from this user's complaint to draft a Legal Notice.
    User Complaint: "{data.voice_input}"
    
    RETURN ONLY JSON (No Markdown):
    {{
        "sender_name": "Extract or use '[Your Name]'",
        "receiver_name": "Extract or use '[Receiver Name]'",
        "amount": "Extract amount or 'N/A'",
        "reason": "Summarize the grievance in legal terms",
        "act": "Identify relevant Indian Act (e.g. Negotiable Instruments Act, Consumer Protection Act)"
    }}
    """
    
    try:
        # Extract Details
        res = draft_llm.invoke(extraction_prompt)
        content = res.content.replace("```json", "").replace("```", "").strip()
        details = json.loads(content)
        
        # 2. PDF Generate Karo (Professional Format)
        pdf = FPDF()
        pdf.add_page()
        
        # Header
        pdf.set_font("Arial", 'B', 16)
        pdf.cell(0, 10, txt="LEGAL NOTICE", ln=True, align='C')
        pdf.ln(10)
        
        # Body
        pdf.set_font("Arial", size=12)
        notice_text = f"""To,
{details['receiver_name']}
(Address Unknown)

SUBJECT: LEGAL NOTICE FOR RECOVERY OF DUES / GRIEVANCE REDRESSAL

Sir/Madam,

1. Under the instruction of my client, {details['sender_name']}, I hereby serve you this legal notice.

2. That you are legally liable to pay/resolve the issue regarding: {details['reason']}.

3. That despite repeated reminders, you have failed to comply. The outstanding amount involved is {details['amount']}.

4. This act of yours falls under {details['act']} and other relevant provisions of the Indian Penal Code.

5. I hereby call upon you to resolve this matter within 15 days of receipt of this notice, failing which my client shall be constrained to initiate civil/criminal proceedings against you at your risk and cost.

Sincerely,
Nyay Sahayak AI Legal Cell
(Digital Signature)
"""
        
        pdf.multi_cell(0, 8, txt=notice_text)
        
        # Output
        filename = f"Legal_Notice_{details['receiver_name'].replace(' ', '_')}.pdf"
        pdf.output(filename)
        
        return FileResponse(path=filename, filename=filename, media_type='application/pdf')
        
    except Exception as e:
        return {"error": str(e)}

# ==========================================
# 📄 DOCUMENT GENERATOR (RENT AGREEMENT)
# ==========================================

@app.post("/generate-rent-agreement")
async def generate_rent_agreement(data: RentAgreementQuery):
    try:
        doc = Document()
        doc.add_heading('RENT AGREEMENT', 0)
        doc.add_paragraph('Date: ' + data.date)
        doc.add_paragraph(f'LANDLORD: {data.landlord}', style='List Bullet')
        doc.add_paragraph(f'TENANT: {data.tenant}', style='List Bullet')
        doc.add_heading('TERMS:', level=1)
        doc.add_paragraph(f'Property: {data.address}')
        doc.add_paragraph(f'Rent: Rs. {data.rent}/- per month')
        doc.add_paragraph('Standard legal terms apply.')
        
        filename = f"Rent_Agreement_{data.tenant}.docx"
        doc.save(filename)
        return FileResponse(path=filename, filename=filename, media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    except Exception as e:
        return {"error": str(e)}

# ==========================================
# 📂 ADVOCATE TOOLS
# ==========================================

@app.post("/analyze-dossier")
async def analyze_dossier(file: UploadFile = File(...)):
    content = await file.read()
    text = ""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        for page in pdf_reader.pages[:15]: text += page.extract_text()
    except: return {"error": "PDF Read Error"}

    if len(text) < 50: return {"error": "PDF Empty"}

    prompt = f"""
    Act as Lawyer. Analyze under BNS 2023. RETURN JSON ONLY.
    Format: {{ "case_title": "...", "case_details": "...", "timeline": [], "documents": [], "opposition_analysis": [], "defence_strategy": [] }}
    TEXT: {text[:10000]}
    """
    try:
        res = draft_llm.invoke(prompt)
        return json.loads(res.content.replace("```json", "").replace("```", "").strip())
    except:
        return {"case_title": "Analysis Ready", "timeline":[], "documents":[], "defence_strategy":["Check complete code for full logic"]}

@app.post("/generate-report")
async def generate_report(query: UserQuery):
    return {"answer": "Report Logic Placeholder", "status": "interview"}

@app.post("/analyze-fir")
async def analyze_fir(file: UploadFile = File(...)):
    content = await file.read()
    b64 = base64.b64encode(content).decode()
    msg = {"role": "user", "content": [{"type": "text", "text": "Analyze FIR."}, {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}}]}
    res = vision_llm.invoke([msg]) if vision_llm else "Vision AI Offline"
    return {"answer": res.content if vision_llm else res}

# ==========================================
# 📞 TWILIO HANDLERS (DEBUG MODE ON)
# ==========================================

@app.post("/voice")
async def voice_handler(request: Request):
    resp = VoiceResponse()
    gather = Gather(num_digits=1, action='/handle-key', method='POST')
    gather.say("Welcome to Nyay Sahayak. Press 1 for Emergency SOS. Press 2 for Legal Advice.", voice='alice', language='en-IN')
    resp.append(gather)
    return Response(content=str(resp), media_type="application/xml")

@app.post("/handle-key")
async def handle_key(Digits: str = Form(...)):
    resp = VoiceResponse()
    print(f"📞 Key Pressed: {Digits}") 

    if Digits == '1':
        resp.say("Emergency Mode Activated. Sending Alert.", voice='alice')
        
        if twilio_client:
            print(f"🚀 Sending SMS from {TWILIO_PHONE_NUMBER} to {VERIFIED_FRIENDS}...")
            for friend in VERIFIED_FRIENDS:
                try: 
                    msg = twilio_client.messages.create(
                        body="🚨 URGENT: I need help! This is a test alert from Nyay Sahayak.", 
                        from_=TWILIO_PHONE_NUMBER, 
                        to=friend
                    )
                    print(f"✅ SMS SENT SUCCESS! SID: {msg.sid}")
                except Exception as e: 
                    print(f"❌ SMS FAILED: {str(e)}")
                    print("💡 Tip: Check Geo Permissions in Twilio Console for India (+91)")
        else:
            print("⚠️ Twilio Client not active (Check SID/Token)")
            
    elif Digits == '2':
        resp.say("Please state your legal query.", voice='alice')
        resp.record(max_length=10, action='/process-speech')
    
    return Response(content=str(resp), media_type="application/xml")

@app.post("/process-speech")
async def process_speech(RecordingUrl: str = Form(...)):
    print(f"🎤 Voice Recorded URL: {RecordingUrl}")
    return Response(content=str(VoiceResponse().say("We received your query.")), media_type="application/xml")

# ==========================================
# 🕵️‍♂️ NEW FEATURE: INTERACTIVE FILE REPORT (CROSS QUESTIONING)
# ==========================================

# 1. Naya Data Model banayenge taaki purani chat history yaad rahe
class ReportChatRequest(BaseModel):
    user_input: str  # Jo user abhi bolega
    history: str = "" # Pichli baatein (Example: "User: Chain snatching hui.\nAI: Kab hui?")

@app.post("/file-report-interview")
async def file_report_interview(data: ReportChatRequest):
    """
    Yeh endpoint user se ek-ek karke sawal puchega jab tak puri detail na mil jaye.
    """
    
    # System Prompt: Isme hum AI ko batayenge ki woh Police Officer hai
    system_instruction = """
    ACT AS: An experienced, empathetic Police Officer (S.H.O) in India.
    GOAL: Gather details for an FIR (First Information Report) from the user.
    
    RULES:
    1. Ask ONLY ONE question at a time. Do not overwhelm the user.
    2. Step-by-step gather: 
       - Incident Type (if not known)
       - Date & Time
       - Exact Location
       - Description of Incident/Suspect
       - Any Witnesses
    3. If the user answers, acknowledge it briefly and ask the next missing detail.
    4. Speak in Hinglish (Mix of Hindi & English) to make the user comfortable.
    5. Once you have ALL details (Who, When, Where, What, How), say exactly: "REPORT_COLLECTED: Here is your summary..." and show the summary.
    """

    # AI ke liye pura context tayyar kar rahe hain
    full_prompt = f"""
    {system_instruction}

    --- CONVERSATION HISTORY ---
    {data.history}

    --- CURRENT USER INPUT ---
    User: {data.user_input}

    --- YOUR RESPONSE (Next Question or Summary) ---
    AI:
    """

    try:
        if not draft_llm:
            return {"answer": "⚠️ AI System Offline. Please check API Keys."}
            
        # AI se response generate karwao
        res = draft_llm.invoke(full_prompt)
        ai_response = res.content
        
        return {
            "answer": ai_response,
            "status": "active" if "REPORT_COLLECTED" not in ai_response else "completed"
        }

    except Exception as e:
        return {"error": str(e)}
    # app.py ke imports mein yeh hona chahiye
import shutil # File save karne ke liye

# ... (Baki code same rahega) ...

# ==========================================
# 🎤 NEW: WHATSAPP STYLE VOICE MESSAGE
# ==========================================

@app.post("/voice-message")
async def voice_message(
    file: UploadFile = File(...), 
    history: str = Form(default="") # 👈 CHANGE: Isse 'default=""' kar diya taaki 422 error na aaye
):
    print(f"🎤 Receiving Voice Note: {file.filename}")
    
    try:
        # 1. Temp File Save
        temp_filename = f"temp_{file.filename}"
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2. Transcribe (Audio -> Text)
        print("🗣️ Transcribing...")
        with open(temp_filename, "rb") as audio_file:
            transcription = draft_llm.client.audio.transcriptions.create(
                file=(temp_filename, audio_file.read()),
                model="distil-whisper-large-v3-en",
                response_format="json",
                language="en",
                temperature=0.0
            )
        
        user_text = transcription.text
        print(f"✅ Text: {user_text}")

        # 3. AI Response
        system_instruction = "ACT AS: Police Officer. Reply in Hindi/Hinglish. Keep it short."
        full_prompt = f"{system_instruction}\nHISTORY:\n{history}\nUSER SAID: {user_text}"
        
        res = draft_llm.invoke(full_prompt)
        ai_response = res.content

        # 4. Cleanup
        os.remove(temp_filename)

        return {
            "user_text": user_text,
            "answer": ai_response
        }

    except Exception as e:
        print(f"❌ Error: {e}")
        return {"answer": "Error processing audio.", "user_text": "Error"}@app.post("/voice-message")
async def voice_message(
    file: UploadFile = File(...), 
    history: str = Form(default="") # 👈 CHANGE: Isse 'default=""' kar diya taaki 422 error na aaye
):
    print(f"🎤 Receiving Voice Note: {file.filename}")
    
    try:
        # 1. Temp File Save
        temp_filename = f"temp_{file.filename}"
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2. Transcribe (Audio -> Text)
        print("🗣️ Transcribing...")
        with open(temp_filename, "rb") as audio_file:
            transcription = draft_llm.client.audio.transcriptions.create(
                file=(temp_filename, audio_file.read()),
                model="distil-whisper-large-v3-en",
                response_format="json",
                language="en",
                temperature=0.0
            )
        
        user_text = transcription.text
        print(f"✅ Text: {user_text}")

        # 3. AI Response
        system_instruction = "ACT AS: Police Officer. Reply in Hindi/Hinglish. Keep it short."
        full_prompt = f"{system_instruction}\nHISTORY:\n{history}\nUSER SAID: {user_text}"
        
        res = draft_llm.invoke(full_prompt)
        ai_response = res.content

        # 4. Cleanup
        os.remove(temp_filename)

        return {
            "user_text": user_text,
            "answer": ai_response
        }

    except Exception as e:
        print(f"❌ Error: {e}")
        return {"answer": "Error processing audio.", "user_text": "Error"}