import { useState } from "react"
import { getErrorMessage } from "@/lib/api/errors"

export function useAsyncAction() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = async <T,>(action: () => Promise<{ data: T | null; error: unknown; meta: unknown }>) => {
    setIsLoading(true)
    setError(null)

    let errorHandled = false
    try {
      const result = await action()
      if (result.error) {
        setError(getErrorMessage(result.error))
        errorHandled = true
        throw result.error
      }
      // At this point, data cannot be null because we throw if there's an error
      return result.data!
    } catch (caughtError) {
      if (!errorHandled) {
        setError(getErrorMessage(caughtError))
      }
      throw caughtError
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)

  return {
    isLoading,
    error,
    run,
    clearError,
  }
}
