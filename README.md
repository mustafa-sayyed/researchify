# Researchify

Researchify is a CLI multi-agent research assistant built with LangChain and LangGraph. Give it a topic, and it searches the web, summarizes findings, and generates a final report with citations.

## Features

- Multi-agent research workflow
- Web search powered by Tavily
- Summary and citation generation with LLM agents
- Interactive credential setup for first-time use
- Persistent credential storage in `.researchify/researchify.json`

## Installation

Install globally from npm:

```bash
npm install -g researchify
```

## Configuration

Provide the required API keys through environment variables, or let the CLI prompt you on first run and save them locally.

```env
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
```

If credentials are not already available, the CLI will ask for them on first run and validate them before saving.

The values are stored locally in:

```text
.researchify/researchify.json
```

## Usage

After installation, run:

```bash
researchify
```

The CLI will prompt you for a research topic, then generate a research report.

## License

MIT