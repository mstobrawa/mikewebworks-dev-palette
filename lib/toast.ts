export type ToastDetail = {
  message: string;
};

export function showToast(message: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<ToastDetail>("app:toast", {
      detail: { message },
    }),
  );
}
