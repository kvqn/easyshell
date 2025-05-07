// ==========================================
// Utility exports that are available anytime
// ==========================================

type Success<T> = {
  data: T
  error: null
}

type Failure<E> = {
  data: null
  error: E
}

type Result<T, E = Error> = Success<T> | Failure<E>

export async function neverThrow<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error as E }
  }
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Tries to convert string to date
 * If it fails, returns null
 */
export function strToDate(date: string): Date | null {
  const parsedDate = new Date(date)
  if (isNaN(parsedDate.getTime())) return null
  return parsedDate
}
