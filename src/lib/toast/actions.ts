import { State } from "@/types/state";
import { toast, TypeOptions } from "react-toastify";

export function updateToast(state: State) {
  if (!state.toastId) return;

  toast.update(state.toastId, {
    render: state.message,
    type: state.status as TypeOptions,
    autoClose: 1500,
    closeButton: true,
    isLoading: false,
  });
}
