Object.assign(global, require('jest-chrome'));
Object.defineProperty(window.crypto, 'randomUUID', {
  value: () => '5678',
});

console.error = jest.fn();
console.info = jest.fn();
