export type ToastVariant = 'danger' | 'success' | 'warning' | 'info';
type ToastCallback = (message: string, variant?: ToastVariant) => void;

let toastCallback: ToastCallback | null = null;

export const setToastCallback = (cb: ToastCallback) => {
  toastCallback = cb;
};

export const showToast = (
  message: string,
  variant: ToastVariant = 'danger'
) => {
  if (toastCallback) {
    toastCallback(message, variant);
  }
};
