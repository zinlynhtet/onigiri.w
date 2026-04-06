// ─── Transaction Module: Send OGZ ───

import { api, toast, API_BASE } from '../../shared';

export function initTransactions(walletAddress: string, onSent: () => void) {
  const $txForm = document.getElementById('tx-form') as HTMLFormElement;
  const senderInput = document.getElementById('sender') as HTMLInputElement;

  senderInput.value = walletAddress;
  senderInput.readOnly = true;

  $txForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $txForm.querySelector('button') as HTMLButtonElement;
    btn.disabled = true;

    const payload = {
      sender: senderInput.value,
      receiver: (document.getElementById('receiver') as HTMLInputElement).value,
      amount: parseFloat((document.getElementById('amount') as HTMLInputElement).value),
    };

    try {
      const res = await api(`${API_BASE}/api/transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Transaction failed');
      }

      toast('Transaction queued successfully!', 'success');
      $txForm.reset();
      senderInput.value = walletAddress;
      onSent();
    } catch (e) {
      toast((e as Error).message, 'error');
    } finally {
      btn.disabled = false;
    }
  });
}
