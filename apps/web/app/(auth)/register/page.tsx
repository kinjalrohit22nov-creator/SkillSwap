"use client"

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated registration success
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-6 relative selection:bg-[#F59E0B]/30">
      {/* Decorative Glow blobs */}
      <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] rounded-full bg-[#F59E0B]/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-[#10B981]/5 blur-[100px] pointer-events-none" />

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-8 max-w-md w-full shadow-2xl relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#F59E0B] to-[#10B981] flex items-center justify-center font-bold text-black text-sm">
            ◈
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white">
            Skill<span className="text-[#F59E0B]">Swap</span>
          </span>
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight mb-2">Create Account</h1>
        <p className="text-[#737373] text-xs mb-6">Enter your details below to establish your new peer-to-peer swapping credentials.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-extrabold text-[#737373] mb-2 tracking-wider">Full Name</label>
            <input
              required
              type="text"
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-extrabold text-[#737373] mb-2 tracking-wider">Email Address</label>
            <input
              required
              type="email"
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-extrabold text-[#737373] mb-2 tracking-wider">Secure Password</label>
            <input
              required
              type="password"
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#F59E0B] hover:bg-amber-500 text-black font-extrabold rounded-xl py-3.5 text-sm transition shadow-lg shadow-[#F59E0B]/10 mt-6"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-xs text-[#737373] mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#F59E0B] font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
