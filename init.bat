@ECHO off

:: Initializes the family-home Git repository and publishes its first commit.
:: Run this once from the family-home directory against an empty GitHub repository.
:: See commented-out core.ignorecase option below for case-sensitive file tracking.

ECHO # family-news>README.md
git init
:: git config core.ignorecase false
git add README.md
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/m-jim-d/family-news.git
git push -u origin main