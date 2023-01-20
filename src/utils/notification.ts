import { toast } from 'react-toastify'

function notification(
  message: string,
  type: 'success' | 'error' | 'warning' | 'info'
) {
  return toast[type](message, {
    className:
      'dark:bg-menu-primary dark:text-text-primary dark:border-gray-700 border',
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  })
}

function showError(err: any) {
  if (err.response) {
    if (err.response.data) {
      const knownError = err.response.data.err ? false : true

      /* 
        se o erro for conhecido, o campo 'data' virá no formato
        {message: '....', ...}

        caso contrário, virá no formato
        {err: {...}}
      */

      if (knownError) {
        notification(err?.response?.data?.message, 'error')
        return
      }

      notification('Ops! Something went wrong', 'error')
      return
    }

    console.log(err.response.message,'err')
    notification(err.response.message, 'error')
    return
  }
  notification(err?.message, 'error')
}

export { notification, showError }
