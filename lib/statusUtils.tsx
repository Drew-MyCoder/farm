// utils/statusUtils.ts
import { Clock, CheckCircle2, XCircle } from "lucide-react";

export const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return { bg: "bg-yellow-500/10", icon: <Clock className="h-5 w-5 text-yellow-500" />, text: "text-yellow-500" };
    case "processing":
      return { bg: "bg-blue-500/10", icon: <Clock className="h-5 w-5 text-blue-500" />, text: "text-blue-500" };
    case "delivered":
      return { bg: "bg-green-500/10", icon: <CheckCircle2 className="h-5 w-5 text-green-500" />, text: "text-green-500" };
    case "cancelled":
      return { bg: "bg-red-500/10", icon: <XCircle className="h-5 w-5 text-red-500" />, text: "text-red-500" };
    default:
      return { bg: "bg-gray-500/10", icon: <Clock className="h-5 w-5 text-gray-500" />, text: "text-gray-500" };
  }
};
