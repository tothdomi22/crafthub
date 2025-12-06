import {toast} from "react-toastify";

export const notifySuccess = (message: string) =>
  toast.success(message, {position: "bottom-right"});
export const notifyError = (message: string) =>
  toast.error(message, {position: "bottom-right"});
