import { toast, ToastOptions } from "react-toastify";

export const useToast = (options?: ToastOptions<{}>) => {
  const success = (data: string) =>
    toast(data, { type: "success", ...options });
  const error = (data: string) =>
    toast(data, { type: "error", ...options });

  return { success, error };
}