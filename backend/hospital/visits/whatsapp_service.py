import os
from twilio.rest import Client

class WhatsAppService:
    def __init__(self):
        self.account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        self.auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        self.from_number = os.getenv('TWILIO_WHATSAPP_NUMBER')
        
        print(f"[WhatsApp] Initializing...")
        print(f"[WhatsApp] Account SID: {self.account_sid[:10] if self.account_sid else 'NOT SET'}...")
        print(f"[WhatsApp] From Number: {self.from_number if self.from_number else 'NOT SET'}")
        
        if self.account_sid and self.auth_token:
            self.client = Client(self.account_sid, self.auth_token)
            print(f"[WhatsApp] Twilio client initialized successfully")
        else:
            self.client = None
            print(f"[WhatsApp] ERROR: Twilio credentials not found in environment")

    def send_visit_notification(self, visit):
        print(f"\n[WhatsApp] Attempting to send notification for visit #{visit.token_no}")
        
        if not self.client:
            print("[WhatsApp] ERROR: Twilio not configured. Skipping WhatsApp notification.")
            return False
        
        doctor = visit.doctor
        print(f"[WhatsApp] Doctor: {doctor.username}")
        print(f"[WhatsApp] Doctor phone: {doctor.phone_number if doctor.phone_number else 'NOT SET'}")
        
        if not doctor.phone_number:
            print(f"[WhatsApp] ERROR: Doctor {doctor.username} has no phone number.")
            return False
        
        patient = visit.patient
        message_body = f"""
🏥 *New Patient Visit*

👤 *Patient:* {patient.name}
👨‍⚕️ *Doctor:* {doctor.username}
🎫 *Token No:* {visit.token_no}
📅 *Date:* {visit.intime.strftime('%d-%m-%Y %I:%M %p')}

📋 *Patient Details:*
• Age: {patient.age} years
• Phone: {patient.phone}
• WhatsApp: {patient.whatsapp_no}

⚕️ *Health Issue:* {visit.health_issue or 'Not specified'}

💊 *Vitals:*
• BP: {visit.blood_pressure or 'N/A'}
• Weight: {visit.weight or 'N/A'} kg
• Temperature: {patient.temperature}°C

Please check your dashboard for more details.
        """.strip()
        
        try:
            to_number = f"whatsapp:{doctor.phone_number}"
            print(f"[WhatsApp] Sending to: {to_number}")
            print(f"[WhatsApp] From: {self.from_number}")
            
            message = self.client.messages.create(
                body=message_body,
                from_=self.from_number,
                to=to_number
            )
            print(f"[WhatsApp] SUCCESS! Message SID: {message.sid}")
            print(f"[WhatsApp] Status: {message.status}")
            return True
        except Exception as e:
            print(f"[WhatsApp] ERROR: Failed to send WhatsApp: {str(e)}")
            return False
