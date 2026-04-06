// ─── Onigiri.Z Dashboard · Entry Point ───
// Modular Monolith: each feature lives in its own module under /modules/.
// This file orchestrates module initialization & inter-module communication.

import './style.css';
import { getSession, clearSession, requireAuth, navigateTo } from './shared';
import { initWallet } from './modules/wallet';
import { initExplorer } from './modules/blockchain';
import { initMining } from './modules/mining';
import { initTransactions } from './modules/transactions';

// ─── Auth Guard: Protect dashboard from unauthenticated access ───
requireAuth();

const session = getSession();
if (!session.token || !session.username || !session.wallet) {
  clearSession();
  navigateTo('login.html');
  throw new Error('Not authenticated');
}

const { username, wallet: walletAddress } = session;

// ─── Header Profile ───
(document.getElementById('display-user') as HTMLSpanElement).textContent = username;
(document.getElementById('display-wallet') as HTMLSpanElement).textContent =
  walletAddress!.substring(0, 14) + '…';

// ─── Initialize Modules ───
const wallet = initWallet(walletAddress!);
const explorer = initExplorer();

function refreshAll() {
  explorer.fetchBlockchain();
  mining.fetchMempool();
  wallet.fetchBalance();
}

const mining = initMining(refreshAll);
initTransactions(walletAddress!, () => {
  mining.fetchMempool();
  wallet.fetchBalance();
});

// ─── Global Controls ───
document.getElementById('refresh-btn')!.addEventListener('click', refreshAll);
document.getElementById('logout-btn')!.addEventListener('click', () => {
  clearSession();
  navigateTo('login.html');
});

// ─── Boot ───
setInterval(() => {
  mining.fetchMempool();
  wallet.fetchBalance();
}, 10000);

refreshAll();
