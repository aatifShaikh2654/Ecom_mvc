import { toast as sonnerToast } from "sonner";
import clsx from "clsx";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

const baseClasses = "!border-1 rounded-md shadow-md";

export const toast = {
  success: (message, options = {}) =>
    sonnerToast.success(message, {
      icon: <CheckCircle className="text-green-500" size={20} />,
      className: clsx(baseClasses, "border-green-500"),
      ...options,
    }),

  error: (message, options = {}) =>
    sonnerToast.error(message, {
      icon: <XCircle className="text-red-500" size={20} />,
      className: clsx(baseClasses, "border-red-500"),
      ...options,
    }),

  warning: (message, options = {}) =>
    sonnerToast.warning(message, {
      icon: <AlertTriangle className="text-yellow-500" size={20} />,
      className: clsx(baseClasses, "border-yellow-500"),
      ...options,
    }),

  info: (message, options = {}) =>
    sonnerToast(message, {
      icon: <Info className="text-blue-500" size={20} />,
      className: clsx(baseClasses, "border-blue-500"),
      ...options,
    }),
};
