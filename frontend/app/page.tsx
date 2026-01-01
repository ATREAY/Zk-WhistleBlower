"use client";

import Link from "next/link";
import { ArrowRight, Shield, Lock, EyeOff, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-mono selection:bg-green-500 selection:text-black">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-gray-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">🤫</span>
            <span className="text-green-400 tracking-tighter">ZK-WHISTLE</span>
          </div>
          <Link href="/dashboard"> {/* Change this to wherever your main app lives */}
            <button className="px-5 py-2 text-sm font-bold bg-white text-black hover:bg-green-400 hover:text-black transition-colors rounded-sm">
              LAUNCH APP_
            </button>
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-150 h-150 bg-green-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block px-3 py-1 mb-6 border border-green-500/30 rounded-full bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-widest">
            Protocol Live on Sepolia
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Speak Truth. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-600">
              Stay Invisible.
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            The first decentralized whistleblower platform powered by <span className="text-white font-bold">Zero-Knowledge Proofs</span>. 
            Prove your membership without revealing your identity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <button className="px-8 py-4 bg-green-500 text-black font-bold text-lg hover:bg-green-400 transition-all flex items-center gap-2 rounded-sm group">
                START WHISTLEBLOWING
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <a href="https://github.com/YourUsername/ZK-Whistle" target="_blank" className="px-8 py-4 border border-gray-700 text-gray-300 font-bold text-lg hover:border-white hover:text-white transition-all rounded-sm">
              VIEW GITHUB
            </a>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-20 bg-slate-900/50 border-y border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 border border-gray-800 bg-slate-950 hover:border-green-500/50 transition-colors group">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform">
                <EyeOff size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">True Anonymity</h3>
              <p className="text-gray-400 leading-relaxed">
                Powered by Semaphore Protocol. We cryptographically prove you are a group member without ever revealing <em>which</em> member.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 border border-gray-800 bg-slate-950 hover:border-red-500/50 transition-colors group">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6 text-red-400 group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Uncensorable</h3>
              <p className="text-gray-400 leading-relaxed">
                Evidence is stored on IPFS (InterPlanetary File System). No central server can delete or alter your report once posted.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 border border-gray-800 bg-slate-950 hover:border-blue-500/50 transition-colors group">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Gasless Reporting</h3>
              <p className="text-gray-400 leading-relaxed">
                Our relayer handles the gas fees. Your personal wallet address is never linked to the whistleblower transaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-center border-b border-gray-800 pb-4">
            <span className="text-green-400">01.</span> HOW IT WORKS
          </h2>

          <div className="space-y-12 relative before:absolute before:left-4 md:before:left-1/2 before:h-full before:w-px before:bg-gray-800">
            
            {/* Step 1 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
              <div className="md:w-1/2 md:text-right order-2 md:order-1">
                <h3 className="text-xl font-bold text-white mb-2">Generate Identity</h3>
                <p className="text-gray-400">Create a secret identity locally in your browser. It never leaves your device.</p>
              </div>
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-950 border-2 border-green-500 rounded-full z-10"></div>
              <div className="md:w-1/2 pl-12 md:pl-0 order-1 md:order-2">
                <div className="p-4 bg-slate-900 border border-gray-800 rounded text-xs text-green-400 font-mono">
                  &gt; Identity Commitment Created... OK
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
              <div className="md:w-1/2 md:text-right order-2 md:order-1">
                <div className="p-4 bg-slate-900 border border-gray-800 rounded text-xs text-blue-400 font-mono">
                  &gt; ZK-Proof Generating... 100%
                </div>
              </div>
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-950 border-2 border-blue-500 rounded-full z-10"></div>
              <div className="md:w-1/2 pl-12 md:pl-0 order-1 md:order-2">
                <h3 className="text-xl font-bold text-white mb-2">Create Proof</h3>
                <p className="text-gray-400">Upload evidence. The system generates a Zero-Knowledge proof that you belong to the group.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
              <div className="md:w-1/2 md:text-right order-2 md:order-1">
                <h3 className="text-xl font-bold text-white mb-2">Relay to Blockchain</h3>
                <p className="text-gray-400">Our relayer submits the proof. The network verifies it, and your report is live—completely anonymous.</p>
              </div>
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-950 border-2 border-red-500 rounded-full z-10"></div>
              <div className="md:w-1/2 pl-12 md:pl-0 order-1 md:order-2">
                <div className="p-4 bg-slate-900 border border-gray-800 rounded text-xs text-red-400 font-mono">
                  &gt; Transaction Confirmed. <br/> &gt; Status: Anonymous
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 border-t border-gray-900 text-center text-gray-500 text-sm">
        <p>Built for IITH Blockchain Hackathon 🚀</p>
        <p className="mt-2">ZK-Whistle &copy; 2026</p>
      </footer>

    </div>
  );
}