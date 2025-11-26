"use client";

import * as React from "react";
import { toast as sonnerToast } from "sonner";

export function toast(props: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}) {
  if (props.variant === "destructive") {
    return sonnerToast.error(props.title || "Error", {
      description: props.description,
    });
  }
  if (props.variant === "success") {
    return sonnerToast.success(props.title || "Success", {
      description: props.description,
    });
  }
  return sonnerToast(props.title || "Notification", {
    description: props.description,
  });
}

export { Toaster } from "sonner";


