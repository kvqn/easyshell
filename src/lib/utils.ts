// Utility functions that can be used on the client and server side
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function min(...numbers: number[]): number {
  if (numbers.length === 0) {
    throw new Error("min() requires at least one argument")
  }

  let minimum = numbers[0]!
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i]! < minimum) {
      minimum = numbers[i]!
    }
  }
  return minimum
}

export function max(...numbers: number[]): number {
  if (numbers.length === 0) {
    throw new Error("max() requires at least one argument")
  }

  let maximum = numbers[0]!
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i]! > maximum) {
      maximum = numbers[i]!
    }
  }
  return maximum
}

export const STATUS_LOCKED = 423
export const STATUS_INTERNAL_SERVER_ERROR = 500

export function checkValidUsername(name: string): boolean {
  if (name.length > 20) return false
  if (name.length < 3) return false
  if (!/^[a-zA-Z0-9_-]*$/.test(name)) return false
  return true
}
