const API_KEY = 'AIzaSyB-tI5qAO-zEHDzAKH5VtuU7cpUmsr_yF0';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

document.addEventListener('DOMContentLoaded', () => {
    const chatbox = document.getElementById('chatbox');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    function appendMessage(text, isUser) {
        const alignment = isUser ? 'text-end' : 'text-start';
        const messageDiv = document.createElement('div');
        messageDiv.className = alignment;

        const messageContent = document.createElement('div');
        messageContent.className = 'message';
        messageContent.textContent = text;

        messageDiv.appendChild(messageContent);
        chatbox.appendChild(messageDiv);

        chatbox.scrollTop = chatbox.scrollHeight;
    }

    async function sendMessage() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        appendMessage(userMessage, true);
        userInput.value = '';
        userInput.disabled = true;
        sendBtn.disabled = true;

        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userMessage }] }]
                })
            });

            const data = await response.json();
            const botResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta do Gemini.';
            appendMessage(botResponse, false);
        } catch (error) {
            appendMessage('Falha ao obter uma resposta.', false);
        } finally {
            userInput.disabled = false;
            sendBtn.disabled = false;
            userInput.focus();
        }
    }

    sendBtn.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
