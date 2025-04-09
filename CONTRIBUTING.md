# Contributing to AI Presentation Generator

First off, thank you for considering contributing to AI Presentation Generator! 🎉 We're excited to have you join our community.

This document will help guide you through the contribution process, especially if you're new to open source. Don't worry if this is your first time contributing - we've designed this guide to be beginner-friendly.

## 📋 Table of Contents:

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
- [Your First Contribution](#-your-first-contribution)
- [Setting Up Your Development Environment](#-setting-up-your-development-environment)
- [Making Changes](#-making-changes)
- [Pull Requests](#-pull-requests)
- [Coding Conventions](#-coding-conventions)
- [Git Workflow](#-git-workflow)
- [Communication](#-communication)

## 📜 Code of Conduct:

By participating in this project, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Please make sure to read it to understand what behavior is expected in our community.

## 🚀 How Can I Contribute?:

There are many ways you can contribute to AI Presentation Generator:

- **Reporting Bugs**: If you find a bug, let us know by [creating an issue](../../issues/new?template=bug_report.md)
- **Suggesting Features**: Have an idea to make the project better? [Submit a feature request](../../issues/new?template=feature_request.md)
- **Documentation**: Help improve or translate our documentation
- **Code Contributions**: Fix bugs or add new features
- **Reviewing Pull Requests**: Help review changes submitted by others
- **Answering Questions**: Help answer questions in the issues section

Every contribution, big or small, is valuable and appreciated!

## 🌱 Your First Contribution:

New to open source? Don't worry! Here's how to make your first contribution:

1. **Find an Issue**: Look for issues labeled `good first issue` or `beginner friendly`
2. **Ask Questions**: If you're uncertain about anything, ask! We're here to help
3. **Start Small**: Begin with small changes to get familiar with the process

Not sure where to start? Here are some options:

- Fix typos in documentation
- Add comments to unclear code
- Write tests for existing features
- Fix a simple bug

## 💻 Setting Up Your Development Environment:

Let's get your development environment ready:

### Prerequisites:

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (v8 or later)
- [Git](https://git-scm.com/)
- [Python](https://www.python.org/) (v3.9 or later, for AI service)
- Text editor (we recommend [VS Code](https://code.visualstudio.com/))

### Step-by-Step Setup:

1. **Fork the Repository**

   Click the "Fork" button at the top right of the [repository page](https://github.com/marvelai-org/PresentationGenerator).

   ![Fork button example](https://docs.github.com/assets/images/help/repository/fork_button.jpg)

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/YOUR-USERNAME/PresentationGenerator.git
   cd PresentationGenerator
   ```

3. **Add the Original Repository as a Remote**

   ```bash
   git remote add upstream https://github.com/marvelai-org/PresentationGenerator.git
   ```

4. **Install Dependencies**

   ```bash
   npm ci
   ```

5. **Set Up Environment Variables**

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your own values (see the README for more details).

6. **Run the Development Server**

   ```bash
   npm run dev
   ```

   The application should now be running at [http://localhost:3000](http://localhost:3000).

7. **Set up the AI Service** (if working on AI features)

   ```bash
   cd ai-services
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```

   The AI service should now be running at [http://localhost:8000](http://localhost:8000).

## 🔄 Making Changes:

Here's how to make changes to the codebase:

1. **Create a Branch**

   ```bash
   git checkout -b your-branch-name
   ```

   Use a descriptive branch name following our conventions (see [Git Workflow](#-git-workflow)).

2. **Make Your Changes**

   Edit the code using your text editor.

3. **Test Your Changes**

   ```bash
   npm test
   ```

   Also ensure the application still works as expected by running it locally.

4. **Format Your Code**

   ```bash
   npm run format
   ```

5. **Run Linting**

   ```bash
   npm run lint
   ```

   Fix any linting errors that appear.

6. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "Your descriptive commit message"
   ```

   Follow our commit message guidelines (see [Git Workflow](#-git-workflow)).

## 📤 Pull Requests:

Ready to submit your changes? Here's how:

1. **Push Your Branch**

   ```bash
   git push origin your-branch-name
   ```

2. **Create a Pull Request**

   Go to your fork on GitHub and click "Compare & pull request" next to your branch.

   ![Compare & pull request button](https://docs.github.com/assets/images/help/pull_requests/pull-request-start-review-button.png)

3. **Fill Out the Pull Request Template**

   Provide a clear description of what your changes do and why they should be included.

4. **Submit the Pull Request**

   Click "Create pull request".

5. **Respond to Feedback**

   Project maintainers may suggest changes. Be responsive and address any feedback.

6. **Wait for Review**

   Your PR will be reviewed by at least one maintainer or code owner. Changes may be requested before merging.

## 📝 Coding Conventions:

We follow specific coding conventions to keep our codebase consistent:

### General Guidelines:

- Use meaningful variable and function names
- Write comments for complex logic
- Keep functions small and focused
- Follow the principle of "one function, one responsibility"
- Write tests for new features or bug fixes

### Language-Specific Guidelines:

#### JavaScript/TypeScript:

- Use ES6+ features
- Include TypeScript types for all functions and variables
- Use async/await for asynchronous code
- Format code with Prettier
- Follow ESLint rules

#### CSS/Styling:

- Use Tailwind CSS utility classes
- For complex components, consider using component-specific CSS modules
- Follow a mobile-first approach for responsive design

#### React:

- Use functional components with hooks
- Avoid large component files (aim for under 300 lines)
- Split complex components into smaller sub-components
- Use proper prop types/interfaces

#### Python (AI Service):

- Follow PEP 8 style guidelines
- Use type hints
- Document functions and classes with docstrings
- Use `async/await` for FastAPI endpoints

## 🌿 Git Workflow:

We follow a simple Git workflow:

1. **Main Branch**: The `main` branch contains the stable version of the code
2. **Development Branch**: The `development` branch is used for integration testing
3. **Feature Branches**: Create a new branch for each feature or bugfix
4. **Pull Requests**: Submit PRs to merge your changes into the development branch

### Commit Message Guidelines:

Write clear, descriptive commit messages in the imperative present tense:

```
feat: add dark mode toggle
fix: correct login button display on mobile
docs: update installation instructions
test: add tests for user authentication
```

Types include:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or modifying tests
- `chore`: Changes to the build process or auxiliary tools

### Branch Naming Conventions:

Use descriptive branch names with the following prefixes:

- `feature/feature-name` - For new features
- `bugfix/issue-description` - For bug fixes
- `hotfix/critical-issue` - For critical fixes that need immediate attention
- `docs/documentation-update` - For documentation updates
- `refactor/component-name` - For code refactoring
- `release/version-number` - For release branches

Examples:

- `feature/slide-transitions`
- `bugfix/image-upload-error`
- `docs/api-documentation`

## 💬 Communication:

Have questions or need help? Here's how to get in touch:

- **Issues**: Use GitHub issues for bugs and feature requests
- **Discussions**: Join the GitHub Discussions for general questions (coming soon)
- **Community Chat**: Join our community chat (coming soon)

We aim to respond to all communications within 2-3 business days.

## 🎓 Learning Resources:

New to some of the technologies we use? Here are some helpful resources:

- [Learn Next.js](https://nextjs.org/learn)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Git and GitHub Basics](https://docs.github.com/en/get-started)

---

Thank you for contributing to AI Presentation Generator! Your efforts help make this project better for everyone. 💖
