# ✨ PromptCraft - Prompt Engineering & Generative AI Lab

PromptCraft is an advanced web application designed for experimenting with prompt engineering techniques and exploring the capabilities of Google's Gemini Generative AI models. This platform provides an intuitive interface for crafting, testing, and refining prompts to achieve optimal AI responses.

## Features

- ✅ **Gemini API Integration**: Direct integration with Google's Gemini 2.5 Flash model for real-time AI responses
- ✅ **Prompt History Management**: Intelligent history tracking using a doubly linked list data structure
- ✅ **Navigation Controls**: Seamlessly navigate through your prompt history with Previous/Next buttons or keyboard shortcuts
- ✅ **Interactive History Panel**: View and jump to any previous prompt-response pair
- ✅ **Modern UI**: Sleek, futuristic dark theme with cyan accents and smooth animations
- ✅ **Real-time Generation**: Get instant AI responses to your prompts

## What is Prompt Engineering?

Prompt engineering is the practice of designing and refining input prompts to effectively communicate with AI models and achieve desired outputs. This platform allows you to:

- Experiment with different prompt structures and techniques
- Compare responses from various prompt formulations
- Learn how subtle changes in prompts affect AI behavior
- Build a library of effective prompts for different use cases

## How It Works

### Prompt History Management
The application uses a **Doubly Linked List** data structure to manage your prompt history, allowing efficient navigation between prompts:

- Each node contains:
  - `prompt`: Your input prompt
  - `response`: The AI-generated response
  - `prev`: Pointer to the previous prompt
  - `next`: Pointer to the next prompt

### Navigation
- **Previous Button (←)**: Navigate to the previous prompt in your history
- **Next Button (→)**: Navigate to the next prompt in your history
- **Arrow Keys**: Use left/right arrow keys for keyboard navigation
- **History Panel**: Click on any prompt in the history panel to jump directly to it

## Setup Instructions

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 2. Configure the Application

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Create `.env` file**:
   - Create a new `.env` file in the project root

3. **Add your API key to `.env`**:
   ```env
   GEMINI_API_KEY=your-actual-api-key-here
   ```

4. **Generate config.js from .env**:
   ```bash
   npm run build
   ```
   
   Or:
   ```bash
   node build-config.js
   ```

**Important Notes:**
- The `.env` file is gitignored and will **NOT** be committed to GitHub
- The `config.js` file is auto-generated - don't edit it manually
- After changing `.env`, always run `npm run build` to regenerate `config.js`

### 3. Run the Application

1. Simply open `index.html` in a modern web browser (Chrome, Firefox, Edge, etc.)
2. The application is ready to use!

### 4. Usage

1. Enter your prompt in the text area
2. Click "Generate Response" or press `Ctrl + Enter`
3. Wait for the AI to generate a response
4. Use the Previous/Next buttons or arrow keys to navigate between prompts
5. Click on any prompt in the history panel to jump to it

## Prompt Engineering Tips

- **Be Specific**: Clear, specific prompts yield better results
- **Use Context**: Provide relevant context to guide the AI
- **Iterate**: Experiment with different phrasings and structures
- **Chain Prompts**: Build on previous responses for complex tasks
- **Compare Results**: Use the history feature to compare different approaches

## File Structure

```
.
├── index.html      # Main HTML file with UI structure
├── styles.css      # CSS styling for the application
├── app.js          # JavaScript with prompt management and API integration
├── build-config.js # Script to generate config.js from .env
├── package.json    # Project dependencies and scripts
└── README.md      # This file
```

## Technical Details

### Doubly Linked List Implementation

The `PromptLinkedList` class provides:
- `add(prompt, response)`: Adds a new prompt-response pair to the list
- `movePrev()`: Moves to the previous node
- `moveNext()`: Moves to the next node
- `hasPrev()`: Checks if previous node exists
- `hasNext()`: Checks if next node exists
- `getCurrent()`: Returns the current node
- `getAllNodes()`: Returns all nodes for history display

### API Integration

The application uses Google's Gemini API (v1beta) with the `gemini-2.5-flash` model. The API key is securely loaded from environment variables via the build configuration system.

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Edge
- Safari

## Notes

- The API key is stored in `.env` file (gitignored for security - **won't be pushed to GitHub**)
- The `config.js` file is auto-generated from `.env` using the build script
- Prompts and responses are maintained in memory (lost on page refresh)
- The application requires an active internet connection to use the Gemini API
- **Important**: 
  - Create `.env` file with your API key
  - Run `npm run build` after setting up `.env`
  - Never commit `.env` or `config.js` to version control

## Deployment to Vercel

This project is ready to deploy to Vercel. See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

**Quick steps:**
1. Push your code to GitHub (make sure `.env` is gitignored)
2. Import project to Vercel
3. Set `GEMINI_API_KEY` environment variable in Vercel dashboard
4. Deploy!

The build process will automatically generate `config.js` from environment variables during deployment.

## Future Enhancements

- Save prompts to local storage for persistence
- Export/import prompt history
- Search functionality across prompts
- Delete prompts from history
- Edit and re-submit prompts
- Prompt templates library
- Response comparison tools
- Prompt performance metrics

## License

This project is created for educational purposes as a Prompt Engineering and Generative AI project.
