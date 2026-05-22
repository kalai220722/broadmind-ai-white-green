"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { LANGUAGES } from "@/lib/constants";
import { ArrowRight, Globe, Phone, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [language, setLanguage] = useState("English");

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950 flex-col items-center justify-center p-12">
        <div className="relative z-10 text-center">
          <Logo size={80} showText={false} className="justify-center mb-8" />
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              BroadMind AI
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-md mx-auto mb-8">
            The world&apos;s first unified AI learning platform. Every level. Every discipline. 22+ languages.
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {[
              { label: "10", sub: "Modules" },
              { label: "22+", sub: "Languages" },
              { label: "100+", sub: "Disciplines" },
            ].map((stat) => (
              <div key={stat.sub} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.label}</p>
                <p className="text-xs text-slate-400">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute -top-40 -left-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Logo size={48} />
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Sign in to learn</h2>
          <p className="text-sm text-slate-400 mb-8">
            Start your personalised AI learning journey
          </p>

          {/* Language selector */}
          <div className="flex items-center gap-2 mb-6">
            <Globe size={16} className="text-slate-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-900 text-sm text-white border border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:border-violet-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Login method tabs */}
          <div className="flex bg-slate-900 rounded-lg p-1 mb-6">
            <button
              onClick={() => setMethod("phone")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors ${
                method === "phone"
                  ? "bg-violet-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Phone size={16} />
              Phone
            </button>
            <button
              onClick={() => setMethod("email")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors ${
                method === "email"
                  ? "bg-violet-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Mail size={16} />
              Email
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {method === "phone" ? (
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Phone number</label>
                <div className="flex gap-2">
                  <select className="bg-slate-900 text-white border border-slate-700 rounded-lg px-3 py-3 text-sm outline-none focus:border-violet-500 w-24">
                    <option>+91</option>
                    <option>+1</option>
                    <option>+44</option>
                    <option>+971</option>
                    <option>+65</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    className="flex-1 bg-slate-900 text-white border border-slate-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-violet-500 placeholder-slate-500"
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-violet-500 placeholder-slate-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-violet-500 placeholder-slate-500"
                    />
                  </div>
                </div>
              </>
            )}

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium py-3 rounded-lg transition-all text-sm"
            >
              {method === "phone" ? "Send OTP" : "Sign in"}
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-500">or continue with</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-900 transition-colors">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-900 transition-colors">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              WhatsApp
            </button>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            By continuing, you agree to BroadMind AI&apos;s Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
