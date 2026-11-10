const SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?',
};

function randomInt(max) {
  if (max <= 0) throw new Error('Invalid range');
  const range = 0x100000000;
  const limit = range - (range % max);
  const buffer = new Uint32Array(1);
  let value = 0;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return value % max;
}

export function charsetSize(options) {
  return Object.entries(SETS).reduce((total, [key, value]) => {
    return options[key] ? total + value.length : total;
  }, 0);
}

export function generatePassword(length, options) {
  const pools = Object.entries(SETS)
    .filter(([key]) => options[key])
    .map(([, value]) => value);

  if (!pools.length) {
    throw new Error('Select at least one character type.');
  }

  const size = Math.round(Number(length));
  if (!Number.isFinite(size) || size < 8 || size > 64) {
    throw new Error('Password length must be between 8 and 64.');
  }

  const all = pools.join('');
  const chars = [];
  pools.forEach((pool) => {
    if (chars.length < size) chars.push(pool[randomInt(pool.length)]);
  });
  while (chars.length < size) {
    chars.push(all[randomInt(all.length)]);
  }
  for (let index = chars.length - 1; index > 0; index -= 1) {
    const swap = randomInt(index + 1);
    const current = chars[index];
    chars[index] = chars[swap];
    chars[swap] = current;
  }
  return chars.join('');
}

export function measureStrength(length, size) {
  const bits = length * Math.log2(size || 1);
  let label = 'Very strong';
  let score = 4;
  if (bits < 36) {
    label = 'Weak';
    score = 1;
  } else if (bits < 60) {
    label = 'Fair';
    score = 2;
  } else if (bits < 80) {
    label = 'Strong';
    score = 3;
  }
  return { bits: Math.round(bits), label, score };
}
