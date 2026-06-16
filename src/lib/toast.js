import { toast } from 'sonner'
import { normalizeApiError } from '@/services/apiError'

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return normalizeApiError(error).message || fallback
}

export const notify = {
  success(message, options) {
    toast.success(message, options)
  },
  error(error, fallback, options) {
    toast.error(getErrorMessage(error, fallback), options)
  },
  loading(message, options) {
    return toast.loading(message, options)
  },
  promise(promise, messages) {
    return toast.promise(promise, messages)
  },
  dismiss(id) {
    toast.dismiss(id)
  },
}
