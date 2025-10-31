/**
 * Utility functions for formatting numeric values in breed displays
 */

/**
 * Rounds a number to one decimal place
 * @param num - The number to round
 * @returns The rounded number
 */
export function roundNum(num: number): number {
    return Math.round(num * 10) / 10;
}

/**
 * Converts kilograms to pounds
 * @param kg - Weight in kilograms
 * @returns Weight in pounds
 */
export function kgToLbs(kg: number): number {
    return kg * 2.20462;
}

