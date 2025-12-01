"use client";

import * as React from "react";
import { toast as sonnerToast } from "sonner";

export function toast(props: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}) {
  const options = {
    description: props.description,
    duration: props.duration || 4000,
    closeButton: true, // Always show close button
  };

  if (props.variant === "destructive") {
    return sonnerToast.error(props.title || "Error", options);
  }
  if (props.variant === "success") {
    return sonnerToast.success(props.title || "Success", options);
  }
  return sonnerToast(props.title || "Notification", options);
}

export { Toaster } from "sonner";
