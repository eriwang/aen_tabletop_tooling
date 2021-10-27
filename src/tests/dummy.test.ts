import { sum } from 'dummy';

describe('Something basic', () => {
    test('Summing stuff', () => {
        expect(sum(1, 2)).toBe(3);
    });
});