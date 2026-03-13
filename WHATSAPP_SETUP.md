# WhatsApp Notification Setup Guide

## Overview
This guide will help you set up WhatsApp notifications for doctors when new patient visits are created.

---

## API Provider Comparison

| Provider | Free Tier | Pricing (India) | Setup Difficulty | Recommendation |
|----------|-----------|-----------------|------------------|----------------|
| **Twilio** | $15 credit | $0.0088/conversation | Easy | ⭐ Best for getting started |
| **Meta WhatsApp Business API** | 1,000 conversations/month | $0.0042/conversation | Hard | Best for high volume |
| **Vonage** | €2 credit | $0.0057/message | Medium | Alternative option |
| **Gupshup** | Trial available | $0.004/message | Medium | Good for India |

**Recommendation: Start with Twilio** - Easiest setup, good documentation, reliable delivery.

---

## Twilio Setup Instructions

### Step 1: Create Twilio Account

1. Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free account (get $15 credit)
3. Verify your email and phone number

### Step 2: Get WhatsApp Sandbox Access

1. In Twilio Console, go to **Messaging** → **Try it out** → **Send a WhatsApp message**
2. You'll see a sandbox number (e.g., `+1 415 523 8886`)
3. Follow instructions to join the sandbox:
   - Send a WhatsApp message to the sandbox number
   - Message format: `join <your-sandbox-code>` (e.g., `join happy-tiger`)
4. You'll receive a confirmation message

### Step 3: Get Your Credentials

1. Go to Twilio Console Dashboard
2. Copy these values:
   - **Account SID** (starts with AC...)
   - **Auth Token** (click to reveal)
   - **WhatsApp Sandbox Number** (from Step 2)

### Step 4: Add Environment Variables

Add these to your `.env` file:

```env
# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

**Note**: The WhatsApp number must be in format `whatsapp:+14155238886`

### Step 5: Add Doctor Phone Numbers

1. Login to Django Admin: `http://localhost/admin/`
2. Go to **Users** → Select a doctor
3. Add phone number in format: `+919876543210` (with country code)
4. Save

### Step 6: Test the Integration

1. Rebuild Docker containers:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

2. Create a new patient visit from the reception dashboard
3. Doctor should receive WhatsApp notification instantly

---

## Production Setup (Moving from Sandbox)

### For Production Use:

1. **Apply for WhatsApp Business Account**:
   - Go to Twilio Console → Messaging → WhatsApp → Request Access
   - Fill business details
   - Wait for approval (1-3 days)

2. **Get Your Own WhatsApp Number**:
   - Purchase a Twilio phone number
   - Enable WhatsApp on it
   - Update `TWILIO_WHATSAPP_NUMBER` in `.env`

3. **Message Templates**:
   - Create pre-approved message templates
   - Required for production (WhatsApp policy)
   - Submit for approval in Twilio Console

---

## Message Format

Doctors will receive messages like this:

```
🏥 *New Patient Visit*

👤 *Patient:* John Doe
🎫 *Token No:* 5
📅 *Date:* 15-01-2025 10:30 AM

📋 *Patient Details:*
• Age: 45
• Gender: Male
• Phone: +919876543210

⚕️ *Health Issue:* Fever and cough

💊 *Vitals:*
• BP: 120/80
• Weight: 70 kg
• Height: 175 cm

Please check your dashboard for more details.
```

---

## Cost Estimation

### Twilio Pricing (India):
- **Sandbox**: Free (for testing)
- **Production**: ~₹0.70 per conversation
- **Conversation**: 24-hour window (multiple messages = 1 conversation)

### Example Monthly Cost:
- 50 patients/day × 30 days = 1,500 notifications
- Cost: 1,500 × ₹0.70 = ₹1,050/month (~$13/month)

### Free Tier:
- $15 credit = ~1,700 messages
- Good for 1-2 months of testing

---

## Alternative: Meta WhatsApp Business API

If you need cheaper rates for high volume:

### Pros:
- 1,000 free conversations/month
- Cheaper at scale ($0.0042/conversation)
- Official WhatsApp API

### Cons:
- Complex setup (requires Facebook Business Manager)
- Business verification needed
- Takes 1-2 weeks for approval
- Requires hosting webhook

### Setup:
1. Create Facebook Business Manager account
2. Apply for WhatsApp Business API access
3. Verify business documents
4. Set up webhook for message handling
5. Get approved message templates

**Recommendation**: Start with Twilio, migrate to Meta API if volume exceeds 5,000 messages/month.

---

## Troubleshooting

### Issue: "WhatsApp not configured" in logs
**Solution**: Check if environment variables are set correctly in `.env`

### Issue: "Doctor has no phone number"
**Solution**: Add phone number to doctor's profile in Django Admin

### Issue: "Failed to send WhatsApp"
**Solution**: 
- Verify Twilio credentials
- Check if doctor's phone joined sandbox (for testing)
- Check Twilio console for error logs

### Issue: Message not received
**Solution**:
- Ensure phone number format is correct: `+919876543210`
- Check if number is registered with WhatsApp
- Verify sandbox join status (for testing)

---

## Database Migration

Run this to add phone_number field to User model:

```bash
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

---

## Security Best Practices

1. **Never commit credentials** to Git
2. **Use environment variables** for all secrets
3. **Rotate tokens** periodically
4. **Monitor usage** in Twilio Console
5. **Set spending limits** in Twilio account settings

---

## Testing Checklist

- [ ] Twilio account created
- [ ] Sandbox joined with test phone
- [ ] Environment variables added
- [ ] Docker containers rebuilt
- [ ] Doctor phone number added
- [ ] Test visit created
- [ ] WhatsApp notification received

---

## Support

- **Twilio Docs**: https://www.twilio.com/docs/whatsapp
- **Twilio Support**: https://support.twilio.com
- **WhatsApp Business Policy**: https://www.whatsapp.com/legal/business-policy

---

## Next Steps

1. Set up Twilio sandbox (5 minutes)
2. Add environment variables (2 minutes)
3. Rebuild containers (3 minutes)
4. Test with a visit (1 minute)
5. Apply for production access (when ready)

**Total setup time: ~15 minutes** ⏱️
