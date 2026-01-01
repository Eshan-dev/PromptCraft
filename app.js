// Doubly Linked List Node Class for Prompt History Management
class PromptNode {
    constructor(prompt, response) {
        this.prompt = prompt;
        this.response = response;
        this.prev = null;
        this.next = null;
    }
}

// Doubly Linked List Class for Managing Prompt History
class PromptLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.current = null;
        this.size = 0;
    }

    // Add a new prompt to the end of the list
    add(prompt, response) {
        const newNode = new PromptNode(prompt, response);
        
        if (this.head === null) {
            // First node
            this.head = newNode;
            this.tail = newNode;
        } else {
            // Add to the end
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
        
        this.current = newNode;
        this.size++;
        return newNode;
    }

    // Move to previous prompt
    movePrev() {
        if (this.current && this.current.prev) {
            this.current = this.current.prev;
            return true;
        }
        return false;
    }

    // Move to next prompt
    moveNext() {
        if (this.current && this.current.next) {
            this.current = this.current.next;
            return true;
        }
        return false;
    }

    // Check if previous exists
    hasPrev() {
        return this.current && this.current.prev !== null;
    }

    // Check if next exists
    hasNext() {
        return this.current && this.current.next !== null;
    }

    // Get current prompt
    getCurrent() {
        return this.current;
    }

    // Get all nodes for history display
    getAllNodes() {
        const nodes = [];
        let node = this.head;
        while (node) {
            nodes.push(node);
            node = node.next;
        }
        return nodes;
    }

    // Get current index (0-based)
    getCurrentIndex() {
        if (!this.current) return -1;
        let index = 0;
        let node = this.head;
        while (node && node !== this.current) {
            index++;
            node = node.next;
        }
        return node === this.current ? index : -1;
    }
}

// API Key is loaded from config.js file (generated from .env)
// Make sure config.js exists - run: npm run build (or node build-config.js)
const GEMINI_API_KEY = (typeof CONFIG !== 'undefined' && CONFIG.GEMINI_API_KEY) 
    ? CONFIG.GEMINI_API_KEY 
    : null;
// Initialize the prompt history linked list
const promptList = new PromptLinkedList();
// console.log(process.env.API_KEY?.slice(-4))

// DOM Elements
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById('askButton');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const questionCounter = document.getElementById('questionCounter');
const questionDisplay = document.getElementById('questionDisplay');
const answerDisplay = document.getElementById('answerDisplay');
const answerText = document.getElementById('answerText');
const loadingIndicator = document.getElementById('loadingIndicator');
const historyList = document.getElementById('historyList');

// Send prompt to Gemini API using REST API
async function sendPrompt(prompt) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
        alert('Please set your Gemini API key. Update GEMINI_API_KEY in your .env file and run npm run build');
        return null;
    }

    try {
        loadingIndicator.style.display = 'block';
        answerText.textContent = '';
        
        // Use gemini-1.5-flash (free tier model) with v1 API
        // If this doesn't work, try: gemini-1.5-pro or gemini-1.5-flash-latest
        const model = '	gemini-2.5-flash';
        const apiVersion = 'v1beta';
        
        const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;
            
            // If gemini-1.5-flash fails, try gemini-1.5-pro as fallback
            if (errorMessage.includes('not found') || errorMessage.includes('not support')) {
                console.log('Trying fallback model: gemini-1.5-pro');
                const fallbackUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
                const fallbackResponse = await fetch(fallbackUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }]
                    })
                });
                
                if (fallbackResponse.ok) {
                    const data = await fallbackResponse.json();
                    const answer = data.candidates[0].content.parts[0].text;
                    loadingIndicator.style.display = 'none';
                    return answer;
                }
            }
            
            throw new Error(errorMessage);
        }

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        loadingIndicator.style.display = 'none';
        return aiResponse;
    } catch (error) {
        loadingIndicator.style.display = 'none';
        console.error('Error sending prompt:', error);
        return `Error: ${error.message}. Please check your API key and ensure you have access to Gemini models. Make sure "Generative Language API" is enabled in your Google Cloud project.`;
    }
}

// Update UI with current prompt
function updateDisplay() {
    const current = promptList.getCurrent();
    
    if (current) {
        questionDisplay.querySelector('.question-text').textContent = current.prompt;
        answerText.textContent = current.response;
    } else {
        questionDisplay.querySelector('.question-text').textContent = 'No prompt selected';
        answerText.innerHTML = '<p>Enter a prompt to see the AI\'s response!</p>';
    }

    // Update navigation buttons
    prevButton.disabled = !promptList.hasPrev();
    nextButton.disabled = !promptList.hasNext();

    // Update counter
    const currentIndex = promptList.getCurrentIndex();
    questionCounter.textContent = `Prompt ${currentIndex + 1} of ${promptList.size}`;

    // Update history display
    updateHistory();
}

// Update history list
function updateHistory() {
    const nodes = promptList.getAllNodes();
    const current = promptList.getCurrent();
    
    if (nodes.length === 0) {
        historyList.innerHTML = '<p class="empty-history">No prompts submitted yet</p>';
        return;
    }

    historyList.innerHTML = '';
    nodes.forEach(node => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        if (node === current) {
            historyItem.classList.add('active');
        }

        historyItem.innerHTML = `
            <p class="history-question">${node.prompt.substring(0, 50)}${node.prompt.length > 50 ? '...' : ''}</p>
            <p class="history-answer">${node.response.substring(0, 80)}${node.response.length > 80 ? '...' : ''}</p>
        `;

        historyItem.addEventListener('click', () => {
            promptList.current = node;
            updateDisplay();
        });

        historyList.appendChild(historyItem);
    });
}

// Handle generate button click
askButton.addEventListener('click', async () => {
    const prompt = questionInput.value.trim();
    
    if (!prompt) {
        alert('Please enter a prompt!');
        return;
    }

    askButton.disabled = true;
    askButton.textContent = 'Generating...';

    const response = await sendPrompt(prompt);
    
    if (response) {
        promptList.add(prompt, response);
        questionInput.value = '';
        updateDisplay();
    }

    askButton.disabled = false;
    askButton.textContent = 'Generate Response';
});

// Handle Enter key in textarea
questionInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        askButton.click();
    }
});

// Handle previous button
prevButton.addEventListener('click', () => {
    if (promptList.movePrev()) {
        updateDisplay();
    }
});

// Handle next button
nextButton.addEventListener('click', () => {
    if (promptList.moveNext()) {
        updateDisplay();
    }
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && promptList.hasPrev()) {
        promptList.movePrev();
        updateDisplay();
    } else if (e.key === 'ArrowRight' && promptList.hasNext()) {
        promptList.moveNext();
        updateDisplay();
    }
});

// Initialize on page load
window.addEventListener('load', () => {
    updateDisplay();
    
    // Check if API key is set
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
        console.warn('Warning: GEMINI_API_KEY is not set. Please update it in your .env file and run npm run build');
    }
});

