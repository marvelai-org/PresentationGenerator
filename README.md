# Presentation Generator

A comprehensive application for generating presentations with AI capabilities.

## Project Structure

The project is organized into two main components:

- **platform**: Next.js application that serves as the user interface
- **ai-backend**: Python-based AI service for generating presentation content

## Getting Started

### Running the Platform (Next.js)

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

The platform will be available at [http://localhost:3000](http://localhost:3000).

### Running the AI Backend

```bash
# Navigate to the AI backend directory
cd ai-backend

# Set up Python environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -e .

# Run the server
python app.py
```

The AI backend will be available at [http://localhost:8000](http://localhost:8000).

## More Information

- See [platform/README.md](platform/README.md) for details about the Next.js application
- See [ai-backend/README.md](ai-backend/README.md) for details about the AI service

## License

MIT
