import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 4000;
const MANYCHAT_TOKEN = "TU_TOKEN_MANYCHAT";

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/manychat/buscar", async (req, res) => {
  const { matricula } = req.query;
  try {
    const response = await fetch(
      `https://api.manychat.com/fb/subscriber/findByCustomField?custom_field_name=matricula&custom_field_value=${matricula}`,
      {
        headers: { Authorization: `Bearer ${MANYCHAT_TOKEN}` },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al buscar usuario en ManyChat");
  }
});

app.post("/manychat/etiquetar", async (req, res) => {
  const { subscriber_id, tag_name } = req.body;
  try {
    const response = await fetch(
      "https://api.manychat.com/fb/subscriber/sendTag",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${MANYCHAT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscriber_id, tag_name }),
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al etiquetar usuario");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
