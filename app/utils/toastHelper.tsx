import {toast, ToastOptions} from "react-toastify";
import React from "react";

// --- 1. Custom Icons with your Semantic Colors ---

const SuccessIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-6 h-6 text-primary" // Uses your purple
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ErrorIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-6 h-6 text-danger-solid" // Uses your red
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// --- 2. Base Configuration ---

const contextClass = {
  success:
    "bg-surface dark:bg-surface border border-border-subtle !text-text-main !shadow-xl rounded-xl",
  error:
    "bg-surface dark:bg-surface border border-danger-border !text-text-main !shadow-xl rounded-xl",
};

const defaultOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: {background: "transparent", boxShadow: "none"},
};

// --- 3. Exports ---

export const notifySuccess = (message: string) =>
  toast.success(message, {
    ...defaultOptions,
    className: contextClass.success,
    progressClassName: "!bg-primary",
    icon: SuccessIcon, // Pass the component directly
  });

export const notifyError = (message: string) =>
  toast.error(message, {
    ...defaultOptions,
    className: contextClass.error,
    progressClassName: "!bg-danger-solid",
    icon: ErrorIcon, // Pass the component directly
  });
