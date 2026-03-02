// ════════════════════════════════════════════════════════
// BOT LOGIC COMPLETO - RESTAURANTE MARISQUERÍA PORTÓN AZUL
// ════════════════════════════════════════════════════════

const messageData = $('Extraer Mensaje').first().json;

let state = 'new';
let currentOrder = '';
let currentAddress = '';

try {
  const sheetsItems = $('Buscar Cliente').all();
  if (sheetsItems && sheetsItems.length > 0) {
    const row = sheetsItems[0].json;
    if (row && row.phone && String(row.phone).trim() !== '') {
      state = String(row.state || 'new').trim();
      currentOrder = String(row.order || '').trim();
      currentAddress = String(row.address || '').trim();
    }
  }
} catch(e) {
  state = 'new';
}

// ══════════════════════════════════════
// CARTA DEL RESTAURANTE
// ══════════════════════════════════════
const MENU = {
  'torta de choclo con ceviche': 20,
  'torta de choclo sola': 3,
  'tallarin saltado de carne': 25,
  'tallarín saltado de carne': 25,
  'lomo saltado': 30,
  'milanesa de pollo': 25,
  'chicharron de pollo': 25,
  'chicharrón de pollo': 25,
  'bisteck a lo pobre': 30,
  'pescado frito': 30,
  'batea en sarza': 30,
  'chilcano': 30,
  'chupe de cangrejo': 30,
  'chupe de pescado': 30,
  'chupe de langostino': 30,
  'pescados en salsa de mariscos': 30,
  'carne seca': 30,
  'pellejito en zarza': 25,
  'ceviche de tollo': 30,
  'ceviche mixto': 35,
  'ceviche de conchas negras': 30,
  'sol y sombra': 35,
  'ceviche de caballa': 25,
  'leche de tigre': 20,
  'leche de pantera': 25,
  'sudado de cabrilla': 50,
  'sudado de congrio': 60,
  'sudado de chula': 60,
  'sudado de robalo': 60,
  'sudado de mero': 60,
  'parihuela': 60,
  'arroz con mariscos': 35,
  'arroz con conchas negras': 35,
  'chaufa de mariscos': 35,
  'tortilla de raya': 30,
  'tortilla de langostino': 30,
  'tortilla de langoraya': 35,
  'chicharron de pescado': 35,
  'chicharrón de pescado': 35,
  'chicharron de langostino': 35,
  'chicharrón de langostino': 35,
  'chicharron de calamar': 35,
  'chicharrón de calamar': 35,
  'chicharron de pota': 30,
  'chicharrón de pota': 30,
  'chicharron mixto': 40,
  'chicharrón mixto': 40,
  'inca kola': 8,
  'coca cola': 8,
  'guarana': 2,
  'agua mineral': 3,
  'pilsen': 9,
  'cristal': 9,
  'corona': 6,
  'cusqueña trigo': 10,
  'cusqueña negra': 10,
  'refresco de lima': 15,
  'refresco de maracuya': 15,
  'refresco de piña': 15,
  'limonada frozen': 17,
  'maracuya frozen': 17,
  'piña frozen': 17,
  'lima frozen': 17,
  'porcion de arroz': 6,
  'yuca frita': 7,
  'chifles': 2.5,
  'mote frito': 7,
  'porcion de cancha': 5,
  'chileno guisado': 7
};

const CARTA = `🦐 *CARTA - RESTAURANTE MARISQUERÍA EL PORTÓN AZUL* 🐟

📌 *ENTRADAS*
• Torta de Choclo con Ceviche S/20.00
• Torta de Choclo Sola S/3.00

🍽️ *PLATOS A LA CARTA*
• Tallarín Saltado de Carne S/25.00
• Lomo Saltado S/30.00
• Milanesa de Pollo S/25.00
• Chicharrón de Pollo S/25.00
• Bisteck a lo Pobre S/30.00
• Pescado Frito S/30.00

⭐ *ESPECIALIDADES DE LA CASA*
• Batea en Sarza S/30.00
• Chilcano S/30.00
• Chupe de Cangrejo S/30.00
• Chupe de Pescado S/30.00
• Chupe de Langostino S/30.00
• Carne Seca S/30.00
• Pellejito en Zarza S/25.00

🍋 *CEVICHES*
• Ceviche de Tollo S/30.00
• Ceviche Mixto S/35.00
• Ceviche de Conchas Negras S/30.00
• Sol y Sombra S/35.00
• Ceviche de Caballa S/25.00
• Leche de Tigre S/20.00
• Leche de Pantera S/25.00

🐟 *SUDADOS Y PARIHUELAS*
• Sudado de Cabrilla S/50.00
• Sudado de Congrio S/60.00
• Sudado de Mero S/60.00
• Parihuela S/60.00

🍚 *ARROCES*
• Arroz con Mariscos S/35.00
• Chaufa de Mariscos S/35.00

🦑 *CHICHARRONES*
• Chicharrón de Pescado S/35.00
• Chicharrón de Langostino S/35.00
• Chicharrón de Calamar S/35.00
• Chicharrón Mixto S/40.00

🥤 *BEBIDAS*
• Inca Kola / Coca Cola S/8.00
• Pilsen / Cristal S/9.00
• Corona S/6.00
• Cusqueña Trigo/Negra S/10.00
• Refrescos S/15.00
• Frozen S/17.00
• Agua Mineral S/3.00

📅 *ESPECIALES:*
🔸 Sábado: Cabrito S/25.00
🔸 Domingo: Arroz con Pato S/30.00
🔸 Lunes: Espesado S/15.00`;

const PAGOS = `💳 *MÉTODOS DE PAGO:*
━━━━━━━━━━━━━━━━
📱 *Yape:* 999999999
📱 *Plin:* 999999999
🏦 *BCP:* 100-12345678-0-00
  A nombre de: El Portón Azul

_Realiza el pago y envía la captura de pantalla del comprobante._`;

// ══════════════════════════════════════
// FUNCIÓN: Parsear pedido del cliente
// ══════════════════════════════════════
function parsearPedido(txt) {
  const msgLower = txt.toLowerCase();
  let items = [];
  for (const [nombre, precio] of Object.entries(MENU)) {
    if (msgLower.includes(nombre)) {
      const qtyMatch = msgLower.match(new RegExp('(\\d+)\\s+' + nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      const qty = qtyMatch ? parseInt(qtyMatch[1]) : 1;
      // Evitar duplicados
      const yaExiste = items.find(i => i.nombre === nombre.toUpperCase());
      if (!yaExiste) {
        items.push({ nombre: nombre.toUpperCase(), qty, precioUnit: precio, subtotal: precio * qty });
      }
    }
  }
  return items;
}

// ══════════════════════════════════════
// FUNCIÓN: Formatear pedido para Sheets
// ══════════════════════════════════════
function formatearPedidoParaSheets(items) {
  let texto = '';
  for (const item of items) {
    texto += `${item.qty}x ${item.nombre} (S/${item.subtotal.toFixed(2)}) | `;
  }
  return texto.slice(0, -3); // quitar último " | "
}

// ══════════════════════════════════════
// LÓGICA PRINCIPAL
// ══════════════════════════════════════
const { phone, message, messageLower } = messageData;

let responseMessage = '';
let newState = state;
let newOrder = currentOrder;
let newTotal = 0;
let newAddress = currentAddress;
let orderNum = '';
let pedidoTexto = '';
let isPedidoConfirmado = false;

// ─── NUEVO CLIENTE ───────────────────
if (state === 'new') {
  responseMessage = `🦐 *¡Bienvenido al Restaurante Marisquería El Portón Azul!* 🐟

_"El que sabe comer... Sabe esperar"_

¡Hola! Somos expertos en la mejor comida marinera del norte.
📍 Ca. San Mateo 427, Nvo. San Lorenzo J.L.O
📞 960336267

Aquí nuestra carta 👇

${CARTA}

_¿Qué deseas ordenar hoy? Escríbenos tu pedido 😊_`;
  newState = 'waiting_order';

// ─── ESPERANDO PEDIDO ────────────────
} else if (state === 'waiting_order') {
  const items = parsearPedido(message);

  if (items.length === 0) {
    responseMessage = `No pude reconocer tu pedido 😅

Por favor escríbelo así:
_"1 ceviche mixto, 1 lomo saltado"_

O dinos exactamente qué plato deseas de la carta 📋`;
    newState = 'waiting_order';
  } else {
    let resumen = '';
    let total = 0;
    for (const item of items) {
      resumen += `• ${item.qty}x ${item.nombre} — S/${item.subtotal.toFixed(2)}\n`;
      total += item.subtotal;
    }
    newOrder = JSON.stringify(items);
    newTotal = total;
    responseMessage = `¡Excelente elección! 👌

Tu pedido:
${resumen}
🥤 *¿Deseas agregar algo más?*
Bebidas, gaseosas, cervezas, guarniciones...

_(Escribe lo que deseas o responde "No, eso es todo")_`;
    newState = 'waiting_extras';
  }

// ─── ESPERANDO EXTRAS ────────────────
} else if (state === 'waiting_extras') {
  let items = [];
  try { items = JSON.parse(currentOrder); } catch(e) {}

  const noExtras = ['no', 'nada', 'ya esta', 'ya está', 'solo eso', 'eso es todo', 'no gracias', 'no quiero', 'sin nada'].some(w => messageLower.includes(w));

  if (!noExtras) {
    const extras = parsearPedido(message);
    if (extras.length > 0) {
      items = [...items, ...extras];
    }
  }

  newOrder = JSON.stringify(items);
  let resumen = '';
  let total = 0;
  for (const item of items) {
    resumen += `• ${item.qty}x ${item.nombre} — S/${item.subtotal.toFixed(2)}\n`;
    total += item.subtotal;
  }
  newTotal = total;

  responseMessage = `✅ *RESUMEN DE TU PEDIDO:*
━━━━━━━━━━━━━━━━
${resumen}━━━━━━━━━━━━━━━━
💰 *TOTAL: S/${total.toFixed(2)}*

${PAGOS}

📍 *¿Cuál es tu dirección de delivery?*
_(Ej: Av. Los Pinos 123, Chiclayo)_`;
  newState = 'waiting_address';

// ─── ESPERANDO DIRECCIÓN ─────────────
} else if (state === 'waiting_address') {
  newAddress = message;
  responseMessage = `📍 *Dirección registrada:*
${message}

✅ Ahora envíanos la *captura de pantalla del comprobante de pago* para confirmar tu orden 📸

_Puedes enviarla directamente aquí por WhatsApp._`;
  newState = 'waiting_payment';

// ─── ESPERANDO COMPROBANTE DE PAGO ───
} else if (state === 'waiting_payment') {
  const esPago = message === '__IMAGEN__' ||
    messageLower.includes('ya pague') ||
    messageLower.includes('ya pagué') ||
    messageLower.includes('listo') ||
    messageLower.includes('ya pago') ||
    messageLower.includes('transferi') ||
    messageLower.includes('yapé') ||
    messageLower.includes('yape');

  if (esPago) {
    // Generar número de orden único
    orderNum = String(Math.floor(Math.random() * 9000) + 1000);

    // Formatear pedido para registrar en Sheets
    let items = [];
    try { items = JSON.parse(currentOrder); } catch(e) {}
    pedidoTexto = formatearPedidoParaSheets(items);

    // Calcular total final
    let totalFinal = 0;
    for (const item of items) { totalFinal += item.subtotal; }
    newTotal = totalFinal;

    // La dirección final
    const direccionFinal = newAddress || currentAddress;

    responseMessage = `🎉 *¡Tu orden ha sido confirmada!*

📦 *N° de Orden: #${orderNum}*
🏠 *Delivery a:* ${direccionFinal}

⏱️ Estamos preparando tu pedido con todo el cariño 🦐
¡Pronto estará en camino a tu dirección!

¡Gracias por elegir El Portón Azul! 💙
_"El que sabe comer... sabe esperar"_ 🐟`;

    newState = 'completed';
    newAddress = direccionFinal;
    isPedidoConfirmado = true; // ← activa el registro en Sheets "Pedidos"

  } else {
    responseMessage = `📸 Necesitamos la *captura de pantalla* del comprobante para confirmar tu pedido.

Envíala directamente aquí por WhatsApp 😊`;
    newState = 'waiting_payment';
  }

// ─── PEDIDO COMPLETADO / NUEVO PEDIDO ─
} else if (state === 'completed') {
  responseMessage = `¡Hola de nuevo! 😊 Bienvenido otra vez a El Portón Azul 🦐

¿Deseas hacer un nuevo pedido?

${CARTA}

_Escríbenos qué deseas 😊_`;
  newState = 'waiting_order';
  newOrder = '';
  newAddress = '';
}

// ══════════════════════════════════════
// RETURN FINAL — incluye todos los campos
// ══════════════════════════════════════
return [{
  json: {
    phone,
    message,
    state,
    newState,
    newOrder,
    newTotal,
    newAddress,
    responseMessage,
    orderNum,            // número de orden (solo cuando isPedidoConfirmado = true)
    pedidoTexto,         // detalle del pedido formateado para Sheets
    isPedidoConfirmado   // true solo cuando el cliente envía el comprobante
  }
}];
