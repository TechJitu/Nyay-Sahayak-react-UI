import os
from langchain_groq import ChatGroq
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate  # <--- Ye naya import hai

# ==========================================
# 👇 APNI GROQ KEY YAHAN PASTE KARO
# ==========================================
GROQ_API_KEY = "" 

# Setup Paths
DB_PATH = "vector_db/"

def ask_nyay_sahayak():
    print("🔄 System Load ho raha hai...")

    # 1. Embeddings (Ingest wali same)
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    # 2. Database Connection
    try:
        vector_db = Chroma(persist_directory=DB_PATH, embedding_function=embeddings)
    except Exception as e:
        print(f"❌ Error: Database nahi mila. Pehle ingest.py chalao. {e}")
        return

# 3. LLM Setup (Groq - New Llama 3.3 Model)
    llm = ChatGroq(
        groq_api_key=GROQ_API_KEY, 
        model_name="llama-3.3-70b-versatile",
        temperature=0
    )
    # 4. CUSTOM PROMPT (Yahan hum AI ko sikhayenge ki wo kaun hai)
    # Ye context aur question ko sahi jagah fit karega
    custom_prompt_template = """You are an expert Indian Legal Assistant named 'Nyay Sahayak'.
    Use the following pieces of context to answer the user's question.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    
    Context: {context}
    Question: {question}
    
    Answer in a helpful and concise manner:"""

    PROMPT = PromptTemplate(
        template=custom_prompt_template, input_variables=["context", "question"]
    )

    # 5. RAG Chain with Custom Prompt
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vector_db.as_retriever(search_kwargs={"k": 3}),
        return_source_documents=True,
        chain_type_kwargs={"prompt": PROMPT}  # <--- Yahan humne prompt set kiya
    )

    print("\n⚖️  NYAY SAHAYAK IS READY! (Llama 3 Powered)\nType 'exit' to stop.\n")

    while True:
        query = input("User: ")
        if query.lower() == "exit":
            break
        
        try:
            # Ab hum sirf 'query' bhej rahe hain, instruction nahi
            # Instruction upar PROMPT mein set ho chuki hai
            result = qa_chain.invoke({"query": query})
            
            print(f"\n🤖 Nyay Sahayak: {result['result']}")
            print("-" * 50)
            
            # Debugging: Dekhne ke liye ki kaunsa document uthaya
            # for doc in result['source_documents']:
            #     print(f"[Source: {doc.metadata['source']}]")

        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    ask_nyay_sahayak()