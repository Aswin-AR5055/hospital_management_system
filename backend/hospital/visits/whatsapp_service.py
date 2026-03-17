import os
from twilio.rest import Client

class WhatsAppService:
    def __init__(self):
        self.account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        self.auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        self.from_number = os.getenv('TWILIO_WHATSAPP_NUMBER')

        if self.account_sid and self.auth_token:
            self.client = Client(self.account_sid, self.auth_token)
        else:
            self.client = None
            print("[WhatsApp] ERROR: Twilio credentials not found in environment")

    def send_token_notification(self, visit):
        if not self.client:
            print("[WhatsApp] ERROR: Twilio not configured.")
            return False

        patient = visit.patient
        if not patient.whatsapp_no:
            print(f"[WhatsApp] ERROR: Patient {patient.name} has no WhatsApp number.")
            return False

        intime = visit.intime.strftime('%d-%m-%Y %I:%M %p')
        outtime = visit.outtime.strftime('%d-%m-%Y %I:%M %p') if visit.outtime else 'Pending'

        message_body = f"""🏥 *Token Confirmation*

*Name:* {patient.name}
*Token No:* {visit.token_no}
*In Time:* {intime}
*Out Time:* {outtime}"""

        try:
            to_number = f"whatsapp:{patient.whatsapp_no}"
            message = self.client.messages.create(
                body=message_body,
                from_=self.from_number,
                to=to_number
            )
            print(f"[WhatsApp] SUCCESS! Message SID: {message.sid}")
            return True
        except Exception as e:
            print(f"[WhatsApp] ERROR: {str(e)}")
            return False

    def send_outtime_notification(self, visit):
        if not self.client:
            print("[WhatsApp] ERROR: Twilio not configured.")
            return False

        patient = visit.patient
        if not patient.whatsapp_no:
            return False

        outtime = visit.outtime.strftime('%d-%m-%Y %I:%M %p')

        message_body = f"""✅ *Consultation Complete*

*Name:* {patient.name}
*Token No:* {visit.token_no}
*Out Time:* {outtime}

Thank you for visiting. Get well soon! 🙏"""

        try:
            to_number = f"whatsapp:{patient.whatsapp_no}"
            message = self.client.messages.create(
                body=message_body,
                from_=self.from_number,
                to=to_number
            )
            print(f"[WhatsApp] Outtime notification sent. SID: {message.sid}")
            return True
        except Exception as e:
            print(f"[WhatsApp] ERROR: {str(e)}")
            return False
