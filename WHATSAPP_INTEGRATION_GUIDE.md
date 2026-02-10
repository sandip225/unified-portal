# WhatsApp Integration Guide

## ✅ Implementation Status

### Backend (Complete)
- ✅ WhatsApp router created: `backend/app/routers/whatsapp.py`
- ✅ Router registered in `backend/app/main.py`
- ✅ Webhook endpoints configured
- ✅ Message handling logic implemented
- ✅ Service selection flow ready
- ✅ Configuration in `backend/app/config.py`

### Frontend (Complete)
- ✅ WhatsApp banner added to Dashboard
- ✅ WhatsApp service card in services section
- ✅ MessageCircle icon imported

## 🔧 Configuration Required

### Step 1: Get WhatsApp Business API Credentials

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app or use existing
3. Add "WhatsApp" product
4. Get these credentials:
   - Business Account ID
   - Phone Number ID
   - API Token
   - Create a Verify Token (any secure string)

### Step 2: Update Backend Configuration

Edit `backend/.env` file:

```env
# WhatsApp Business API Configuration
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_API_TOKEN=your_api_token
WHATSAPP_VERIFY_TOKEN=my_secure_token_2024
```

### Step 3: Update Frontend WhatsApp Number

Edit `frontend/src/pages/Dashboard.jsx`:

Replace `YOUR_WHATSAPP_NUMBER` with your actual WhatsApp Business number:

```javascript
// Line ~120 and ~200
href="https://wa.me/919876543210?text=Hi%20I%20want%20to%20apply%20for%20services"
```

Example: `919876543210` (country code + number, no spaces or +)

### Step 4: Configure Webhook in Meta

1. Go to WhatsApp > Configuration in Meta Dashboard
2. Set Webhook URL: `https://your-domain.com/api/whatsapp/webhook`
3. Set Verify Token: Same as `WHATSAPP_VERIFY_TOKEN` in .env
4. Subscribe to `messages` webhook field

## 📱 Features Implemented

### User Flow
1. User clicks WhatsApp button on dashboard
2. Opens WhatsApp chat with your business number
3. Bot sends welcome message with service options
4. User selects service (Gas/Electricity/Water/Property)
5. Bot shows provider options
6. User selects provider
7. Bot asks for details (name, consumer ID, etc.)
8. User provides information
9. Bot confirms and submits application
10. User receives tracking ID

### Supported Services
- ⚡ Electricity (बिजली)
- 🔥 Gas (गैस)
- 💧 Water (पानी)
- 🏢 Property (संपत्ति)

### Message Types Supported
- Text messages
- Button replies
- Interactive messages

## 🧪 Testing

### Test Webhook Locally (using ngrok)

1. Install ngrok: `npm install -g ngrok`
2. Start backend: `cd backend && python -m uvicorn app.main:app --reload`
3. Start ngrok: `ngrok http 8000`
4. Copy ngrok URL (e.g., `https://abc123.ngrok.io`)
5. Set webhook in Meta: `https://abc123.ngrok.io/api/whatsapp/webhook`

### Test Status Endpoint

```bash
curl http://localhost:8000/api/whatsapp/status
```

Expected response:
```json
{
  "status": "active",
  "configured": true,
  "active_sessions": 0,
  "services": ["gas", "electricity", "water", "property"]
}
```

## 🎨 Dashboard UI

### WhatsApp Banner (Top)
- Green gradient banner
- WhatsApp icon
- "Start on WhatsApp" button
- Positioned above stats cards

### WhatsApp Service Card (Services Section)
- Green gradient card
- Matches other service cards design
- Shows "Apply via WhatsApp Chat"
- Clickable link to WhatsApp

## 🔒 Security Notes

1. Never commit API tokens to git
2. Use environment variables for all credentials
3. Verify webhook requests using verify token
4. Validate user input before processing
5. Rate limit webhook endpoints in production

## 📊 Session Management

Currently using in-memory storage (`user_sessions` dict).

**For Production:**
- Use Redis for session storage
- Add session timeout (e.g., 30 minutes)
- Implement session cleanup
- Add user authentication

## 🚀 Deployment

### Production Checklist
- [ ] Set all WhatsApp credentials in production .env
- [ ] Update WhatsApp number in frontend
- [ ] Configure webhook with production URL
- [ ] Enable HTTPS (required by Meta)
- [ ] Test webhook verification
- [ ] Test message flow end-to-end
- [ ] Monitor webhook logs
- [ ] Set up error alerts

## 📝 API Endpoints

### GET /api/whatsapp/webhook
- Webhook verification endpoint
- Used by Meta to verify your server

### POST /api/whatsapp/webhook
- Receives incoming messages
- Processes user interactions
- Sends automated responses

### GET /api/whatsapp/status
- Check integration status
- View active sessions count
- Verify configuration

## 🐛 Troubleshooting

### Webhook not receiving messages
1. Check webhook URL is correct
2. Verify HTTPS is enabled
3. Check verify token matches
4. Review Meta webhook logs

### Messages not sending
1. Verify API token is valid
2. Check phone number ID is correct
3. Review API rate limits
4. Check message format

### Session not working
1. Clear user_sessions dict
2. Restart backend server
3. Test with fresh conversation

## 📞 Support

For WhatsApp Business API support:
- [Meta Business Help Center](https://business.facebook.com/help)
- [WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp)

## 🎯 Next Steps

1. **Add to .env**: Configure WhatsApp credentials
2. **Update Number**: Replace YOUR_WHATSAPP_NUMBER in Dashboard.jsx
3. **Test Locally**: Use ngrok for local testing
4. **Deploy**: Push to production with HTTPS
5. **Configure Webhook**: Set up in Meta dashboard
6. **Test Live**: Send test message from WhatsApp

---

**Status**: ✅ Implementation Complete - Configuration Required
