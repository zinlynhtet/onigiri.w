// ─── Mining Module: Mempool + Mine Block ───

import { api, toast, API_BASE } from '../../shared';
import type { Transaction } from '../../shared';

export function initMining(onMined: () => void) {
  const $mempool = document.getElementById('mempool') as HTMLDivElement;
  const $mempoolCount = document.getElementById('mempool-count') as HTMLSpanElement;
  const $mineBtn = document.getElementById('mine-btn') as HTMLButtonElement;

  function renderMempool(txs: Transaction[]) {
    if (txs.length === 0) {
      $mempool.innerHTML = '<p class="empty">No pending transactions</p>';
      return;
    }
    $mempool.innerHTML = txs
      .map(
        (tx) => `
      <div class="mempool-tx">
        <div><strong>${tx.sender}</strong> → <strong>${tx.amount} OGZ</strong></div>
        <div class="sub">To: ${tx.receiver}</div>
      </div>`
      )
      .join('');
  }

  async function fetchMempool() {
    try {
      const res = await api(`${API_BASE}/api/mempool`);
      if (!res.ok) throw new Error('Failed to load mempool');
      const data: Transaction[] = await res.json();
      renderMempool(data);
      $mempoolCount.textContent = String(data.length);
      $mineBtn.classList.toggle('hidden', data.length === 0);
    } catch (e) {
      console.error(e);
    }
  }

  $mineBtn.addEventListener('click', async () => {
    const mineText = $mineBtn.querySelector('.mine-text') as HTMLSpanElement;
    const spinner = $mineBtn.querySelector('.spinner') as HTMLSpanElement;

    $mineBtn.disabled = true;
    mineText.textContent = 'Mining… (PoW)';
    spinner.classList.add('active');

    try {
      const res = await api(`${API_BASE}/api/mine`, { method: 'POST' });
      if (!res.ok) throw new Error('Mining failed');
      toast('Block mined successfully! ⛏️', 'success');
      onMined();
    } catch (e) {
      toast((e as Error).message, 'error');
    } finally {
      $mineBtn.disabled = false;
      mineText.textContent = '⛏️ Mine Block';
      spinner.classList.remove('active');
    }
  });

  return { fetchMempool };
}
