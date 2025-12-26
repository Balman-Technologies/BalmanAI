const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const newChatBtn = document.querySelector(".new-chat-btn");

function addUserMessage(text) {
  const div = document.createElement("div");
  div.classList.add("user-message");
  div.innerHTML = `<div class="msg">${text}</div>`;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addDogMessage(text) {
  const div = document.createElement("div");
  div.classList.add("dog-message");
  div.innerHTML = `<div class="msg">${text}</div>`;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// --- Nouvelle version : appelle le backend sécurisé ---
async function askDogGPT(prompt) {
  addDogMessage("BalmanAI est en train d'écrire…");

  try {
    // Ici, on envoie le prompt à notre backend
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "Tu es BalmanAI, une IA sérieuse pour aider et discuter, un peu comme ChatGPT. Version BalmanAI i2 Platinum Edition [BETA]." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "Je n'ai pas bien compris ton message, peux-tu reformuler ?";

    // Supprimer le message temporaire "en train d'écrire"
    const thinking = document.querySelector(".dog-message:last-child");
    if (thinking) thinking.remove();

    addDogMessage(reply);

  } catch (err) {
    console.error(err);
    addDogMessage("Oups… Une erreur est survenue pendant la réflexion !");
  }
}

sendBtn.onclick = () => {
  const text = userInput.value.trim();
  if (text === "") return;

  addUserMessage(text);
  userInput.value = "";

  askDogGPT(text);
};

// Enter pour envoyer
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

// Nouveau chat
newChatBtn.onclick = () => {
  chatWindow.innerHTML = "";
  addDogMessage("Vous avez créé un nouveau chat ! Comment puis-je t'aider ?");
};
