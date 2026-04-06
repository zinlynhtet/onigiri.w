// ─── Wallet Module: Balance, QR, Copy ───

import QRCode from 'qrcode';
import { toast, API_BASE } from '../../shared';
import type { BalanceResponse } from '../../shared';

export function initWallet(walletAddress: string) {
  const $balanceAmount = document.getElementById('balance-amount') as HTMLSpanElement;
  const $balSent = document.getElementById('bal-sent') as HTMLElement;
  const $balRecv = document.getElementById('bal-recv') as HTMLElement;
  const $qrCanvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
  const $fullWalletAddr = document.getElementById('full-wallet-addr') as HTMLElement;
  const $copyAddrBtn = document.getElementById('copy-addr-btn') as HTMLButtonElement;

  // Display full wallet address
  $fullWalletAddr.textContent = walletAddress;

  // Generate QR Code
  QRCode.toCanvas($qrCanvas, walletAddress, {
    width: 80,
    margin: 1,
    color: { dark: '#e84545', light: '#ffffff' },
  });

  // Copy to clipboard
  $copyAddrBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(walletAddress).then(() => {
      toast('Wallet address copied!', 'success');
      $copyAddrBtn.textContent = '✅';
      setTimeout(() => ($copyAddrBtn.textContent = '📋'), 2000);
    });
  });

  // fetchBalance function
  async function fetchBalance() {
    try {
      const res = await fetch(`${API_BASE}/api/balance/${walletAddress}`);
      if (!res.ok) return;
      const data: BalanceResponse = await res.json();
      $balanceAmount.textContent = data.balance.toFixed(2);
      $balSent.textContent = data.sent.toFixed(2);
      $balRecv.textContent = data.received.toFixed(2);
    } catch (e) {
      console.error('Balance fetch error:', e);
    }
  }

  return { fetchBalance };
}
