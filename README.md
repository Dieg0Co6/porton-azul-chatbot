# 🦐 Chatbot WhatsApp - Restaurante Marisquería El Portón Azul

<div align="center">

![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-EA4B71?style=for-the-badge&logo=n8n&logoColor=white)
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-34A853?style=for-the-badge&logo=google-sheets&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**Automatización completa de pedidos por WhatsApp para restaurantes**

</div>

---

## 📋 Descripción

Sistema de chatbot automatizado para WhatsApp que permite a los clientes del **Restaurante Marisquería El Portón Azul** realizar pedidos completos sin intervención humana. El bot guía al cliente desde la bienvenida hasta la confirmación del pago, y registra automáticamente cada pedido confirmado en Google Sheets.

---

## ✨ Funcionalidades

- 🤖 **Bienvenida automática** con carta completa del restaurante
- 🍽️ **Toma de pedidos inteligente** — reconoce platos por texto
- ➕ **Gestión de extras** — pregunta si desea agregar bebidas o guarniciones
- 💰 **Cálculo automático** del total del pedido
- 💳 **Envío de métodos de pago** — Yape, Plin, BCP
- 📍 **Registro de dirección** para delivery
- 📸 **Confirmación por comprobante** — acepta imagen o texto
- ✅ **Confirmación de orden** con número único de pedido
- 📊 **Registro automático** en Google Sheets al confirmar pago
- 🔄 **Memoria de conversación** — recuerda el estado de cada cliente

---

## 🛠️ Stack Tecnológico

| Herramienta | Uso | Costo |
|---|---|---|
| **n8n** | Motor de automatización y flujos | Gratis / $20 mes (cloud) |
| **UltraMsg** | API de WhatsApp | Gratis (3días) / ~$15/mes |
| **Google Sheets** | Base de datos de pedidos y estados | Gratis |

---

## 🗂️ Estructura del Proyecto

```
porton-azul-chatbot/
│
├── workflow/
│   └── porton_azul_workflow.json   # Workflow completo de n8n (importar)
│
├── src/
│   ├── bot_logic.js                # Lógica principal del bot
│   └── extraer_mensaje.js          # Extracción de datos del webhook
│
├── sheets/
│   └── estructura_sheets.xlsx        # Estructura de las hojas de Google Sheets
│
└── README.md
```

---

## 🚀 Flujo del Bot

```
📱 Cliente escribe por WhatsApp
         │
         ▼
🔌 Webhook (n8n recibe el mensaje)
         │
         ▼
⚙️  Extraer Mensaje (limpia y valida datos)
         │
         ▼
🔀 IF: ¿Es mensaje válido del cliente?
    │
    ├── ❌ NO → Ignorar (era el bot respondiendo)
    │
    └── ✅ SÍ
         │
         ▼
📊 Buscar Cliente (Google Sheets - Hoja "Estado")
         │
         ▼
🧠 Bot Logic (decide qué responder según el estado)
         │
    ┌────┴────┐
    │         │
    ▼         ▼
📤 Enviar   🔀 IF: ¿Pedido confirmado?
 WhatsApp       │
    │       ┌──┴──┐
    ▼       │     │
💾 Guardar  ✅   ❌
  Estado    │
(Hoja      ▼
 Estado)  📊 Registrar Pedido
          (Hoja "Pedidos")
```

---

## 💬 Flujo de Conversación

| Mensaje del Cliente | Respuesta del Bot | Estado |
|---|---|---|
| "Hola" / cualquier mensaje | Bienvenida + carta completa | `waiting_order` |
| "1 ceviche mixto, 1 lomo saltado" | Resumen + ¿deseas agregar algo? | `waiting_extras` |
| "2 inca kola" / "no gracias" | Total + métodos de pago + pide dirección | `waiting_address` |
| "Av. Los Pinos 123, Chiclayo" | Confirmación + pide comprobante | `waiting_payment` |
| [foto del pago] / "ya pagué" | ¡Orden confirmada! + N° de orden | `completed` |

---

## 📊 Estructura Google Sheets

### Hoja "Estado" — Memoria del bot
```
phone | state | order | total | address | order_number | timestamp
```

### Hoja "Pedidos" — Registro de pedidos confirmados
```
fecha | hora | numero_orden | telefono | pedido_detalle | total | direccion | estado_pago
```

---

## ⚙️ Instalación y Configuración

### Requisitos previos
- Cuenta en [n8n.io](https://n8n.io) (cloud o self-hosted)
- Cuenta en [UltraMsg](https://ultramsg.com) con WhatsApp conectado
- Cuenta de Google con Google Sheets habilitado

---

### Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/porton-azul-chatbot.git
cd porton-azul-chatbot
```

---

### Paso 2 — Configurar Google Sheets

1. Crea un nuevo Google Sheet llamado **"Porton Azul Bot"**
2. Crea 2 hojas: **"Estado"** y **"Pedidos"**
3. En **"Estado"**, fila 1:
   ```
   phone | state | order | total | address | order_number | timestamp
   ```
4. En **"Pedidos"**, fila 1:
   ```
   fecha | hora | numero_orden | telefono | pedido_detalle | total | direccion | estado_pago
   ```
5. Copia el **ID del Sheet** desde la URL

---

### Paso 3 — Configurar UltraMsg

1. Crea una instancia en UltraMsg
2. Escanea el QR con tu WhatsApp
3. En **Settings → Webhook**:
   - Activa solo **"Webhook on Received"**
   - Deja los demás desactivados
4. Guarda tu **Instance ID** y **Token**

---

### Paso 4 — Importar Workflow en n8n

1. Ve a **n8n → Workflows → Import from file**
2. Selecciona `workflow/porton_azul_workflow.json`
3. Reemplaza las variables en los nodos:

```
TU_ULTRAMSG_INSTANCE  →  tu instance ID
TU_ULTRAMSG_TOKEN     →  tu token de UltraMsg
TU_SPREADSHEET_ID     →  ID de tu Google Sheet
TU_CREDENTIAL_ID      →  ID de tus credenciales de Google en n8n
```

---

### Paso 5 — Configurar credenciales de Google en n8n

1. **Settings → Credentials → Add Credential → Google Sheets OAuth2**
2. Autoriza con tu cuenta de Google
3. Copia el ID de la credencial y reemplaza `TU_CREDENTIAL_ID` en los nodos de Sheets

---

### Paso 6 — Activar el Webhook

1. Abre el nodo **Webhook** en n8n
2. Copia la **Production URL**:
   ```
   https://tu-dominio.app.n8n.cloud/webhook/whatsapp-webhook
   ```
3. Pégala en **UltraMsg → Settings → Webhook URL**
4. Guarda los cambios

---

### Paso 7 — Publicar y probar

1. Clic en **"Publish"** en n8n
2. Desde otro celular, envía **"Hola"** al número del restaurante
3. El bot responderá automáticamente con la bienvenida y la carta

---

## 🔧 Personalización

### Cambiar la carta del restaurante

En el nodo **Bot Logic**, busca el objeto `MENU` y actualiza los platos y precios:

```javascript
const MENU = {
  'nombre del plato': precio,  // precio en soles
  'ceviche mixto': 35,
  // ... agregar o modificar platos
};
```

### Cambiar datos de pago

En el nodo **Bot Logic**, busca la constante `PAGOS`:

```javascript
const PAGOS = `💳 *MÉTODOS DE PAGO:*
📱 *Yape:* TU_NUMERO
📱 *Plin:* TU_NUMERO
🏦 *BCP:* TU_NUMERO_CUENTA`;
```

## 🗃️ Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `ULTRAMSG_INSTANCE` | ID de instancia UltraMsg | `infjjfjed458945` |
| `ULTRAMSG_TOKEN` | Token de autenticación UltraMsg | `z45767856568b6` |
| `SPREADSHEET_ID` | ID del Google Sheet | `1g4nmj21wwp...` |
| `GOOGLE_CREDENTIAL_ID` | ID credencial Google en n8n | `b345345...` |

---

## 📌 Notas importantes

- ⚠️ El bot funciona **24/7** mientras el workflow esté publicado en n8n
- ⚠️ UltraMsg puede desconectarse si el celular no se usa más de 14 días — reconecta escaneando el QR nuevamente
- ⚠️ El plan gratuito de n8n tiene **1000 ejecuciones/mes** — considera el plan de pago para uso intensivo
- ✅ Cada mensaje del cliente cuenta como 1 ejecución

---

## 📈 Roadmap / Mejoras futuras

- [ ] Notificación al número de cocina cuando llega un pedido
- [ ] Generación e impresión automática de ticket
- [ ] Panel de administración para ver pedidos del día
- [ ] Integración con sistema de delivery
- [ ] Soporte para pedidos de grupos de WhatsApp
- [ ] Horario de atención (bot inactivo fuera de horario)
- [ ] Estadísticas de ventas diarias/mensuales

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agrega nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📄 Licencia

MIT License — puedes usar, modificar y distribuir este proyecto libremente.

---

<div align="center">

Hecho con ❤️ para El Portón Azul

⭐ Si este proyecto te fue útil, dale una estrella al repositorio

</div>
