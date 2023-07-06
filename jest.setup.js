Object.assign(global, require('jest-chrome'));

console.error = jest.fn();
console.info = jest.fn();
