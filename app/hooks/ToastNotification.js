"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Utility functions to show toast messages
export const notifySuccess = (msg) => toast.success(msg);
export const notifyError = (msg) => toast.error(msg);
export const notifyInfo = (msg) => toast.info(msg);
export const notifyWarning = (msg) => toast.warn(msg);

// Toast Container component (should be rendered once, globally)
export default function ToastNotification() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
    />
  );
}
