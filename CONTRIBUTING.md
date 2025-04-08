# Contributing to PresentationGenerator

Thank you for your interest in contributing to the PresentationGenerator project! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Branch Naming Conventions

When creating branches for your contributions, please follow these naming conventions:

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

## Pull Request Process

1. Ensure your branch is up to date with the latest changes from the main branch
2. Update the README.md or documentation with details of changes if appropriate
3. The PR should work against the latest main branch
4. PRs require at least one approval from the relevant code owners
5. Once approved, maintainers will merge your PR

## Development Setup

Please refer to the [README.md](README.md) for instructions on setting up the development environment.

## Testing

- Write tests for new features
- Ensure all tests pass before submitting your PR
- Tests will automatically run via GitHub Actions

## Coding Standards

- Follow the existing code style of the project
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused on a single responsibility

## Commit Messages

Please use clear and descriptive commit messages that explain what changes were made and why. Follow this format:

```
type(scope): brief description

Detailed explanation if necessary
```

Types include:
- feat: A new feature
- fix: A bug fix
- docs: Documentation changes
- style: Code style changes (formatting, etc.)
- refactor: Code changes that neither fix bugs nor add features
- test: Adding or modifying tests
- chore: Changes to the build process or auxiliary tools

Example:
```
feat(editor): add image resizing capability

Added the ability to resize images in the presentation editor using a 
drag handle. This includes maintaining aspect ratio when the shift key is pressed.
```

## License

By contributing to PresentationGenerator, you agree that your contributions will be licensed under the project's [MIT License](LICENSE). 