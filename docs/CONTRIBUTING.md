# Contributing to AI Presentation Generator

Thank you for your interest in contributing to the AI Presentation Generator! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to uphold our Code of Conduct, which expects all contributors to be respectful and inclusive.

## Getting Started

1. **Fork the Repository**: Create your own fork of the repository.
2. **Clone Your Fork**: Clone your fork locally.
3. **Set Up Development Environment**: Follow the setup instructions in the main README.md.
4. **Create a Branch**: Create a branch for your feature or bugfix.

## Development Workflow

### Local Development

1. Make your changes to the codebase.
2. Ensure all tests pass locally.
3. Run linting to check code quality: `npm run lint`.
4. Format your code: `npm run format`.

### Self-Hosting for Testing

To test your changes in a production-like environment:

1. Build the Docker image locally: `docker build -t ai-presentation-generator .`
2. Run the containerized application: `docker run -p 3000:3000 ai-presentation-generator`

### Submitting Changes

1. **Commit Your Changes**: Write clear, concise commit messages that describe what your changes do.
2. **Push to Your Fork**: Push your branch to your fork.
3. **Create a Pull Request**: Submit a pull request (PR) to the main repository.
4. **Review Process**: Wait for project maintainers to review your PR. Respond to any feedback and make necessary changes.

## Pull Request Guidelines

- PRs should focus on a single feature or bugfix.
- Make sure your code follows the project's coding style and conventions.
- Include tests for your changes when applicable.
- Update documentation as needed.
- Keep PRs reasonably sized to facilitate review.

## CI/CD Pipeline

The project uses GitHub Actions for CI/CD. When you submit a PR, automated workflows will:

1. Run linting and tests.
2. Build the application to ensure it compiles correctly.
3. Build a Docker image to verify containerization works.

Make sure your changes pass all CI checks before requesting a review.

## Architecture Decisions

For significant changes that affect the project's architecture, please reference or create an Architecture Decision Record (ADR) in the `docs/adr` directory.

## Questions and Help

If you have questions or need help with your contribution, feel free to open an issue for discussion.

Thank you for contributing to AI Presentation Generator! 