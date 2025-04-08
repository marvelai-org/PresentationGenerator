# Branch Protection Rules

This document outlines the branch protection rules that should be set up for the PresentationGenerator repository.

## How to Set Up Branch Protection Rules

1. Navigate to the repository on GitHub
2. Click on "Settings"
3. In the left sidebar, click on "Branches"
4. Under "Branch protection rules", click "Add rule"
5. Configure the rules as described below for each branch type

## Main Branch (`main`)

Apply the following protection rules to the `main` branch:

- **Branch name pattern**: `main`
- **Require a pull request before merging**: Enabled
  - **Required approvals**: 1
  - **Dismiss stale pull request approvals when new commits are pushed**: Enabled
  - **Require review from Code Owners**: Enabled
- **Require status checks to pass before merging**: Enabled
  - **Require branches to be up to date before merging**: Enabled
  - *Note: Once CI is set up, require relevant status checks*
- **Require conversation resolution before merging**: Enabled
- **Do not allow bypassing the above settings**: Enabled
- **Restrict who can push to matching branches**: Enabled
  - Only allow admins and specified people/teams
- **Allow force pushes**: Disabled
- **Allow deletions**: Disabled

## Development Branch (`development`)

Apply the following protection rules to the `development` branch:

- **Branch name pattern**: `development`
- **Require a pull request before merging**: Enabled
  - **Required approvals**: 1
  - **Dismiss stale pull request approvals when new commits are pushed**: Enabled
- **Require status checks to pass before merging**: Enabled
  - **Require branches to be up to date before merging**: Enabled
- **Require conversation resolution before merging**: Enabled
- **Allow force pushes**: Enabled for maintainers only
- **Allow deletions**: Disabled

## Feature Branches

Apply the following protection rules to feature branches:

- **Branch name pattern**: `feature/*`
- **Require status checks to pass before merging**: Enabled
  - **Require branches to be up to date before merging**: Enabled
- **Allow force pushes**: Enabled
- **Allow deletions**: Enabled after merging

## Other Branch Patterns

Consider adding additional protection rules for:

- **Branch name pattern**: `release/*`
  - Similar protections to `main`
- **Branch name pattern**: `hotfix/*`
  - Fewer restrictions for urgent fixes

## Notes

- Branch protection rules are applied in order of specificity. Rules for specific branch names have higher priority than pattern rules.
- Review and update these protection rules periodically as the project evolves.
- Make sure your CI system is configured to report status checks back to GitHub for use in these protection rules. 