// ---- Basic math operations ----
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return null; // handled specially — division by zero
  }
  return a / b;
}

function operate(operator, a, b) {
  a = Number(a);
  b = Number(b);
  switch (operator) {
    case "add":
      return add(a, b);
    case "subtract":
      return subtract(a, b);
    case "multiply":
      return multiply(a, b);
    case "divide":
      return divide(a, b);
    default:
      return b;
  }
}

// ---- State ----
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;
let displayValue = "0";
let justEvaluated = false;

const displayEl = document.getElementById("display");
const historyEl = document.getElementById("history");

const OPERATOR_SYMBOLS = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷",
};

function updateScreen() {
  displayEl.textContent = displayValue;

  if (operator && firstNumber !== null) {
    historyEl.textContent = `${formatForHistory(firstNumber)} ${OPERATOR_SYMBOLS[operator]}`;
  } else {
    historyEl.textContent = "\u00A0";
  }
}

function formatForHistory(num) {
  return roundResult(num);
}

// Round long decimals so they don't overflow the display
function roundResult(num) {
  if (!isFinite(num)) return num;
  const rounded = Math.round((num + Number.EPSILON) * 1e9) / 1e9;
  const str = rounded.toString();
  if (str.length > 12) {
    return rounded.toPrecision(10).replace(/\.?0+$/, "").replace(/\.?0+e/, "e");
  }
  return str;
}

function inputDigit(digit) {
  if (justEvaluated) {
    displayValue = digit;
    justEvaluated = false;
    waitingForSecondNumber = false;
    firstNumber = null;
    operator = null;
    updateScreen();
    return;
  }

  if (waitingForSecondNumber) {
    displayValue = digit;
    waitingForSecondNumber = false;
  } else {
    displayValue = displayValue === "0" ? digit : displayValue + digit;
  }
  updateScreen();
}

function inputDecimal() {
  if (justEvaluated) {
    displayValue = "0.";
    justEvaluated = false;
    waitingForSecondNumber = false;
    firstNumber = null;
    operator = null;
    updateScreen();
    return;
  }

  if (waitingForSecondNumber) {
    displayValue = "0.";
    waitingForSecondNumber = false;
    updateScreen();
    return;
  }

  if (!displayValue.includes(".")) {
    displayValue += ".";
    updateScreen();
  }
}

function handleOperator(nextOperator) {
  const inputValue = Number(displayValue);

  justEvaluated = false;

  if (operator && waitingForSecondNumber) {
    // consecutive operator presses: just swap the pending operator
    operator = nextOperator;
    updateScreen();
    return;
  }

  if (firstNumber === null) {
    firstNumber = inputValue;
  } else if (operator) {
    const result = operate(operator, firstNumber, inputValue);

    if (result === null) {
      showError("Nice try. Can't divide by 0.");
      return;
    }

    const rounded = Number(roundResult(result));
    firstNumber = rounded;
    displayValue = roundResult(rounded);
  }

  waitingForSecondNumber = true;
  operator = nextOperator;
  updateScreen();
}

function handleEquals() {
  if (operator === null || waitingForSecondNumber) {
    // not enough info to evaluate — ignore
    return;
  }

  const secondNumber = Number(displayValue);
  const result = operate(operator, firstNumber, secondNumber);

  if (result === null) {
    showError("Nice try. Can't divide by 0.");
    return;
  }

  const rounded = roundResult(result);
  displayValue = rounded;
  firstNumber = null;
  operator = null;
  waitingForSecondNumber = false;
  justEvaluated = true;
  updateScreen();
}

function showError(message) {
  displayValue = message;
  displayEl.textContent = displayValue;
  historyEl.textContent = "\u00A0";
  firstNumber = null;
  operator = null;
  waitingForSecondNumber = false;
  justEvaluated = true;
}

function clearAll() {
  firstNumber = null;
  operator = null;
  waitingForSecondNumber = false;
  justEvaluated = false;
  displayValue = "0";
  updateScreen();
}

function backspace() {
  if (justEvaluated || waitingForSecondNumber) return;

  if (displayValue.length <= 1 || (displayValue.length === 2 && displayValue.startsWith("-"))) {
    displayValue = "0";
  } else {
    displayValue = displayValue.slice(0, -1);
  }
  updateScreen();
}

function toggleSign() {
  if (displayValue === "0") return;
  displayValue = displayValue.startsWith("-")
    ? displayValue.slice(1)
    : "-" + displayValue;
  updateScreen();
}

// ---- Button wiring ----
document.querySelectorAll(".key").forEach((button) => {
  button.addEventListener("click", () => {
    const { num, action } = button.dataset;

    if (num !== undefined) {
      inputDigit(num);
      return;
    }

    switch (action) {
      case "clear":
        clearAll();
        break;
      case "backspace":
        backspace();
        break;
      case "sign":
        toggleSign();
        break;
      case "decimal":
        inputDecimal();
        break;
      case "equals":
        handleEquals();
        break;
      case "add":
      case "subtract":
      case "multiply":
      case "divide":
        handleOperator(action);
        break;
    }
  });
});

// ---- Keyboard support ----
window.addEventListener("keydown", (e) => {
  const key = e.key;

  if (key >= "0" && key <= "9") {
    inputDigit(key);
    flashKey(`[data-num="${key}"]`);
    return;
  }

  if (key === ".") {
    inputDecimal();
    flashKey('[data-action="decimal"]');
    return;
  }

  if (key === "+" ) {
    handleOperator("add");
    flashKey('[data-action="add"]');
    return;
  }
  if (key === "-") {
    handleOperator("subtract");
    flashKey('[data-action="subtract"]');
    return;
  }
  if (key === "*") {
    handleOperator("multiply");
    flashKey('[data-action="multiply"]');
    return;
  }
  if (key === "/") {
    e.preventDefault();
    handleOperator("divide");
    flashKey('[data-action="divide"]');
    return;
  }
  if (key === "Enter" || key === "=") {
    handleEquals();
    flashKey('[data-action="equals"]');
    return;
  }
  if (key === "Backspace") {
    backspace();
    flashKey('[data-action="backspace"]');
    return;
  }
  if (key === "Escape") {
    clearAll();
    flashKey('[data-action="clear"]');
    return;
  }
});

function flashKey(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.classList.add("key--pressed");
  setTimeout(() => el.classList.remove("key--pressed"), 100);
}

updateScreen();