import React, { useState } from 'react';
import { User, Mail, Lock, Facebook, Linkedin } from 'lucide-react';

/* ── Shared field styles ─────────────────────────────────────────────────── */
const inputClass =
  'w-full pl-9 pr-3 py-2.5 bg-teal-50 border border-teal-100 rounded text-sm ' +
  'text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300';

interface FieldProps {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
}
const Field: React.FC<FieldProps> = ({ icon, placeholder, type = 'text' }) => (
  <div className="relative mb-3">
    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
    <input type={type} placeholder={placeholder} className={inputClass} />
  </div>
);

/* ── Social button ───────────────────────────────────────────────────────── */
const SocialBtn: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition">
    {children}
  </button>
);

/* ── Main component ──────────────────────────────────────────────────────── */
export const LoginAndSignupSplitPanel: React.FC = () => {
  const [panel, setPanel] = useState<'signup' | 'signin'>('signup');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="relative flex w-full max-w-3xl min-h-[480px] rounded-2xl overflow-hidden shadow-2xl bg-white">

        {/* ── Decorative corner blobs ─────────────────────────────────── */}
        <span className="absolute top-0 right-0 w-20 h-20 bg-red-400 rounded-bl-full opacity-80 z-10" />
        <span className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400 rounded-tr-full opacity-80 z-10" />

        {/* ── Left panel ─────────────────────────────────────────────── */}
        <div className="relative w-2/5 bg-gradient-to-br from-teal-400 to-emerald-500 flex flex-col items-center justify-center p-8 text-white z-20">
          {/* diamond decorations */}
          <span className="absolute top-10 left-8 w-5 h-5 rotate-45 bg-white opacity-20" />
          <span className="absolute top-24 right-6 w-3 h-3 rotate-45 bg-white opacity-20" />
          <span className="absolute bottom-24 left-6 w-4 h-4 rotate-45 bg-white opacity-20" />
          <span className="absolute bottom-12 right-8 w-3 h-3 rotate-45 bg-white opacity-20" />

          <h2 className="text-3xl font-bold mb-3">Welcome Back!</h2>
          <p className="text-sm text-center opacity-90 mb-8 leading-relaxed">
            To keep connected with us please<br />login with your personal info
          </p>
          <button
            onClick={() => setPanel(panel === 'signup' ? 'signin' : 'signup')}
            className="border-2 border-white text-white font-semibold tracking-widest text-sm px-10 py-2.5 rounded-full hover:bg-white hover:text-teal-500 transition-all"
          >
            SIGN IN
          </button>
        </div>

        {/* ── Right panel ─────────────────────────────────────────────── */}
        <div className="w-3/5 flex flex-col items-center justify-center px-10 py-10 z-20">
          <h2 className="text-3xl font-bold text-teal-500 mb-5">Create Account</h2>

          {/* social buttons */}
          <div className="flex gap-3 mb-4">
            <SocialBtn><Facebook size={16} /></SocialBtn>
            <SocialBtn>
              {/* Google "G" — lucide-react doesn't ship a Google icon; use text */}
              <span className="text-sm font-bold text-red-500">G</span>
            </SocialBtn>
            <SocialBtn><Linkedin size={16} /></SocialBtn>
          </div>

          <p className="text-xs text-gray-400 mb-5">or use your email for registration:</p>

          <div className="w-full max-w-xs">
            <Field icon={<User size={14} />}  placeholder="Name" />
            <Field icon={<Mail size={14} />}  placeholder="Email" type="email" />
            <Field icon={<Lock size={14} />}  placeholder="Password" type="password" />

            <button className="w-full mt-3 py-2.5 bg-gradient-to-r from-teal-400 to-emerald-500 text-white font-semibold tracking-widest text-sm rounded-full hover:opacity-90 transition">
              SIGN UP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
