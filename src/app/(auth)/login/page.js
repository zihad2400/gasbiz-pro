'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { loginAction } from '@/actions/auth';
import { Lock, Mail, Loader2, Flame, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-surface-900">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-surface-800/80 backdrop-blur-xl border border-surface-700 rounded-2xl shadow-2xl p-8">
          
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="bg-brand-500/10 p-3 rounded-2xl mb-4">
              <Flame className="w-8 h-8 text-brand-500" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">GasBiz Pro</h1>
            <p className="text-sm text-slate-400 mt-2">Sign in to manage your business</p>
          </div>

          {state?.error && (
            <div className="mb-6 p-3 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20 text-center">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input type="email" name="email" required
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 placeholder-slate-500 outline-none transition" placeholder="admin@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-surface-900 border border-surface-700 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-200 placeholder-slate-500 outline-none transition" 
                  placeholder="••••••••" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isPending}
              className="w-full flex justify-center items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]">
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isPending ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-brand-500 hover:text-brand-400 font-medium transition">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
