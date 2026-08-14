import React from 'react';
import { LOGIN_URL } from '../api';

// Backend redirects here with ?auth_error=<reason> when a sign-in is refused.
// Anything unrecognised falls back to a generic message rather than showing the
// raw code to the user.
const ERROR_MESSAGES = {
    not_authorised: "That account isn't set up for COGNITO. Ask Ethan or Jack to add you.",
    state_mismatch: 'That sign-in attempt expired or was interrupted. Please try again.',
    google_failed: "Google couldn't complete the sign-in. Please try again.",
    cancelled: 'Sign-in was cancelled.',
};

const Login = () => {
    const authError = new URLSearchParams(window.location.search).get('auth_error');
    const message = authError
        ? ERROR_MESSAGES[authError] || 'Sign-in failed. Please try again.'
        : null;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans text-slate-900 px-6">
            <div className="w-full max-w-sm">
                <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-sm p-8 flex flex-col items-center text-center">
                    <img src="/tau-logo.png" alt="TAU Logo" className="h-10 w-auto object-contain" />

                    <h1 className="mt-5 text-xl font-extrabold text-slate-800 tracking-tight leading-none">
                        TAU <span className="text-indigo-600">COGNITO</span>
                    </h1>
                    <span className="mt-1 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                        Intelligence CRM
                    </span>

                    {message && (
                        <div
                            role="alert"
                            className="mt-6 w-full text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"
                        >
                            {message}
                        </div>
                    )}

                    <p className="mt-6 text-sm text-slate-500">
                        Sign in with your TAU Google account to continue.
                    </p>

                    {/* A plain link, not fetch(): the OAuth handshake is a full-page
                        navigation to Google and back. */}
                    <a
                        href={LOGIN_URL}
                        className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition-colors shadow-sm"
                    >
                        Sign in with Google
                    </a>
                </div>

                <p className="mt-4 text-center text-xs text-slate-400">
                    Access is limited to @taums.ai accounts.
                </p>
            </div>
        </div>
    );
};

export default Login;
