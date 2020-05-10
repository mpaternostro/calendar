import start from '../calendar.js';
import '../index.js';

jest.mock('../calendar.js', () => jest.fn());

test('inicializa calendario', () => {
  expect(start)
    .toHaveBeenCalledTimes(1);
});
