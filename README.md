[![Release to GitHub Pages][workflow-badge]][workflow-url]
[![Coverage Status][coverage-badge]][coverage-url]

# Tic-Tac-Toe

This repository contains web based interactive Tic-Tac-Toe game.

## Demo

![image psd](https://user-images.githubusercontent.com/25894545/168828443-98e8df3c-59bb-408e-b533-b2d295b303ee.png)

[GitHub Pages](https://teamchong.github.io/frontend-test/)

## Controls

1. Player X starts the game
2. Click on each grid to place symbol
3. The result of the game is displayed at the end of the game
4. A track of player scores is maintained
5. Click any grid to play again

## PvP

1. Select PvP mode
2. Player X starts the game
3. Player X shared the url in location bar to Player O
4. Player O open the url and start playing

## Tech Stack

| Feature          | Library Used                | Also Considered    |
| ---------------- | --------------------------- | ------------------ |
| Web              | NextJS + React + TypeScript | Remix, Vue, Svelte |
| State Management | zustand                     | Redux              |
| Lint             | ESLint                      |                    |
| Code Format      | Prettier                    |                    |
| Unit Test        | Jest                        | vitest             |
| e2e Test         | Playwright                  | Cypress            |

## Author

[Steven Chong](https://github.com/teamchong)

[workflow-badge]: https://github.com/teamchong/frontend-test/actions/workflows/release.yml/badge.svg?branch=main
[workflow-url]: https://github.com/teamchong/frontend-test/actions/workflows/release.yml
[coverage-badge]: https://coveralls.io/repos/github/teamchong/frontend-test/badge.svg?branch=main
[coverage-url]: https://coveralls.io/github/teamchong/frontend-test?branch=main
