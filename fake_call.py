import requests

# Yeh tera Local Server URL hai (Jahan 'handle-key' logic hai)
url = "http://127.0.0.1:8000/handle-key"

# Hum server ko bol rahe hain: "Bhai, user ne '1' daba diya hai"
payload = {"Digits": "1"}

try:
    print("🚀 Fake Call Signal Bhej raha hun...")
    
    # Request Bhejo
    response = requests.post(url, data=payload)
    
    # Check karo kya hua
    if response.status_code == 200:
        print("\n✅ SUCCESS! Server ne signal pakad liya.")
        print("📩 Ab apne Verified Friends ke phone check kar, SMS aa gaya hoga!")
        print("Server Response (TwiML):", response.text)
    else:
        print(f"\n❌ Error aayi: Status Code {response.status_code}")
        print(response.text)

except Exception as e:
    print("\n❌ Connection Fail! Kya 'uvicorn' server chal raha hai?")
    print("Error:", e)