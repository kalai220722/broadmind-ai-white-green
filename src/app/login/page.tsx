"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Globe,
  Phone,
  Mail,
  Lock,
  User,
  Sparkles,
  Languages,
  Brain,
  Award,
  Zap,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import Logo from "@/components/Logo";
import { LANGUAGES } from "@/lib/constants";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import GradientOrbs from "@/components/ui/GradientOrbs";
import GlassCard from "@/components/ui/GlassCard";
import ShimmerButton from "@/components/ui/ShimmerButton";
import ThemeToggle from "@/components/ui/ThemeToggle";

type Method = "phone" | "email";
type Mode = "signin" | "signup";

const STATS = [
  { value: "16", label: "Modules", icon: Brain },
  { value: "22+", label: "Languages", icon: Languages },
  { value: "5", label: "AI Models", icon: Zap },
  { value: "100+", label: "Subjects", icon: Award },
];

export default function LoginPage() {
  const router = useRouter();
  const [method, setMethod] = useState<Method>("phone");
  const [mode, setMode] = useState<Mode>("signin");
  const [language, setLanguage] = useState("English");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const valid =
    method === "phone"
      ? phone.length >= 7
      : email.includes("@") && password.length >= 4 && (mode === "signin" || name.trim().length >= 2);

  const submit = async () => {
    if (!valid) {
      toast.error("Please fill all fields correctly");
      return;
    }
    setLoading(true);
    // simulate auth latency
    await new Promise((r) => setTimeout(r, 800));
    const user = {
      name: name.trim() || (email ? email.split("@")[0] : "Student"),
      email: email || null,
      phone: phone ? `${countryCode}${phone}` : null,
      language,
      loggedInAt: Date.now(),
    };
    localStorage.setItem("bm-user", JSON.stringify(user));
    toast.success(`Welcome${user.name ? `, ${user.name.split(" ")[0]}` : ""}! 🎉`);
    setLoading(false);
    router.push("/dashboard");
  };

  const guestLogin = () => {
    const user = {
      name: "Guest",
      email: null,
      phone: null,
      language,
      loggedInAt: Date.now(),
      guest: true,
    };
    localStorage.setItem("bm-user", JSON.stringify(user));
    toast.success("Continuing as guest");
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex">
      <AnimatedBackground density={70} />
      <GradientOrbs />

      {/* Theme toggle top-right */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        <Link
          href="/"
          className="hidden sm:flex items-center gap-1 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition"
        >
          ← Back to home
        </Link>
        <ThemeToggle />
      </div>

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center max-w-md"
        >
          <Logo size={84} showText={false} className="justify-center mb-6" />
          <h1 className="text-5xl font-bold mb-4">
            <span className="animate-gradient-text">BroadMind AI</span>
          </h1>
          <p className="text-lg text-slate-300 mb-10 leading-relaxed">
            The world&apos;s first unified AI learning platform.
            <br />
            Every level. Every discipline. 22+ languages.
          </p>

          {/* Animated stats */}
          <div className="grid grid-cols-2 gap-3">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <GlassCard className="p-4" hover={false}>
                  <s.icon size={18} className="text-violet-400 mb-1.5" />
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-400 mt-0.5">
                    {s.label}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10"
          >
            <Sparkles size={12} className="text-violet-300" />
            <span className="text-xs text-violet-200">Powered by Gemini · Claude · Groq</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <Logo size={48} />
          </div>

          <GlassCard className="p-7" glow>
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl font-bold text-white mb-1">
                  {mode === "signin" ? "Welcome back" : "Create account"}
                </h2>
                <p className="text-sm text-slate-400 mb-6">
                  {mode === "signin"
                    ? "Sign in to continue your learning journey"
                    : "Start your personalised AI learning journey"}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Language */}
            <div className="flex items-center gap-2 mb-5">
              <Globe size={14} className="text-slate-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 text-sm text-white rounded-lg px-3 py-2 outline-none focus:border-violet-500/50 cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang} className="bg-slate-900">
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Method tabs */}
            <div className="flex bg-white/5 rounded-lg p-1 mb-5">
              <button
                onClick={() => setMethod("phone")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                  method === "phone"
                    ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Phone size={14} />
                Phone
              </button>
              <button
                onClick={() => setMethod("email")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                  method === "email"
                    ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Mail size={14} />
                Email
              </button>
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${mode}-${method}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {mode === "signup" && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Full name</label>
                    <div className="relative">
                      <User
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                      />
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-violet-500/50 placeholder-slate-500"
                      />
                    </div>
                  </div>
                )}

                {method === "phone" ? (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Phone number</label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-2.5 text-sm text-white outline-none focus:border-violet-500/50 w-20 cursor-pointer"
                      >
                        <option value="+91" className="bg-slate-900">+91</option>
                        <option value="+1" className="bg-slate-900">+1</option>
                        <option value="+44" className="bg-slate-900">+44</option>
                        <option value="+971" className="bg-slate-900">+971</option>
                        <option value="+65" className="bg-slate-900">+65</option>
                      </select>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        placeholder="98765 43210"
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500/50 placeholder-slate-500"
                        onKeyDown={(e) => e.key === "Enter" && submit()}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">Email</label>
                      <div className="relative">
                        <Mail
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-violet-500/50 placeholder-slate-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">Password</label>
                      <div className="relative">
                        <Lock
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 4 characters"
                          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white outline-none focus:border-violet-500/50 placeholder-slate-500"
                          onKeyDown={(e) => e.key === "Enter" && submit()}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        >
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      {mode === "signin" && (
                        <button
                          onClick={() => toast("Reset link sent to your email", { icon: "📧" })}
                          className="text-[11px] text-violet-300 hover:text-violet-200 mt-1.5"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-5">
              <ShimmerButton
                onClick={submit}
                disabled={loading || !valid}
                size="lg"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    {method === "phone" ? "Sending OTP..." : "Signing in..."}
                  </>
                ) : (
                  <>
                    {mode === "signin"
                      ? method === "phone"
                        ? "Send OTP"
                        : "Sign in"
                      : "Create account"}
                    <ArrowRight size={14} />
                  </>
                )}
              </ShimmerButton>
            </div>

            {/* Divider */}
            <div className="my-5 flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] uppercase tracking-widest text-slate-500">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => toast("Google login coming soon", { icon: "🔧" })}
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-slate-200 transition"
              >
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                onClick={() => toast("WhatsApp login coming soon", { icon: "🔧" })}
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-slate-200 transition"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                WhatsApp
              </button>
            </div>

            {/* Guest */}
            <button
              onClick={guestLogin}
              className="w-full mt-3 text-center text-xs text-slate-400 hover:text-violet-300 py-2 transition"
            >
              Continue as guest →
            </button>

            {/* Mode toggle */}
            <div className="text-center mt-5 pt-5 border-t border-white/5">
              <span className="text-xs text-slate-500">
                {mode === "signin" ? "Don't have an account? " : "Already have one? "}
              </span>
              <button
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-xs text-violet-300 hover:text-violet-200 font-medium"
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </div>
          </GlassCard>

          <p className="text-center text-[10px] text-slate-500 mt-5 max-w-sm mx-auto">
            By continuing, you agree to BroadMind AI&apos;s Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
