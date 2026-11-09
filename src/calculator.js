const readline = require('node:readline');

// Supported operations: addition (+), subtraction (-), multiplication (*), division (/),
// modulo (%), exponentiation (**), and square root (sqrt).
function add(left, right) {
  return left + right;
}

function subtract(left, right) {
  return left - right;
}

function multiply(left, right) {
  return left * right;
}

function divide(left, right) {
  if (right === 0) {
    throw new RangeError('Cannot divide by zero.');
  }

  return left / right;
}

function modulo(a, b) {
  if (b === 0) {
    throw new RangeError('Cannot modulo by zero.');
  }

  return a % b;
}

function power(base, exponent) {
  return base ** exponent;
}

function squareRoot(n) {
  if (n < 0) {
    throw new RangeError('Cannot take the square root of a negative number.');
  }

  return Math.sqrt(n);
}

function calculate(left, operator, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new TypeError('Both operands must be finite numbers.');
  }

  const operations = {
    '+': add,
    '-': subtract,
    '*': multiply,
    '/': divide,
    '%': modulo,
    '**': power,
  };
  const operation = operations[operator];

  if (!operation) {
    throw new Error(`Unsupported operation: ${operator}`);
  }

  return operation(left, right);
}

function evaluateExpression(expression) {
  const squareRootMatch = expression.match(
    /^\s*sqrt\s*\(\s*(-?(?:\d+(?:\.\d*)?|\.\d+))\s*\)\s*$/i,
  );

  if (squareRootMatch) {
    return squareRoot(Number(squareRootMatch[1]));
  }

  const match = expression.match(
    /^\s*(-?(?:\d+(?:\.\d*)?|\.\d+))\s*(\*\*|[+\-*/%])\s*(-?(?:\d+(?:\.\d*)?|\.\d+))\s*$/,
  );

  if (!match) {
    throw new Error('Enter a calculation like "2 + 3" or "sqrt(9)".');
  }

  return calculate(Number(match[1]), match[2], Number(match[3]));
}

function runCalculator() {
  const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('CLI Calculator — use +, -, *, /, %, **, or sqrt(); C to clear, Q to quit.');
  terminal.setPrompt('0 > ');
  terminal.prompt();

  terminal.on('line', (input) => {
    const command = input.trim();

    if (/^q(?:uit)?$/i.test(command)) {
      terminal.close();
      return;
    }

    if (command.toLowerCase() === 'c') {
      console.log('0');
      terminal.setPrompt('0 > ');
      terminal.prompt();
      return;
    }

    try {
      const result = evaluateExpression(command);
      console.log(result);
      terminal.setPrompt(`${result} > `);
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }

    terminal.prompt();
  });
}

if (require.main === module) {
  runCalculator();
}

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  modulo,
  power,
  squareRoot,
  calculate,
  evaluateExpression,
  runCalculator,
};
