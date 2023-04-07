import { toast, ToastOptions } from "react-toastify";

export const useToast = (defaultOptions: ToastOptions<{}> = { theme: 'dark' }) => {
  const success = (data: string) =>
    toast(data, { type: "success", ...defaultOptions });

  const error = (data: string, options?: ToastOptions) =>
    toast(data, { ...defaultOptions, ...options, type: "error", });

  const info = (data: string, options?: ToastOptions<{}>) =>
    toast(data, { ...defaultOptions, ...options, type: 'info' });

  return { success, error, info };
}