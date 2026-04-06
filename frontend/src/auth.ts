import './style.css';
import { redirectIfAuthenticated, saveSession, toast, navigateTo, API_BASE } from './shared';
import type { AuthResponse } from './shared';

// ─── Route Guard: Redirect logged-in users away from login/signup ───
if (document.getElementById('login-form') || document.getElementById('signup-form')) {
  redirectIfAuthenticated();
}

// ─── Password Visibility Toggle ───
const $togglePwd = document.getElementById('toggle-pwd') as HTMLButtonElement;
const $pwdInput = document.getElementById('password') as HTMLInputElement;

const eyeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`;
const eyeOffSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>`;

if ($togglePwd && $pwdInput) {
    $togglePwd.addEventListener('click', () => {
        const type = $pwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
        $pwdInput.setAttribute('type', type);
        $togglePwd.innerHTML = type === 'password' ? eyeSvg : eyeOffSvg; 
    });
}

// ─── Form Handling ───
const $loginForm = document.getElementById('login-form') as HTMLFormElement;
const $signupForm = document.getElementById('signup-form') as HTMLFormElement;
const $forgotForm = document.getElementById('forgot-form') as HTMLFormElement;
const $resetForm = document.getElementById('reset-form') as HTMLFormElement;

/**
 * Generic API request handler.
 * Fixed: parses response body ONCE, then passes parsed data to callback.
 */
async function apiRequest(
    endpoint: string,
    payload: any,
    successMsg: string,
    successCallback: (data?: any) => void,
    expectJson: boolean = false
) {
    const $submitBtn = document.getElementById('auth-submit') as HTMLButtonElement;
    if ($submitBtn) {
        $submitBtn.disabled = true;
        $submitBtn.classList.add('loading');
    }

    try {
        const fullUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
        const res = await fetch(fullUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(errText || 'Request failed');
        }

        // Parse the response body ONCE here, before showing toast
        let data = null;
        if (expectJson) {
            data = await res.json();
        }

        toast(successMsg, 'success');

        // Small delay for toast animation, then run callback with parsed data
        setTimeout(() => {
            successCallback(data);
        }, 800);
        
    } catch (e) {
        toast((e as Error).message, 'error');
    } finally {
        if ($submitBtn) {
            $submitBtn.disabled = false;
            $submitBtn.classList.remove('loading');
        }
    }
}

// 1. Login Logic
if ($loginForm) {
    $loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        
        apiRequest('/api/login', { email, password }, 'Login successful! Redirecting…', (data: AuthResponse) => {
            saveSession(data.token, data.username, data.wallet_address);
            navigateTo('index.html');
        }, true); // expectJson = true
    });
}

// 2. Signup Logic
if ($signupForm) {
    $signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        
        apiRequest('/api/register', { email, username, password }, 'Account created! Please log in.', () => {
            navigateTo('login.html');
        });
    });
}

// 3. Forgot Password Logic
if ($forgotForm) {
    $forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = (document.getElementById('email') as HTMLInputElement).value;
        
        apiRequest('/api/request-reset', { email }, 'If that email exists, a reset link has been sent.', () => {
            $forgotForm.reset();
        });
    });
}

// 4. Reset Password Logic
if ($resetForm) {
    $resetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (!token) {
            toast('Invalid or missing reset token in URL.', 'error');
            return;
        }

        const password = (document.getElementById('password') as HTMLInputElement).value;
        
        apiRequest('/api/reset-password', { token, new_password: password }, 'Password successfully reset! Please log in.', () => {
            navigateTo('login.html');
        });
    });
}
