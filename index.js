// rest parameter i.e (...rest )

function generatePassword(options = {}) {
  const {
    length = 16,
    lower = true,
    upper = true,
    numbers = true,
    symbols = true,
    avoidAmbiguous = false,
  } = options;

  if (length <= 0) throw new Error('Password length must be > 0');

  const sets = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()-_=+[]{};:,.<>/?~',
  };

  // ambiguous characters commonly confused: O 0 I l 1 | ` ' " , ; : . , etc.
  const ambiguous = 'O0Il1`\'"~,;:.|\\/';

  let charset = '';
  if (lower) charset += sets.lower;
  if (upper) charset += sets.upper;
  if (numbers) charset += sets.numbers;
  if (symbols) charset += sets.symbols;
  if (!charset) throw new Error('At least one character set must be enabled');

  if (avoidAmbiguous) {
    const ambSet = new Set(ambiguous.split(''));
    charset = Array.from(charset).filter(ch => !ambSet.has(ch)).join('');
  }

  // Helper: secure random integer in range [0, max)
  function secureRandomInt(max) {
    if (max <= 0) return 0;
    // Use Web Crypto if available (browser or modern Node)
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      // Avoid modulo bias: drop values >= limit
      const range = max;
      const uint32Max = 0xFFFFFFFF;
      const limit = Math.floor((uint32Max + 1) / range) * range;

      const arr = new Uint32Array(1);
      let val;
      do {
        crypto.getRandomValues(arr);
        val = arr[0];
      } while (val >= limit);
      return val % range;
    }

    // Fallback to Math.random (not cryptographically secure)
    return Math.floor(Math.random() * max);
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    const idx = secureRandomInt(charset.length);
    password += charset.charAt(idx);
  }

  return password;
}
