// ─── Blockchain Explorer Module ───

import type { Block, Transaction } from '../../shared';
import { toast } from '../../shared';

export function initExplorer() {
  const $blocks = document.getElementById('blocks') as HTMLDivElement;
  const $totalBlocks = document.getElementById('total-blocks') as HTMLSpanElement;

  function renderBlocks(blocks: Block[]) {
    $blocks.innerHTML = '';
    blocks
      .slice()
      .reverse()
      .forEach((b) => {
        const isGenesis = b.data[0]?.is_genesis;
        const time = new Date(b.timestamp).toLocaleString();

        const txHtml = b.data
          .map(
            (tx: Transaction) => `
          <div class="tx-item">
            <div class="tx-row">
              <span><span class="tx-label">From:</span> <span class="tx-val">${tx.sender}</span></span>
              <span class="tx-amount">${tx.amount} OGZ</span>
            </div>
            <div class="tx-row">
              <span><span class="tx-label">To:</span> <span class="tx-val">${tx.receiver}</span></span>
            </div>
          </div>`
          )
          .join('');

        const el = document.createElement('div');
        el.className = 'block';
        el.innerHTML = `
          <div class="block-top">
            <span class="block-num">BLOCK #${b.position}${isGenesis ? '<span class="genesis-tag">GENESIS</span>' : ''}</span>
            <span class="block-time">${time}</span>
          </div>
          ${txHtml}
          <div class="hash-section">
            <div class="hash-label">Hash</div>
            <div class="hash-val">${b.hash}</div>
            <div class="hash-label">Previous Hash</div>
            <div class="hash-val">${b.prev_hash}</div>
            <div class="hash-label">Nonce: ${b.nonce}</div>
          </div>
        `;
        $blocks.appendChild(el);
      });
  }

  async function fetchBlockchain() {
    try {
      const res = await fetch('/api/blockchain');
      if (!res.ok) throw new Error('Failed to load blockchain');
      const data: Block[] = await res.json();
      renderBlocks(data);
      $totalBlocks.textContent = String(data.length);
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  }

  return { fetchBlockchain };
}
