import { toast, ToastOptions } from "react-toastify";

export const useToast = (defaultOptions?: ToastOptions<{}>) => {
  const success = (data: string) =>
    toast(data, { type: "success", ...defaultOptions });

  const error = (data: string) =>
    toast(data, { type: "error", ...defaultOptions });

  const info = (data: string, options?: ToastOptions<{}>) =>
    toast(data, { ...defaultOptions, ...options, type: 'info' });

  return { success, error, info };
}