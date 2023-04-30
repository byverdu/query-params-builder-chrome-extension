import { castToBoolean } from '../src/utils/castToBoolean';

describe('castToBoolean', () => {
  it('should be defined', () => {
    expect(castToBoolean).toBeInstanceOf(Function);
  });

  it.each([
    [1, 1],
    [0, 0],
    ['0', 0],
    ['1', 1],
    [true, true],
    [false, false],
    ['true', true],
    ['false', false],
    [undefined, null],
    ['undefined', null],
    ['any', null],
  ])('castToBoolean(%s)', (input, expected) => {
    expect(castToBoolean(input)).toBe(expected);
  });
});
