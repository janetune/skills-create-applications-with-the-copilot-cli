const readline = require('node:readline');

// Supported operations: addition (+), subtraction (-), multiplication (*), and division (/).
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

function calculate(left, operator, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new TypeError('Both operands must be finite numbers.');
  }

  const operations = {
    '+': add,
    '-': subtract,
    '*': multiply,
    '/': divide,
  };
  const operation = operations[operator];

  if (!operation) {
    throw new Error(`Unsupported operation: ${operator}`);
  }

  return operation(left, right);
}

function evaluateExpression(expression) {
  const match = expression.match(
    /^\s*(-?(?:\d+(?:\.\d*)?|\.\d+))\s*([+\-*/])\s*(-?(?:\d+(?:\.\d*)?|\.\d+))\s*$/,
  );

  if (!match) {
    throw new Error('Enter a calculation like "2 + 3".');
  }

  return calculate(Number(match[1]), match[2], Number(match[3]));
}

function runCalculator() {
  const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('CLI Calculator — enter a calculation, C to clear, or Q to quit.');
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

module.exports = { add, subtract, multiply, divide, calculate, evaluateExpression, runCalculator };
