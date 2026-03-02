const webhookData = $input.all()[0].json;

// Los datos están en webhookData.body.data
const bodyData = webhookData.body && webhookData.body.data 
  ? webhookData.body.data 
  : null;

if (!bodyData) {
  return [{ json: { skip: true } }];
}

// Ignorar mensajes enviados por el bot
if (bodyData.fromMe === true) {
  return [{ json: { skip: true } }];
}

const phone = String(bodyData.from || '')
  .replace('@c.us', '')
  .replace('@g.us', '')
  .replace('+', '')
  .trim();

if (!phone || phone.length < 7) {
  return [{ json: { skip: true } }];
}

let message = String(bodyData.body || bodyData.caption || '');
const messageType = String(bodyData.type || 'text');

if (messageType === 'image' || messageType === 'photo') {
  message = '__IMAGEN__';
}

const messageLower = message.toLowerCase().trim();

return [{ json: { 
  skip: false,
  phone, 
  message, 
  messageLower, 
  messageType 
} }];
