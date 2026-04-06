// ─── Onigiri.Z Auth Page · Entry Point ───

import './style.css';
import { getToken, saveSession, toast } from './shared';
import type { AuthResponse } from './shared';

// ─── Redirect if already logged in ───
if (getToken()) {
  window.location.href = '/index.html';
}

// ─── DOM ───
const $form = document.getElementById('auth-form') as HTMLFormElement;
const $loginTab = document.getElementById('login-tab') as HTMLButtonElement;
const $registerTab = document.getElementById('register-tab') as HTMLButtonElement;
const $usernameGroup = document.getElementById('username-group') as HTMLDivElement;
const $usernameInput = document.getElementById('username') as HTMLInputElement;
const $submitBtn = document.getElementById('auth-submit') as HTMLButtonElement;

let mode: 'login' | 'register' = 'login';

// ─── Tab Switching ───
function switchMode(m: 'login' | 'register') {
  mode = m;
  if (m === 'login') {
    $loginTab.classList.add('active');
    $registerTab.classList.remove('active');
    $submitBtn.textContent = 'Sign In';
    $usernameGroup.classList.add('hidden');
    $usernameInput.removeAttribute('required');
  } else {
    $loginTab.classList.remove('active');
    $registerTab.classList.add('active');
    $submitBtn.textContent = 'Create Account';
    $usernameGroup.classList.remove('hidden');
    $usernameInput.setAttribute('required', 'true');
  }
}

$loginTab.addEventListener('click', () => switchMode('login'));
$registerTab.addEventListener('click', () => switchMode('register'));

// ─── Form Submit ───
$form.addEventListener('submit', async (e) => {
  e.preventDefault();
  $submitBtn.disabled = true;

  const email = (document.getElementById('email') as HTMLInputElement).value;
  const username = (document.getElementById('username') as HTMLInputElement).value;
  const password = (document.getElementById('password') as HTMLInputElement).value;
  const endpoint = mode === 'login' ? '/api/login' : '/api/register';

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || 'Authentication failed');
    }

    if (mode === 'register') {
      toast('Account created! Please sign in.', 'success');
      switchMode('login');
      return;
    }

    const data: AuthResponse = await res.json();
    saveSession(data.token, data.username, data.wallet_address);

    toast('Login successful! Redirecting…', 'success');
    setTimeout(() => {
      window.location.href = '/index.html';
    }, 800);
  } catch (e) {
    toast((e as Error).message, 'error');
  } finally {
    $submitBtn.disabled = false;
  }
});
