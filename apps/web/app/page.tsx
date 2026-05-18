"use client"

import { useState } from 'react'
import Link from 'next/link'

interface Student {
  name: string;
  avatarColor: string;
  school: string;
  teaches: string[];
  wants: string[];
  rating: string;
}

const SIMULATED_PEERS: Student[] = [
  {
    name: 'Alice Vance',
    avatarColor: 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/45',
    school: 'Stanford University',
    teaches: ['React', 'Next.js', 'TypeScript'],
    wants: ['Python', 'Machine Learning'],
    rating: '4.9⭐',
  },
  {
    name: 'Marcus Chen',
    avatarColor: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/45',
    school: 'MIT',
    teaches: ['Python', 'Data Science', 'Machine Learning'],
    wants: ['React', 'UI/UX Design'],
    rating: '4.8⭐',
  },
  {
    name: 'Elena Rostova',
    avatarColor: 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/45',
    school: 'UC Berkeley',
    teaches: ['UI/UX Design', 'Figma', 'Product Management'],
    wants: ['Next.js', 'Node.js'],
    rating: '5.0⭐',
  },
  {
    name: 'Diana Prince',
    avatarColor: 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/45',
    school: 'Georgia Tech',
    teaches: ['Node.js', 'SQL', 'MongoDB'],
    wants: ['UI/UX Design', 'TypeScript'],
    rating: '4.7⭐',
  },
]

const ALL_SKILLS = [
  'React',
  'Next.js',
  'TypeScript',
  'Python',
  'Data Science',
  'Machine Learning',
  'UI/UX Design',
  'Node.js',
  'SQL',
]

export default function Home() {
  // Simulator State
  const [userTeaches, setUserTeaches] = useState('React')
  const [userWants, setUserWants] = useState('Python')
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null)

  // Find simulated matches based on user selection
  const findMatches = () => {
    return SIMULATED_PEERS.map(peer => {
      // Calculate matching score
      let score = 0
      let matchType: 'perfect' | 'teaches' | 'wants' | 'none' = 'none'

      const isTeachMatch = peer.wants.includes(userTeaches) // peer wants what user teaches
      const isLearnMatch = peer.teaches.includes(userWants) // peer teaches what user wants

      if (isTeachMatch && isLearnMatch) {
        score = 100
        matchType = 'perfect'
      } else if (isLearnMatch) {
        score = 60
        matchType = 'teaches'
      } else if (isTeachMatch) {
        score = 40
        matchType = 'wants'
      }

      return { peer, score, matchType }
    })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
  }

  const matches = findMatches()

  const faqs = [
    {
      q: 'How does the token economy work?',
      a: 'When you teach a skill, you earn 1 token per 30 minutes of session. You can then use this token to book a 30-minute learning session with any other student. No money changes hands!',
    },
    {
      q: 'Are the video calls built-in?',
      a: 'Yes! SkillSwap features full, high-definition P2P WebRTC video calls with built-in shared code editors, whiteboards, real-time messaging, and shared collaborative notes.',
    },
    {
      q: 'Can I purchase tokens if I do not have time to teach?',
      a: 'Yes, if you need to learn instantly but do not have time to host a session, you can top-up your wallet using our integrated Stripe payment system.',
    },
    {
      q: 'Is my data secure?',
      a: 'Absolutely. All authentication is handled securely, video sessions are peer-to-peer, and ratings are verified through real-time blockchain-inspired session logs.',
    },
  ]

  return (
    <main className="min-h-screen bg-[#0D0D0D] overflow-x-hidden selection:bg-[#F59E0B]/30">
      {/* Decorative Grid & Glow Backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden opacity-30 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#F59E0B]/10 blur-[120px]" />
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#10B981]/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#2A2A2A] bg-[#0D0D0D]/75 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#F59E0B] to-[#10B981] flex items-center justify-center font-bold text-black text-lg shadow-lg shadow-[#F59E0B]/10">
              ◈
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-[#F5F5F5] to-[#737373] bg-clip-text text-transparent">
              Skill<span className="text-[#F59E0B]">Swap</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#737373]">
            <a href="#features" className="hover:text-[#F5F5F5] transition">Features</a>
            <a href="#simulator" className="hover:text-[#F5F5F5] transition">Match Simulator</a>
            <a href="#faqs" className="hover:text-[#F5F5F5] transition">FAQs</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="px-4 py-2 text-sm font-semibold text-[#737373] hover:text-[#F5F5F5] transition">
              Sign In
            </Link>
            <Link href="/register" className="px-4 py-2 text-sm font-semibold bg-[#F59E0B] text-black rounded-lg hover:brightness-110 active:scale-95 transition shadow-lg shadow-[#F59E0B]/20">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2A2A2A] bg-[#141414]/90 text-xs font-semibold text-[#F59E0B] mb-8 animate-pulse shadow-inner shadow-[#F59E0B]/5">
          <span>✨</span> The Peer-to-Peer Learning Revolution
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
          Teach what you know.<br />
          <span className="bg-gradient-to-r from-[#F59E0B] via-amber-300 to-[#10B981] bg-clip-text text-transparent">
            Learn what you need.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-[#737373] max-w-2xl mx-auto mb-10 leading-relaxed">
          Welcome to SkillSwap — exchange high-value skills with student peers using a token-based economy. No money involved, just collaborative growth.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#F59E0B] to-amber-500 text-black font-bold rounded-xl hover:brightness-110 active:scale-98 transition shadow-lg shadow-[#F59E0B]/25 text-center">
            Start Swapping Now
          </Link>
          <a href="#simulator" className="w-full sm:w-auto px-8 py-4 border border-[#2A2A2A] bg-[#141414]/60 text-[#F5F5F5] font-bold rounded-xl hover:bg-[#1C1C1C] hover:border-[#F59E0B]/50 transition text-center backdrop-blur-sm">
            Try Match Simulator
          </a>
        </div>

        {/* Dashboard Preview UI Mockup */}
        <div className="relative max-w-5xl mx-auto rounded-2xl border border-[#2A2A2A] bg-[#141414]/80 p-2 shadow-2xl shadow-black/80 backdrop-blur-md">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-[#F59E0B]/10 to-[#10B981]/10 opacity-30 blur-md -z-10" />
          <div className="rounded-xl overflow-hidden border border-[#2A2A2A] bg-[#0D0D0D]">
            {/* Top Bar of Mockup */}
            <div className="h-12 border-b border-[#2A2A2A] bg-[#141414] px-6 flex items-center justify-between text-xs text-[#737373]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="font-mono bg-[#0D0D0D] px-4 py-1 rounded-md border border-[#2A2A2A]">skillswap.app/dashboard</span>
              <span className="w-12 h-2 rounded bg-[#2A2A2A]" />
            </div>

            {/* Content area of Mockup */}
            <div className="p-8 text-left grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 border-r border-[#2A2A2A]/50 pr-4 space-y-4">
                <div className="bg-[#141414] rounded-xl p-4 border border-[#2A2A2A]">
                  <p className="text-[#737373] text-[10px] uppercase font-bold tracking-wider mb-1">Wallet Balance</p>
                  <p className="text-2xl font-black text-[#F59E0B] font-mono">◈ 48.00</p>
                  <div className="w-full bg-[#2A2A2A] h-1 rounded-full mt-3 overflow-hidden">
                    <div className="bg-[#F59E0B] w-3/4 h-full" />
                  </div>
                </div>

                <div className="bg-[#141414] rounded-xl p-4 border border-[#2A2A2A] space-y-2.5">
                  <div className="w-full h-8 rounded bg-[#1C1C1C] border border-[#2A2A2A] flex items-center px-3 text-xs text-[#F5F5F5] font-semibold gap-2">
                    <span className="text-[#10B981]">✔</span> Matches Enabled
                  </div>
                  <div className="w-full h-8 rounded bg-[#1C1C1C] border border-[#2A2A2A] flex items-center px-3 text-xs text-[#737373] gap-2">
                    <span>🗓</span> Schedule Bookings
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Recommended Peers</h3>
                  <span className="text-xs text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-full border border-[#10B981]/20 font-semibold">4 New Matches</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-5 hover:border-[#F59E0B]/30 transition group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F59E0B] to-amber-300 flex items-center justify-center font-bold text-black text-sm">
                          AV
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm group-hover:text-[#F59E0B] transition">Alice Vance</h4>
                          <p className="text-[11px] text-[#737373]">Stanford University</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-400">4.9⭐</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-[#10B981] block">Teaches</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-[10px] bg-[#10B981]/10 text-[#10B981] px-2 py-0.5 rounded border border-[#10B981]/25">React</span>
                          <span className="text-[10px] bg-[#10B981]/10 text-[#10B981] px-2 py-0.5 rounded border border-[#10B981]/25">Next.js</span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full bg-[#1C1C1C] border border-[#2A2A2A] text-[#F5F5F5] group-hover:bg-[#F59E0B] group-hover:text-black rounded-lg py-2 text-xs font-semibold transition">
                      Request Swap
                    </button>
                  </div>

                  <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-5 hover:border-[#10B981]/30 transition group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#10B981] to-emerald-300 flex items-center justify-center font-bold text-black text-sm">
                          MC
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm group-hover:text-[#10B981] transition">Marcus Chen</h4>
                          <p className="text-[11px] text-[#737373]">MIT</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-400">4.8⭐</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-[#10B981] block">Teaches</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-[10px] bg-[#10B981]/10 text-[#10B981] px-2 py-0.5 rounded border border-[#10B981]/25">Python</span>
                          <span className="text-[10px] bg-[#10B981]/10 text-[#10B981] px-2 py-0.5 rounded border border-[#10B981]/25">Data Science</span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full bg-[#1C1C1C] border border-[#2A2A2A] text-[#F5F5F5] group-hover:bg-[#10B981] group-hover:text-black rounded-lg py-2 text-xs font-semibold transition">
                      Request Swap
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-[#2A2A2A]/40">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Everything you need for seamless learning exchanges
          </h2>
          <p className="text-[#737373] text-lg">
            SkillSwap is custom-engineered to make sharing knowledge instant, secure, and rewarding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#F59E0B]/40 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] text-xl font-bold mb-6 border border-[#F59E0B]/20">
                ⚡
              </div>
              <h3 className="text-lg font-bold mb-2">Smart Semantic Match</h3>
              <p className="text-[#737373] text-sm leading-relaxed">
                Our AI matchmaker aligns your expertise and desired skills perfectly using vector database embeddings.
              </p>
            </div>
            <span className="text-xs text-[#F59E0B] font-semibold mt-6 block">Learn more →</span>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#10B981]/40 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center text-[#10B981] text-xl font-bold mb-6 border border-[#10B981]/20">
                📹
              </div>
              <h3 className="text-lg font-bold mb-2">P2P HD Video Calls</h3>
              <p className="text-[#737373] text-sm leading-relaxed">
                Connect via custom WebRTC connections with real-time video, markdown notes, code-sharing, and interactive chat.
              </p>
            </div>
            <span className="text-xs text-[#10B981] font-semibold mt-6 block">Learn more →</span>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 hover:border-amber-400/40 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 text-xl font-bold mb-6 border border-amber-400/20">
                ◈
              </div>
              <h3 className="text-lg font-bold mb-2">Token-Based Wallet</h3>
              <p className="text-[#737373] text-sm leading-relaxed">
                An economy built on collaborative trust. Spend token credits on lessons; earn them back by teaching others.
              </p>
            </div>
            <span className="text-xs text-amber-400 font-semibold mt-6 block">Learn more →</span>
          </div>

          {/* Feature 4 */}
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 hover:border-emerald-400/40 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-400/10 flex items-center justify-center text-emerald-400 text-xl font-bold mb-6 border border-emerald-400/20">
                🧠
              </div>
              <h3 className="text-lg font-bold mb-2">AI-Generated Roadmaps</h3>
              <p className="text-[#737373] text-sm leading-relaxed">
                Get tailor-made learning pathways using cutting-edge LLMs to guide your skill development milestone-by-milestone.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-semibold mt-6 block">Learn more →</span>
          </div>
        </div>
      </section>

      {/* Simulator Section (Interactive Feature) */}
      <section id="simulator" className="relative z-10 max-w-5xl mx-auto px-6 py-24 border-t border-[#2A2A2A]/40">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-xs font-bold text-[#F59E0B] mb-4">
            Interactive Matcher
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Simulate Your Match
          </h2>
          <p className="text-[#737373]">
            Select what you can teach and what you want to learn to see live matches immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 space-y-6">
            <div>
              <label className="block text-xs uppercase font-extrabold tracking-wider text-[#737373] mb-3">
                I can teach:
              </label>
              <select
                value={userTeaches}
                onChange={(e) => setUserTeaches(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#F5F5F5] font-semibold focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none cursor-pointer"
              >
                {ALL_SKILLS.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase font-extrabold tracking-wider text-[#737373] mb-3">
                I want to learn:
              </label>
              <select
                value={userWants}
                onChange={(e) => setUserWants(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#F5F5F5] font-semibold focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none cursor-pointer"
              >
                {ALL_SKILLS.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-[#2A2A2A]/50">
              <Link href="/register" className="w-full inline-block text-center px-4 py-3 bg-[#F59E0B] text-black font-bold rounded-xl hover:brightness-110 active:scale-95 transition shadow-lg shadow-[#F59E0B]/10 text-sm">
                Connect Instantly
              </Link>
            </div>
          </div>

          {/* Simulated Matches Result */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm uppercase font-extrabold tracking-wider text-[#737373] mb-2 flex items-center gap-2">
              📊 Simulated Match Results ({matches.length})
            </h3>

            {matches.length === 0 ? (
              <div className="bg-[#141414] border border-dashed border-[#2A2A2A] rounded-2xl p-12 text-center text-[#737373]">
                <p className="text-lg font-bold mb-2 text-white">No perfect match found yet</p>
                <p className="text-sm">Try selecting different skills like React, Python, or UI/UX Design to find a mock connection!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.map(({ peer, matchType }) => (
                  <div
                    key={peer.name}
                    className={`bg-[#141414] border rounded-2xl p-5 hover:-translate-y-1 transition duration-300 flex flex-col justify-between ${
                      matchType === 'perfect' ? 'border-[#F59E0B]/50 shadow-lg shadow-[#F59E0B]/5' : 'border-[#2A2A2A]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border ${peer.avatarColor}`}>
                            {peer.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm">{peer.name}</h4>
                            <p className="text-[11px] text-[#737373]">{peer.school}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-amber-400">{peer.rating}</span>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-[#10B981] block">Teaches</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {peer.teaches.map(t => (
                              <span
                                key={t}
                                className={`text-[10px] px-2 py-0.5 rounded border ${
                                  t === userWants
                                    ? 'bg-[#10B981]/25 text-[#10B981] border-[#10B981]/50 font-bold'
                                    : 'bg-[#1C1C1C] text-[#737373] border-[#2A2A2A]'
                                }`}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] uppercase font-bold text-[#F59E0B] block">Wants</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {peer.wants.map(w => (
                              <span
                                key={w}
                                className={`text-[10px] px-2 py-0.5 rounded border ${
                                  w === userTeaches
                                    ? 'bg-[#F59E0B]/25 text-[#F59E0B] border-[#F59E0B]/50 font-bold'
                                    : 'bg-[#1C1C1C] text-[#737373] border-[#2A2A2A]'
                                }`}
                              >
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#2A2A2A]/40">
                      {matchType === 'perfect' ? (
                        <span className="text-[10px] font-extrabold text-[#F59E0B] tracking-wider uppercase bg-[#F59E0B]/10 px-2 py-1 rounded">
                          ✨ 100% Match
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-[#737373]">
                          Partial Match
                        </span>
                      )}
                      <Link href="/register" className="text-xs font-bold text-white hover:text-[#F59E0B] transition flex items-center gap-1 group">
                        Connect <span className="group-hover:translate-x-1 transition duration-200">→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section id="faqs" className="relative z-10 max-w-4xl mx-auto px-6 py-24 border-t border-[#2A2A2A]/40">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">Frequently Asked Questions</h2>
          <p className="text-[#737373]">Clear, transparent details about our peer-to-peer swapping mechanics.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#141414] border border-[#2A2A2A] rounded-xl overflow-hidden cursor-pointer hover:border-[#737373]/30 transition"
              onClick={() => setSelectedFaq(selectedFaq === idx ? null : idx)}
            >
              <div className="p-6 flex items-center justify-between">
                <span className="font-bold text-white pr-4">{faq.q}</span>
                <span className="text-[#737373] font-bold text-lg">
                  {selectedFaq === idx ? '−' : '+'}
                </span>
              </div>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  selectedFaq === idx ? 'max-h-40 border-t border-[#2A2A2A]/50' : 'max-h-0'
                }`}
              >
                <p className="p-6 text-sm text-[#737373] leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full-width Call To Action banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="relative rounded-3xl border border-[#2A2A2A] bg-gradient-to-br from-[#141414] to-[#0D0D0D] p-12 overflow-hidden shadow-2xl text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#F59E0B]/5 blur-[80px] pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
            Ready to expand your skillset?
          </h2>
          <p className="text-[#737373] max-w-xl mx-auto mb-8 text-base">
            Create an account today, post the skills you teach and need, and swap with high-caliber peers immediately.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-[#F59E0B] text-black font-extrabold rounded-xl hover:brightness-110 active:scale-95 transition shadow-lg shadow-[#F59E0B]/20">
              Create Account Free
            </Link>
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 border border-[#2A2A2A] bg-transparent text-white font-bold rounded-xl hover:bg-[#141414] transition">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#2A2A2A]/50 bg-[#0D0D0D] py-12 text-[#737373] text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-[#F59E0B] flex items-center justify-center font-bold text-black text-xs">
              ◈
            </div>
            <span className="font-extrabold text-white">SkillSwap</span>
          </div>

          <p className="text-xs">&copy; {new Date().getFullYear()} SkillSwap Inc. All rights reserved.</p>

          <div className="flex gap-6 text-xs">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#simulator" className="hover:text-white transition">Simulator</a>
            <a href="#faqs" className="hover:text-white transition">FAQs</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
