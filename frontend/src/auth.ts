import './style.css';
import { getToken, saveSession, toast } from './shared';
import type { AuthResponse } from './shared';

// ─── Redirect if already logged in ───
// We only do this on login and signup, not necessarily on forgot/reset since they might be logged out anyway.
if (getToken() && (document.getElementById('login-form') || document.getElementById('signup-form'))) {
  window.location.href = '/index.html';
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

async function apiRequest(endpoint: string, payload: any, successMsg: string, successCallback: (data?: any) => void) {
    const $submitBtn = document.getElementById('auth-submit') as HTMLButtonElement;
    if ($submitBtn) $submitBtn.disabled = true;

    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(errText || 'Request failed');
        }

        toast(successMsg, 'success');
        
        // Wait slightly for toast animation
        setTimeout(async () => {
             // For responses that return JSON (like login)
            let data = null;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                // we only attempt json parse if the stream wasn't consumed. fetch clones if needed but we just trust it here
                // Wait, if res is already ok, let's just let the callback handle json if it needs it.
            }
            // For simplicity, we just pass the raw response to the callback so it can parse it
            successCallback(res);
        }, 800);
        
    } catch (e) {
        toast((e as Error).message, 'error');
    } finally {
        if ($submitBtn) $submitBtn.disabled = false;
    }
}

// 1. Login Logic
if ($loginForm) {
    $loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        
        apiRequest('/api/login', { email, password }, 'Login successful! Redirecting…', async (res: Response) => {
            const data: AuthResponse = await res.json();
            saveSession(data.token, data.username, data.wallet_address);
            window.location.href = '/index.html';
        });
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
            window.location.href = '/login.html';
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
        // Extract token from URL ?token=XYZ
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (!token) {
            toast('Invalid or missing reset token in URL.', 'error');
            return;
        }

        const password = (document.getElementById('password') as HTMLInputElement).value;
        
        apiRequest('/api/reset-password', { token, new_password: password }, 'Password successfully reset! Please log in.', () => {
            window.location.href = '/login.html';
        });
    });
}
