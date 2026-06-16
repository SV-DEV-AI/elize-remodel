document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');
    const clearBtn = document.getElementById('clearBtn');

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Basic Markdown parser for Bold and Code blocks
    const parseMarkdown = (text) => {
        let html = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/\n/g, '<br>');
        return html;
    };

    // Add a message to the chat
    const addMessage = (text, isUser = false) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isUser ? 'user-message' : 'ai-message'} fade-in`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = isUser ? text : parseMarkdown(text);
        
        msgDiv.appendChild(contentDiv);
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    };

    // Add typing indicator
    const showTypingIndicator = () => {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator fade-in';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatMessages.appendChild(indicator);
        scrollToBottom();
    };

    const removeTypingIndicator = () => {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    };

    // Handle form submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const text = userInput.value.trim();
        if (!text) return;

        // Display user message
        addMessage(text, true);
        userInput.value = '';
        
        // Display typing indicator
        showTypingIndicator();

        try {
            // Call the Python FastAPI Backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            removeTypingIndicator();

            if (response.ok) {
                addMessage(data.reply, false);
            } else {
                addMessage(`⚠️ Error: ${data.detail || 'Failed to get response'}`, false);
            }

        } catch (error) {
            console.error('Error fetching chat:', error);
            removeTypingIndicator();
            addMessage('⚠️ Network error. Make sure the backend is running.', false);
        }
    });

    // Clear chat
    clearBtn.addEventListener('click', () => {
        chatMessages.innerHTML = `
            <div class="message ai-message fade-in">
                <div class="message-content">
                    Chat cleared. How can I help you with Python now?
                </div>
            </div>
        `;
    });
});
