// ─── Shared Toast Notification ───

let $toast: HTMLDivElement | null = null;

function getToast(): HTMLDivElement {
  if (!$toast) {
    $toast = document.getElementById('toast') as HTMLDivElement;
  }
  return $toast;
}

export function toast(msg: string, type: 'success' | 'error') {
  const el = getToast();
  el.textContent = msg;
  el.className = `toast ${type} show`;
  setTimeout(() => el.classList.remove('show'), 4000);
}
