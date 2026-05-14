import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { useToastStore } from "../../store/toastStore";

export default function ToastContainer() {
  const { toasts, dismissToast } = useToastStore();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const Icon = isSuccess ? CheckCircle2 : AlertCircle;

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-2xl backdrop-blur-md ${
              isSuccess
                ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100"
                : "border-red-400/30 bg-red-500/15 text-red-100"
            }`}
          >
            <Icon className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={2} />
            <p className="min-w-0 flex-1 text-sm leading-5">{toast.message}</p>
            <button
              type="button"
              className="rounded p-0.5 text-current opacity-70 transition hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gold-400"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
