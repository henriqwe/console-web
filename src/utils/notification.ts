import { toast } from 'react-toastify'

function notification(
  message: string,
  type: 'success' | 'error' | 'warning' | 'info'
) {
  return toast[type](message, {
    className:
      'dark:bg-menu-primary dark:text-text-primary dark:border-gray-700 border',
    position: 'bottom-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  })
}

function showError(err: any) {
  notification(err?.response?.data?.message, 'error')
}

export { notification, showError }
