import { describe, test, expect } from 'vitest';
import { roundNum, kgToLbs } from './formatting';

describe('formatting utilities', () => {
    describe('roundNum', () => {
        test('should round to one decimal place correctly', () => {
            expect(roundNum(3.14159)).toBe(3.1);
            expect(roundNum(10.987)).toBe(11);
            expect(roundNum(5.456)).toBe(5.5);
        });

        test('should handle integers', () => {
            expect(roundNum(5)).toBe(5);
            expect(roundNum(0)).toBe(0);
            expect(roundNum(100)).toBe(100);
        });

        test('should handle edge cases', () => {
            expect(roundNum(0.05)).toBe(0.1);
            expect(roundNum(0.04)).toBe(0);
            expect(roundNum(999.99)).toBe(1000);
        });

        test('should handle negative numbers', () => {
            expect(roundNum(-3.14159)).toBe(-3.1);
            expect(roundNum(-10.987)).toBe(-11);
        });

        test('should handle very large numbers', () => {
            expect(roundNum(1234567.89)).toBe(1234567.9);
        });
    });

    describe('kgToLbs', () => {
        test('should convert kg to lbs with correct multiplier', () => {
            expect(kgToLbs(1)).toBeCloseTo(2.20462, 5);
            expect(kgToLbs(10)).toBeCloseTo(22.0462, 4);
            expect(kgToLbs(25)).toBeCloseTo(55.1155, 4);
        });

        test('should handle zero', () => {
            expect(kgToLbs(0)).toBe(0);
        });

        test('should handle decimal kg values', () => {
            expect(kgToLbs(1.5)).toBeCloseTo(3.30693, 4);
            expect(kgToLbs(12.7)).toBeCloseTo(27.998674, 4);
        });

        test('should handle very large numbers', () => {
            expect(kgToLbs(100)).toBeCloseTo(220.462, 3);
        });
    });
});



