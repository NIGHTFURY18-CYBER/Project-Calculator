# Calculator

A working calculator built as part of [The Odin Project](https://www.theodinproject.com/) JavaScript curriculum. 

## Live Demo

[View it live](#) <!-- replace with your GitHub Pages link once enabled -->

## Features

- Basic operations: addition, subtraction, multiplication, division
- Chained calculations (e.g. `12 + 7 - 1 =` evaluates step by step, just like a real calculator)
- Decimal input, with protection against multiple decimal points in one number
- Backspace to undo the last digit
- Sign toggle (`±`)
- Clear (`AC`) resets everything
- Divide-by-zero shows a friendly error instead of crashing
- Long decimal results are rounded so they don't overflow the display
- Full keyboard support:



## Tech Stack

- HTML
- CSS
- Vanilla JavaScript (no frameworks or libraries)

## Running Locally

Open `index.html` in your browser, or use a local server (e.g. VS Code's Live Server extension) for the best experience.

## What I Learned

- Managing calculator state (first number, operator, second number) without a UI framework
- Handling edge cases: consecutive operator presses, evaluating before all inputs are given, divide-by-zero, and decimal formatting
- Wiring up both click and keyboard event listeners to the same logic