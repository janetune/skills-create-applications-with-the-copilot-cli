const { spawnSync } = require('node:child_process');
const path = require('node:path');
const {
  add,
  subtract,
  multiply,
  divide,
  modulo,
  power,
  squareRoot,
  calculate,
  evaluateExpression,
} = require('../calculator');

describe('basic arithmetic operations', () => {
  test.each([
    [2, 3, 5],
    [-2, 3, 1],
    [1.5, 2.5, 4],
  ])('adds %p and %p to get %p', (left, right, expected) => {
    expect(add(left, right)).toBe(expected);
  });

  test.each([
    [10, 4, 6],
    [4, 10, -6],
    [-2, -3, 1],
  ])('subtracts %p from %p to get %p', (left, right, expected) => {
    expect(subtract(left, right)).toBe(expected);
  });

  test.each([
    [45, 2, 90],
    [-3, 4, -12],
    [0, 5, 0],
  ])('multiplies %p by %p to get %p', (left, right, expected) => {
    expect(multiply(left, right)).toBe(expected);
  });

  test.each([
    [20, 5, 4],
    [7, 2, 3.5],
    [-12, 3, -4],
  ])('divides %p by %p to get %p', (left, right, expected) => {
    expect(divide(left, right)).toBe(expected);
  });

  test('throws when dividing by zero', () => {
    expect(() => divide(1, 0)).toThrow(RangeError);
    expect(() => divide(1, 0)).toThrow('Cannot divide by zero.');
  });

  test.each([
    [5, 2, 1],
    [-10, 3, -1],
    [10, -3, 1],
  ])('returns the remainder of %p divided by %p', (left, right, expected) => {
    expect(modulo(left, right)).toBe(expected);
  });

  test('throws when calculating a remainder with a zero divisor', () => {
    expect(() => modulo(10, 0)).toThrow(RangeError);
    expect(() => modulo(10, 0)).toThrow('Cannot modulo by zero.');
  });

  test.each([
    [2, 3, 8],
    [2, -2, 0.25],
    [-2, 3, -8],
    [5, 0, 1],
  ])('raises %p to the power of %p', (base, exponent, expected) => {
    expect(power(base, exponent)).toBe(expected);
  });

  test.each([
    [16, 4],
    [25, 5],
    [0, 0],
    [2, Math.sqrt(2)],
  ])('returns the square root of %p', (number, expected) => {
    expect(squareRoot(number)).toBe(expected);
  });

  test('throws when taking the square root of a negative number', () => {
    expect(() => squareRoot(-1)).toThrow(RangeError);
    expect(() => squareRoot(-1)).toThrow(
      'Cannot take the square root of a negative number.',
    );
  });
});

describe('calculate', () => {
  test.each([
    [2, '+', 3, 5],
    [10, '-', 4, 6],
    [45, '*', 2, 90],
    [20, '/', 5, 4],
    [10, '%', 3, 1],
    [2, '**', 3, 8],
  ])('evaluates the example %p %s %p', (left, operator, right, expected) => {
    expect(calculate(left, operator, right)).toBe(expected);
  });

  test('rejects unsupported operators', () => {
    expect(() => calculate(2, '^', 3)).toThrow('Unsupported operation: ^');
  });

  test.each([NaN, Infinity, -Infinity])('rejects non-finite left operand %p', (value) => {
    expect(() => calculate(value, '+', 1)).toThrow(TypeError);
  });

  test('rejects a non-finite right operand', () => {
    expect(() => calculate(1, '+', Infinity)).toThrow(
      'Both operands must be finite numbers.',
    );
  });
});

describe('evaluateExpression', () => {
  test.each([
    ['2 + 3', 5],
    ['10 - 4', 6],
    ['45 * 2', 90],
    ['20 / 5', 4],
    ['5 % 2', 1],
    ['2 ** 3', 8],
    ['sqrt(16)', 4],
    ['SQRT(0)', 0],
  ])('evaluates the image example %p', (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });

  test.each([
    ['-2--3', 1],
    ['1.5 * 2', 3],
    [' .5 + 1.25 ', 1.75],
  ])('supports signed and decimal operands in %p', (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });

  test('reports division by zero', () => {
    expect(() => evaluateExpression('9 / 0')).toThrow('Cannot divide by zero.');
  });

  test('reports modulo by zero and square roots of negative numbers', () => {
    expect(() => evaluateExpression('9 % 0')).toThrow('Cannot modulo by zero.');
    expect(() => evaluateExpression('sqrt(-1)')).toThrow(
      'Cannot take the square root of a negative number.',
    );
  });

  test.each(['', '2 ^ 3', '2 +', '2 + 3 + 4', 'sqrt()', 'hello'])(
    'rejects invalid expression %p',
    (expression) => {
      expect(() => evaluateExpression(expression)).toThrow(
        'Enter a calculation like "2 + 3" or "sqrt(9)".',
      );
    },
  );
});

describe('CLI', () => {
  const calculatorPath = path.join(__dirname, '..', 'calculator.js');

  test('runs arithmetic examples and prints their results', () => {
    const result = spawnSync(process.execPath, [calculatorPath], {
      input: '2 + 3\n10 - 4\n45 * 2\n20 / 5\n5 % 2\n2 ** 3\nsqrt(16)\nQ\n',
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain(
      '0 > 5\n5 > 6\n6 > 90\n90 > 4\n4 > 1\n1 > 8\n8 > 4\n4 > ',
    );
  });

  test('clears the display and reports operation errors without exiting', () => {
    const result = spawnSync(process.execPath, [calculatorPath], {
      input: 'C\n9 / 0\n9 % 0\nsqrt(-1)\nQ\n',
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain(
      '0 > 0\n0 > Error: Cannot divide by zero.\n0 > Error: Cannot modulo by zero.\n0 > Error: Cannot take the square root of a negative number.\n0 > ',
    );
  });
});
