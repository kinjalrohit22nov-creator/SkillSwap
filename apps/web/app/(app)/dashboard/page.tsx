"use client"

import { useState } from 'react'
import Link from 'next/link'

interface Peer {
  id: number
  name: string
  avatarColor: string
  avatarInitials: string
  school: string
  teaches: string[]
  wants: string[]
  rating: string
}

interface Session {
  id: number
  peerName: string
  avatarInitials: string
  avatarColor: string
  skill: string
  time: string
  status: 'upcoming' | 'completed'
}

const PEERS_DATABASE: Peer[] = [
  {
    id: 1,
    name: 'Alice Vance',
    avatarInitials: 'AV',
    avatarColor: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    school: 'Stanford University',
    teaches: ['React', 'Next.js', 'TypeScript'],
    wants: ['Python', 'Machine Learning'],
    rating: '4.9⭐',
  },
  {
    id: 2,
    name: 'Marcus Chen',
    avatarInitials: 'MC',
    avatarColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    school: 'MIT',
    teaches: ['Python', 'Data Science', 'Machine Learning'],
    wants: ['React', 'UI/UX Design'],
    rating: '4.8⭐',
  },
  {
    id: 3,
    name: 'Elena Rostova',
    avatarInitials: 'ER',
    avatarColor: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    school: 'UC Berkeley',
    teaches: ['UI/UX Design', 'Figma', 'Product Management'],
    wants: ['Next.js', 'Node.js'],
    rating: '5.0⭐',
  },
  {
    id: 4,
    name: 'Diana Prince',
    avatarInitials: 'DP',
    avatarColor: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
    school: 'Georgia Tech',
    teaches: ['Node.js', 'SQL', 'MongoDB'],
    wants: ['UI/UX Design', 'TypeScript'],
    rating: '4.7⭐',
  },
  {
    id: 5,
    name: 'Zara Patel',
    avatarInitials: 'ZP',
    avatarColor: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
    school: 'Columbia University',
    teaches: ['Product Strategy', 'Growth Marketing'],
    wants: ['Data Science', 'Python'],
    rating: '4.9⭐',
  },
  {
    id: 6,
    name: 'Kenji Sato',
    avatarInitials: 'KS',
    avatarColor: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30',
    school: 'Waseda University',
    teaches: ['Japanese Speaking', 'Go (Golang)'],
    wants: ['React', 'Next.js'],
    rating: '4.6⭐',
  },
]

export default function DashboardPage() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'sessions' | 'wallet' | 'roadmap'>('overview')
  
  // Wallet / Financial State
  const [tokenBalance, setTokenBalance] = useState(48)
  const [walletLoading, setWalletLoading] = useState(false)
  
  // Sessions State
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 101,
      peerName: 'Alice Vance',
      avatarInitials: 'AV',
      avatarColor: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
      skill: 'React & App Architecture',
      time: 'Today, 4:00 PM (30 min)',
      status: 'upcoming',
    },
    {
      id: 102,
      peerName: 'Marcus Chen',
      avatarInitials: 'MC',
      avatarColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
      skill: 'Intro to Pandas & NumPy',
      time: 'Tomorrow, 10:30 AM (60 min)',
      status: 'upcoming',
    },
  ])

  // Modals & Popups
  const [bookingPeer, setBookingPeer] = useState<Peer | null>(null)
  const [bookingDate, setBookingDate] = useState('2026-05-20')
  const [bookingTime, setBookingTime] = useState('14:00')
  const [bookingDuration, setBookingDuration] = useState('30') // minutes
  const [callActiveSession, setCallActiveSession] = useState<Session | null>(null)
  
  // Roadmap Generator State
  const [roadmapQuery, setRoadmapQuery] = useState('')
  const [roadmapLoading, setRoadmapLoading] = useState(false)
  const [roadmapData, setRoadmapData] = useState<{
    title: string
    steps: { id: number; title: string; desc: string; completed: boolean }[]
  } | null>(null)

  // Notifications State
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    msg: '',
    type: 'success',
  })

  // Simulated Chat state inside WebRTC call
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'System', text: 'Securing P2P WebRTC Channel...', time: '12:00 PM' },
    { sender: 'System', text: 'Peer connected. Enjoy your session!', time: '12:01 PM' },
  ])
  const [newMessageText, setNewMessageText] = useState('')

  const triggerToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, msg, type })
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }))
    }, 4000)
  }

  // Handle Token Top-Up
  const handleTopUp = (amount: number) => {
    setWalletLoading(true)
    setTimeout(() => {
      setTokenBalance(prev => prev + amount)
      setWalletLoading(false)
      triggerToast(`Successfully top-up: Purchased ◈ ${amount} tokens via Stripe!`, 'success')
    }, 1500)
  }

  // Handle Booking Session
  const handleConfirmBooking = () => {
    if (!bookingPeer) return
    const cost = bookingDuration === '60' ? 2 : 1
    
    if (tokenBalance < cost) {
      triggerToast('Insufficient tokens! Please top-up or teach to earn tokens.', 'error')
      setBookingPeer(null)
      return
    }

    setTokenBalance(prev => prev - cost)
    const newSession: Session = {
      id: Date.now(),
      peerName: bookingPeer.name,
      avatarInitials: bookingPeer.avatarInitials,
      avatarColor: bookingPeer.avatarColor,
      skill: bookingPeer.teaches[0],
      time: `${bookingDate} at ${bookingTime} (${bookingDuration} min)`,
      status: 'upcoming',
    }

    setSessions(prev => [newSession, ...prev])
    triggerToast(`Successfully booked session with ${bookingPeer.name}! ◈ ${cost} Token spent.`, 'success')
    setBookingPeer(null)
  }

  // Handle Roadmap Generation Simulation
  const handleGenerateRoadmap = (e: React.FormEvent) => {
    e.preventDefault()
    if (!roadmapQuery.trim()) return
    setRoadmapLoading(true)
    setRoadmapData(null)

    setTimeout(() => {
      setRoadmapData({
        title: `AI Roadmap: Master ${roadmapQuery}`,
        steps: [
          { id: 1, title: 'Foundations & Prerequisites', desc: `Learn the structural syntax, basic theories, and underlying environment settings of ${roadmapQuery}.`, completed: false },
          { id: 2, title: 'Intermediate Execution', desc: 'Build hands-on modular applications, understand standard workflow practices, and explore libraries.', completed: false },
          { id: 3, title: 'State & Component Flow', desc: 'Deep dive into asynchronous processing, localized state models, and scalable architectures.', completed: false },
          { id: 4, title: 'Real-world Integration', desc: 'Deploy a live prototype, wire up secure API connections, and run robust unit tests.', completed: false },
        ],
      })
      setRoadmapLoading(false)
      triggerToast(`AI Roadmap generated for ${roadmapQuery}!`, 'success')
    }, 2000)
  }

  // Toggle Roadmap Step completed status
  const toggleRoadmapStep = (id: number) => {
    if (!roadmapData) return
    setRoadmapData({
      ...roadmapData,
      steps: roadmapData.steps.map(step => step.id === id ? { ...step, completed: !step.completed } : step),
    })
    triggerToast('Milestone status updated!', 'info')
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col md:flex-row relative selection:bg-[#F59E0B]/30">
      
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border shadow-2xl backdrop-blur-md animate-bounce ${
          toast.type === 'success' ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]' : 
          toast.type === 'error' ? 'bg-red-500/15 border-red-500/30 text-red-400' : 
          'bg-blue-500/15 border-blue-500/30 text-blue-400'
        }`}>
          <span className="text-lg">{toast.type === 'success' ? '✔' : toast.type === 'error' ? '✖' : 'ℹ'}</span>
          <span className="text-sm font-semibold">{toast.msg}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#2A2A2A] bg-[#141414]/90 backdrop-blur-md flex flex-col justify-between p-6 z-30 shrink-0">
        <div className="space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#F59E0B] to-[#10B981] flex items-center justify-center font-bold text-black text-lg">
              ◈
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Skill<span className="text-[#F59E0B]">Swap</span>
            </span>
          </Link>

          {/* User Mini Card */}
          <div className="bg-[#0D0D0D]/60 border border-[#2A2A2A] rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F59E0B]/20 to-[#10B981]/20 border border-[#2A2A2A] flex items-center justify-center font-bold text-[#F5F5F5] text-sm">
              ST
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Aakash Ranjan</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[#F59E0B] text-xs font-mono font-bold">◈ {tokenBalance}</span>
                <span className="text-[9px] bg-amber-500/15 text-amber-500 px-1.5 py-0.5 rounded font-extrabold">PRO</span>
              </div>
            </div>
          </div>

          {/* Menu Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-lg text-sm font-semibold transition ${
                activeTab === 'overview' ? 'bg-[#F59E0B] text-black shadow-lg shadow-[#F59E0B]/10' : 'text-[#737373] hover:bg-[#1C1C1C] hover:text-white'
              }`}
            >
              <span>📊</span> Overview
            </button>

            <button
              onClick={() => setActiveTab('matches')}
              className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-lg text-sm font-semibold transition ${
                activeTab === 'matches' ? 'bg-[#F59E0B] text-black shadow-lg shadow-[#F59E0B]/10' : 'text-[#737373] hover:bg-[#1C1C1C] hover:text-white'
              }`}
            >
              <span>🤝</span> Find Matches
            </button>

            <button
              onClick={() => setActiveTab('sessions')}
              className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-lg text-sm font-semibold transition ${
                activeTab === 'sessions' ? 'bg-[#F59E0B] text-black shadow-lg shadow-[#F59E0B]/10' : 'text-[#737373] hover:bg-[#1C1C1C] hover:text-white'
              }`}
            >
              <span>🗓</span> Active Sessions
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-lg text-sm font-semibold transition ${
                activeTab === 'wallet' ? 'bg-[#F59E0B] text-black shadow-lg shadow-[#F59E0B]/10' : 'text-[#737373] hover:bg-[#1C1C1C] hover:text-white'
              }`}
            >
              <span>◈</span> Token Wallet
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-lg text-sm font-semibold transition ${
                activeTab === 'roadmap' ? 'bg-[#F59E0B] text-black shadow-lg shadow-[#F59E0B]/10' : 'text-[#737373] hover:bg-[#1C1C1C] hover:text-white'
              }`}
            >
              <span>🧠</span> AI Roadmaps
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-[#2A2A2A]/50 mt-6">
          <Link
            href="/"
            className="flex items-center gap-3.5 px-4.5 py-3 rounded-lg text-sm font-semibold text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <span>🚪</span> Logout & Exit
          </Link>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 p-6 md:p-10 z-10 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Good morning, Aakash 👋</h1>
              <p className="text-[#737373] text-sm">Welcome back to your workspace. Here is your swapping stats for this week.</p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 relative overflow-hidden group hover:border-[#F59E0B]/50 transition duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#F59E0B]/5 rounded-full blur-xl group-hover:bg-[#F59E0B]/10 transition" />
                <p className="text-[#737373] text-xs font-bold uppercase tracking-wider mb-2">Token Balance</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#F59E0B] font-mono">◈ {tokenBalance}</span>
                  <span className="text-xs text-[#10B981] font-semibold">Active</span>
                </div>
                <button
                  onClick={() => setActiveTab('wallet')}
                  className="text-xs font-bold text-white hover:text-[#F59E0B] mt-4 flex items-center gap-1 group/btn"
                >
                  Buy or Topup <span className="group-hover/btn:translate-x-0.5 transition">→</span>
                </button>
              </div>

              <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 relative overflow-hidden group hover:border-[#10B981]/50 transition duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#10B981]/5 rounded-full blur-xl group-hover:bg-[#10B981]/10 transition" />
                <p className="text-[#737373] text-xs font-bold uppercase tracking-wider mb-2">Matches Found</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">12</span>
                  <span className="text-xs text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full border border-[#10B981]/20 font-bold">New Matches</span>
                </div>
                <button
                  onClick={() => setActiveTab('matches')}
                  className="text-xs font-bold text-white hover:text-[#10B981] mt-4 flex items-center gap-1 group/btn"
                >
                  Browse Swappers <span className="group-hover/btn:translate-x-0.5 transition">→</span>
                </button>
              </div>

              <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 relative overflow-hidden group hover:border-blue-400/50 transition duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition" />
                <p className="text-[#737373] text-xs font-bold uppercase tracking-wider mb-2">Sessions Active</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{sessions.length}</span>
                  <span className="text-xs text-[#737373] font-semibold">Scheduled</span>
                </div>
                <button
                  onClick={() => setActiveTab('sessions')}
                  className="text-xs font-bold text-white hover:text-blue-400 mt-4 flex items-center gap-1 group/btn"
                >
                  View Calendar <span className="group-hover/btn:translate-x-0.5 transition">→</span>
                </button>
              </div>

              <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 relative overflow-hidden group hover:border-purple-400/50 transition duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition" />
                <p className="text-[#737373] text-xs font-bold uppercase tracking-wider mb-2">Average Rating</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">4.8⭐</span>
                  <span className="text-xs text-amber-500 font-semibold">Top 5%</span>
                </div>
                <span className="text-xs text-[#737373] mt-4 block">24 completed reviews</span>
              </div>
            </div>

            {/* Layout Split: Quick Booking Matches & Next Session */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upcoming schedule block */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-lg text-white">Your Upcoming Swap Sessions</h3>
                  <button onClick={() => setActiveTab('sessions')} className="text-xs font-bold text-[#F59E0B] hover:underline">
                    View all
                  </button>
                </div>

                <div className="space-y-4">
                  {sessions.filter(s => s.status === 'upcoming').length === 0 ? (
                    <div className="bg-[#141414] border border-dashed border-[#2A2A2A] rounded-2xl p-8 text-center text-[#737373]">
                      No upcoming sessions. Swap with a peer to schedule one!
                    </div>
                  ) : (
                    sessions.filter(s => s.status === 'upcoming').map(session => (
                      <div key={session.id} className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#F59E0B]/30 transition group">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border ${session.avatarColor}`}>
                            {session.avatarInitials}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm group-hover:text-[#F59E0B] transition">{session.peerName}</h4>
                            <p className="text-xs text-[#737373] mt-0.5">Topic: <span className="text-[#F5F5F5] font-semibold">{session.skill}</span></p>
                            <p className="text-[10px] text-amber-500 font-semibold font-mono mt-1">🗓 {session.time}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <button
                            onClick={() => setCallActiveSession(session)}
                            className="flex-1 sm:flex-initial px-4 py-2 bg-[#F59E0B] text-black text-xs font-bold rounded-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1.5 shadow-lg shadow-[#F59E0B]/10"
                          >
                            <span>📹</span> Join call
                          </button>
                          <button
                            onClick={() => {
                              setSessions(sessions.filter(s => s.id !== session.id))
                              triggerToast('Session cancelled. ◈ 1 Token refunded to balance.', 'info')
                              setTokenBalance(prev => prev + 1)
                            }}
                            className="px-3 py-2 border border-[#2A2A2A] hover:bg-red-500/10 hover:border-red-500/30 text-[#737373] hover:text-red-400 rounded-lg text-xs font-semibold transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Profile stats */}
              <div className="lg:col-span-1 bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 space-y-6">
                <div>
                  <h3 className="font-extrabold text-lg text-white mb-2">My Profile Overview</h3>
                  <p className="text-[#737373] text-xs">Verify your exchange listing categories and update current targets.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#10B981] tracking-wider block mb-1.5">I can teach:</span>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[10px] bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/25 px-2 py-0.5 rounded-full font-bold">Node.js</span>
                      <span className="text-[10px] bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/25 px-2 py-0.5 rounded-full font-bold">SQL</span>
                      <span className="text-[10px] bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/25 px-2 py-0.5 rounded-full font-bold">Git Workflow</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#F59E0B] tracking-wider block mb-1.5">I am learning:</span>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[10px] bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/25 px-2 py-0.5 rounded-full font-bold">React</span>
                      <span className="text-[10px] bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/25 px-2 py-0.5 rounded-full font-bold">Python</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2A2A2A]/50 flex items-center justify-between text-xs text-[#737373]">
                  <span>Total Swaps Completed</span>
                  <span className="font-bold text-white text-sm">24 hours</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FIND MATCHES */}
        {activeTab === 'matches' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Find Exchange Peers</h1>
              <p className="text-[#737373] text-sm">Align and connect with student swappers matching your specific teaches & learns matrix.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PEERS_DATABASE.map(peer => (
                <div key={peer.id} className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#F59E0B]/40 hover:-translate-y-1 transition duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border ${peer.avatarColor}`}>
                          {peer.avatarInitials}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-sm group-hover:text-[#F59E0B] transition">{peer.name}</h3>
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
                            <span key={t} className="text-[10px] bg-[#10B981]/10 text-[#10B981] px-2 py-0.5 rounded border border-[#10B981]/25">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase font-bold text-[#F59E0B] block">Wants</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {peer.wants.map(w => (
                            <span key={w} className="text-[10px] bg-[#F59E0B]/10 text-[#F59E0B] px-2 py-0.5 rounded border border-[#F59E0B]/25">
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setBookingPeer(peer)}
                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] group-hover:bg-[#F59E0B] group-hover:text-black text-[#F5F5F5] rounded-xl py-2.5 text-xs font-bold transition shadow-lg shadow-black/10"
                  >
                    Book P2P Session
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ACTIVE SESSIONS */}
        {activeTab === 'sessions' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">My Scheduled Sessions</h1>
              <p className="text-[#737373] text-sm">Join video lobbies, review past records, and schedule ongoing peer bookings.</p>
            </div>

            <div className="space-y-6">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#737373]">🗓 Upcoming Sessions ({sessions.filter(s => s.status === 'upcoming').length})</h3>
              
              {sessions.filter(s => s.status === 'upcoming').length === 0 ? (
                <div className="bg-[#141414] border border-dashed border-[#2A2A2A] rounded-2xl p-12 text-center text-[#737373]">
                  No upcoming peer swap sessions scheduled. Find a peer in the matches directory!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sessions.filter(s => s.status === 'upcoming').map(session => (
                    <div key={session.id} className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 relative overflow-hidden group hover:border-[#F59E0B]/30 transition">
                      <div className="absolute top-0 right-0 w-2 h-full bg-[#F59E0B]" />
                      
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border ${session.avatarColor}`}>
                            {session.avatarInitials}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm group-hover:text-[#F59E0B] transition">{session.peerName}</h4>
                            <span className="text-[10px] bg-[#F59E0B]/10 text-[#F59E0B] px-2 py-0.5 rounded font-extrabold uppercase font-mono">1:1 Call</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-6">
                        <p className="text-xs text-[#737373]">Topic exchange: <span className="text-[#F5F5F5] font-semibold">{session.skill}</span></p>
                        <p className="text-xs text-[#737373]">Date & time: <span className="text-amber-500 font-semibold font-mono">{session.time}</span></p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setCallActiveSession(session)}
                          className="flex-1 px-4 py-2.5 bg-[#F59E0B] text-black text-xs font-bold rounded-lg hover:brightness-110 active:scale-95 transition shadow-lg shadow-[#F59E0B]/15"
                        >
                          Join WebRTC Call
                        </button>
                        <button
                          onClick={() => {
                            setSessions(sessions.filter(s => s.id !== session.id))
                            triggerToast('Session cancelled. ◈ 1 Token refunded to balance.', 'info')
                            setTokenBalance(prev => prev + 1)
                          }}
                          className="px-3 py-2.5 border border-[#2A2A2A] hover:bg-red-500/10 hover:border-red-500/30 text-[#737373] hover:text-red-400 rounded-lg text-xs font-semibold transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h3 className="font-bold text-sm uppercase tracking-wider text-[#737373] pt-6 border-t border-[#2A2A2A]/50">📜 Completed Sessions History</h3>
              <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#2A2A2A] bg-[#1C1C1C] text-[#737373] font-bold uppercase tracking-wider">
                      <th className="p-4">Peer Student</th>
                      <th className="p-4">Topic Exchanged</th>
                      <th className="p-4">Duration</th>
                      <th className="p-4">Exchange Role</th>
                      <th className="p-4 text-right">Verification Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A2A] text-[#F5F5F5] font-medium">
                    <tr>
                      <td className="p-4 font-bold flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center font-bold text-[10px]">MC</span>
                        Marcus Chen
                      </td>
                      <td className="p-4 text-[#737373]">Basic Git & Merging conflicts</td>
                      <td className="p-4 font-mono">30 minutes</td>
                      <td className="p-4"><span className="text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">Learner</span></td>
                      <td className="p-4 text-right text-[#10B981] font-bold">Verified ✔</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center font-bold text-[10px]">ER</span>
                        Elena Rostova
                      </td>
                      <td className="p-4 text-[#737373]">Node Rest API & Middleware Dev</td>
                      <td className="p-4 font-mono">60 minutes</td>
                      <td className="p-4"><span className="text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded">Teacher</span></td>
                      <td className="p-4 text-right text-[#10B981] font-bold">Verified ✔</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TOKEN WALLET */}
        {activeTab === 'wallet' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Token Wallet</h1>
              <p className="text-[#737373] text-sm">Earn token credits by sharing your know-how, or buy tokens to book instantly.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Wallet Summary Card */}
              <div className="lg:col-span-1 bg-gradient-to-br from-[#1C1C1C] to-[#141414] border border-[#2A2A2A] rounded-3xl p-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-[#F59E0B]/10 rounded-full blur-[40px] pointer-events-none" />
                <span className="text-[#F59E0B] text-xl font-bold font-mono uppercase bg-[#F59E0B]/10 border border-[#F59E0B]/20 px-3 py-1 rounded-full inline-block mb-8">
                  Wallets Active
                </span>
                <p className="text-[#737373] text-xs font-extrabold uppercase tracking-wider mb-2">Spendable Balance</p>
                <p className="text-5xl font-black text-[#F59E0B] font-mono tracking-tight mb-2">◈ {tokenBalance}</p>
                <p className="text-xs text-[#737373] mb-8">Equals 24 hours of total 1:1 learning exchanges.</p>

                <div className="space-y-3 pt-6 border-t border-[#2A2A2A]/60 text-xs text-[#737373]">
                  <div className="flex items-center justify-between">
                    <span>Lifetime tokens earned</span>
                    <span className="font-bold text-white">◈ 72</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Lifetime tokens spent</span>
                    <span className="font-bold text-white">◈ 24</span>
                  </div>
                </div>
              </div>

              {/* Purchase top-up section */}
              <div className="lg:col-span-2 bg-[#141414] border border-[#2A2A2A] rounded-3xl p-6 space-y-6">
                <div>
                  <h3 className="font-extrabold text-lg text-white mb-1">Top-Up Token Balance</h3>
                  <p className="text-[#737373] text-xs">Instantly load tokens to your wallet using secure Stripe integrations.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-[#2A2A2A] bg-[#0D0D0D] rounded-2xl p-5 text-center flex flex-col justify-between group hover:border-[#F59E0B]/50 transition duration-300">
                    <div>
                      <p className="text-xs font-bold text-[#737373] uppercase tracking-wider mb-3">Starter Pack</p>
                      <p className="text-2xl font-black text-[#F59E0B] font-mono mb-1">◈ 5</p>
                      <p className="text-xs text-[#737373] mb-6">5 tokens ($1.00 / token)</p>
                    </div>
                    <button
                      disabled={walletLoading}
                      onClick={() => handleTopUp(5)}
                      className="w-full bg-[#1C1C1C] hover:bg-[#F59E0B] border border-[#2A2A2A] group-hover:text-black text-white font-extrabold text-xs py-2 rounded-xl transition"
                    >
                      Buy for $5
                    </button>
                  </div>

                  <div className="border border-[#F59E0B]/40 bg-[#0D0D0D] rounded-2xl p-5 text-center flex flex-col justify-between relative group hover:border-[#F59E0B]/70 transition duration-300 shadow-lg shadow-[#F59E0B]/5">
                    <span className="absolute top-[-10px] left-1/2 -translate-x-1/2 bg-[#F59E0B] text-black text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded uppercase">Best Value</span>
                    <div>
                      <p className="text-xs font-bold text-[#737373] uppercase tracking-wider mb-3 mt-1.5">Swapper Choice</p>
                      <p className="text-2xl font-black text-[#F59E0B] font-mono mb-1">◈ 10</p>
                      <p className="text-xs text-[#737373] mb-6">10 tokens ($0.80 / token)</p>
                    </div>
                    <button
                      disabled={walletLoading}
                      onClick={() => handleTopUp(10)}
                      className="w-full bg-[#F59E0B] text-black font-extrabold text-xs py-2 rounded-xl hover:brightness-110 transition"
                    >
                      Buy for $8
                    </button>
                  </div>

                  <div className="border border-[#2A2A2A] bg-[#0D0D0D] rounded-2xl p-5 text-center flex flex-col justify-between group hover:border-[#F59E0B]/50 transition duration-300">
                    <div>
                      <p className="text-xs font-bold text-[#737373] uppercase tracking-wider mb-3">Power Swapper</p>
                      <p className="text-2xl font-black text-[#F59E0B] font-mono mb-1">◈ 25</p>
                      <p className="text-xs text-[#737373] mb-6">25 tokens ($0.60 / token)</p>
                    </div>
                    <button
                      disabled={walletLoading}
                      onClick={() => handleTopUp(25)}
                      className="w-full bg-[#1C1C1C] hover:bg-[#F59E0B] border border-[#2A2A2A] group-hover:text-black text-white font-extrabold text-xs py-2 rounded-xl transition"
                    >
                      Buy for $15
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2A2A2A]/50 flex items-center justify-between text-xs text-[#737373]">
                  <span>🔐 Secured Stripe Transactions</span>
                  <span>Withdrawals enabled at 100+ tokens</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AI ROADMAPS */}
        {activeTab === 'roadmap' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">AI-Generated Learning Roadmaps</h1>
              <p className="text-[#737373] text-sm">Enter any topic and let our intelligent engine generate custom step-by-step pathways to guide your learning.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Input Control */}
              <div className="lg:col-span-1 bg-[#141414] border border-[#2A2A2A] rounded-3xl p-6 space-y-6">
                <div>
                  <h3 className="font-extrabold text-lg text-white mb-1">Generate Roadmap</h3>
                  <p className="text-[#737373] text-xs font-medium">Input a framework, library, or engineering topic you want to master.</p>
                </div>

                <form onSubmit={handleGenerateRoadmap} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-extrabold text-[#737373] mb-2 tracking-wider">Target Skill:</label>
                    <input
                      type="text"
                      value={roadmapQuery}
                      onChange={(e) => setRoadmapQuery(e.target.value)}
                      placeholder="e.g. Docker, Web3, Python ML, Next.js"
                      className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#F5F5F5] font-semibold focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={roadmapLoading || !roadmapQuery.trim()}
                    className="w-full bg-[#F59E0B] text-black font-extrabold py-3.5 rounded-xl hover:brightness-110 active:scale-95 transition disabled:opacity-50 text-sm shadow-lg shadow-[#F59E0B]/10"
                  >
                    {roadmapLoading ? '🧠 Engineering Roadmap...' : 'Generate Roadmap'}
                  </button>
                </form>

                <div className="pt-4 border-t border-[#2A2A2A]/50 text-xs text-[#737373] space-y-2">
                  <p className="font-semibold text-white">⚡ AI Quick Suggestions:</p>
                  <div className="flex flex-wrap gap-1">
                    {['Docker & Containers', 'Next.js App Router', 'Solidity & Ethereum'].map(sugg => (
                      <button
                        key={sugg}
                        onClick={() => setRoadmapQuery(sugg)}
                        className="bg-[#0D0D0D] border border-[#2A2A2A] text-[10px] text-[#737373] hover:text-[#F59E0B] hover:border-[#F59E0B]/30 px-2.5 py-1 rounded"
                      >
                        {sugg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generated Roadmap Display */}
              <div className="lg:col-span-2 space-y-4">
                {roadmapLoading ? (
                  <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-16 text-center space-y-4 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-10 h-10 border-t-2 border-r-2 border-[#F59E0B] rounded-full animate-spin" />
                    <p className="font-bold text-white text-lg">Querying AI model...</p>
                    <p className="text-xs text-[#737373] max-w-xs leading-relaxed">Assembling vector embeddings, matching skills trees, and generating milestone structures.</p>
                  </div>
                ) : roadmapData ? (
                  <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-6 md:p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-[#2A2A2A]/50 pb-4">
                      <h3 className="font-black text-xl text-white tracking-tight">{roadmapData.title}</h3>
                      <span className="text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded">
                        Active
                      </span>
                    </div>

                    <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#2A2A2A] before:z-0">
                      {roadmapData.steps.map(step => (
                        <div key={step.id} className="flex gap-4 relative z-10">
                          <button
                            onClick={() => toggleRoadmapStep(step.id)}
                            className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                              step.completed
                                ? 'bg-[#10B981] border-[#10B981] text-black shadow-lg shadow-[#10B981]/20'
                                : 'bg-[#0D0D0D] border-[#2A2A2A] text-[#737373] hover:border-[#10B981]/40'
                            }`}
                          >
                            {step.completed ? '✔' : step.id}
                          </button>
                          <div>
                            <h4 className={`font-bold text-sm transition ${step.completed ? 'text-[#10B981] line-through' : 'text-white'}`}>
                              {step.title}
                            </h4>
                            <p className="text-xs text-[#737373] mt-1 leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#141414] border border-dashed border-[#2A2A2A] rounded-3xl p-16 text-center text-[#737373] flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-12 h-12 rounded-xl bg-[#2A2A2A] flex items-center justify-center text-xl mb-4">🧠</div>
                    <h3 className="font-bold text-white text-base mb-1">No roadmap generated yet</h3>
                    <p className="text-xs max-w-sm">Enter a topic in the generator pane to build an intelligent milestone framework mapping your technical goals.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FULLSCREEN MODAL 1: BOOKING POPUP */}
      {bookingPeer && (
        <div className="fixed inset-0 z-50 bg-[#0D0D0D]/80 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-6 md:p-8 max-w-md w-full relative shadow-2xl">
            <h2 className="text-xl font-black text-white tracking-tight mb-2">Book 1:1 Peer Swap</h2>
            <p className="text-[#737373] text-xs mb-6">Schedule a session with <span className="text-[#F59E0B] font-semibold">{bookingPeer.name}</span>. Peer matches operate on token exchanges.</p>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-[10px] uppercase font-extrabold text-[#737373] mb-1.5 tracking-wider">Select Topic Exchange:</label>
                <select className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-[#F5F5F5] font-semibold focus:ring-2 focus:ring-[#F59E0B] outline-none">
                  {bookingPeer.teaches.map(t => (
                    <option key={t} value={t}>Learn {t} (Teaches)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-extrabold text-[#737373] mb-1.5 tracking-wider">Select Date:</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-[#F5F5F5] font-semibold focus:ring-2 focus:ring-[#F59E0B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-extrabold text-[#737373] mb-1.5 tracking-wider">Select Time:</label>
                  <input
                    type="time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-[#F5F5F5] font-semibold focus:ring-2 focus:ring-[#F59E0B] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-extrabold text-[#737373] mb-1.5 tracking-wider font-mono">Session Duration:</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setBookingDuration('30')}
                    className={`py-3 text-xs font-extrabold rounded-xl border transition ${
                      bookingDuration === '30'
                        ? 'bg-[#F59E0B]/10 border-[#F59E0B] text-[#F59E0B]'
                        : 'bg-[#0D0D0D] border-[#2A2A2A] text-[#737373] hover:text-white'
                    }`}
                  >
                    30 mins (◈ 1 token)
                  </button>
                  <button
                    onClick={() => setBookingDuration('60')}
                    className={`py-3 text-xs font-extrabold rounded-xl border transition ${
                      bookingDuration === '60'
                        ? 'bg-[#F59E0B]/10 border-[#F59E0B] text-[#F59E0B]'
                        : 'bg-[#0D0D0D] border-[#2A2A2A] text-[#737373] hover:text-white'
                    }`}
                  >
                    60 mins (◈ 2 tokens)
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleConfirmBooking}
                className="flex-1 py-3 bg-[#F59E0B] text-black font-extrabold text-xs rounded-xl hover:brightness-110 transition shadow-lg shadow-[#F59E0B]/15"
              >
                Confirm & Pay
              </button>
              <button
                onClick={() => setBookingPeer(null)}
                className="px-4 py-3 border border-[#2A2A2A] hover:bg-[#1C1C1C] text-[#737373] hover:text-white font-bold text-xs rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN MODAL 2: WEBRTC SIMULATED CALL SCREEN */}
      {callActiveSession && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-[#2A2A2A] bg-[#141414] px-6 flex items-center justify-between text-xs text-[#737373]">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="font-extrabold text-white text-sm">LIVE SESSION LOBBY</span>
              <span className="bg-[#2A2A2A] px-2 py-0.5 rounded font-mono text-[10px]">P2P channels secure</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-[#F5F5F5]">
              <span>Topic: {callActiveSession.skill}</span>
              <span className="text-[#F59E0B] font-mono">⏱ Live 12:45 min</span>
            </div>

            <button
              onClick={() => {
                setCallActiveSession(null)
                triggerToast('Session concluded successfully! Rate your peer exchange.', 'success')
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-lg transition text-[11px] shadow-lg shadow-red-500/10"
            >
              Conclude call
            </button>
          </header>

          {/* WebRTC layout split */}
          <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-[#0D0D0D]">
            {/* Left: Video feeds */}
            <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 items-center justify-center min-h-0 bg-[#0A0A0A]">
              {/* Partner Feed */}
              <div className="flex-1 w-full h-full max-h-[420px] bg-[#141414] border border-[#2A2A2A] rounded-2xl relative overflow-hidden flex flex-col items-center justify-center shadow-2xl">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl border shadow-xl ${callActiveSession.avatarColor}`}>
                  {callActiveSession.avatarInitials}
                </div>
                <p className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded border border-[#2A2A2A] text-xs font-semibold text-white">{callActiveSession.peerName}</p>
                <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black uppercase px-2 py-0.5 rounded">Partner Feed</div>
              </div>

              {/* Local Feed */}
              <div className="flex-1 w-full h-full max-h-[420px] bg-[#141414] border border-[#2A2A2A] rounded-2xl relative overflow-hidden flex flex-col items-center justify-center shadow-2xl">
                <div className="w-20 h-20 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 flex items-center justify-center font-bold text-3xl shadow-xl">
                  AA
                </div>
                <p className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded border border-[#2A2A2A] text-xs font-semibold text-white">Aakash (You)</p>
                <div className="absolute top-4 right-4 bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[9px] font-black uppercase px-2 py-0.5 rounded">Local Feed (Muted)</div>
              </div>
            </div>

            {/* Right: Live collaborative chat & notes */}
            <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-[#2A2A2A] bg-[#141414] flex flex-col justify-between shrink-0 min-h-0">
              {/* Tabs for Sidebar in Call */}
              <div className="h-12 border-b border-[#2A2A2A] px-4 flex items-center justify-between text-xs text-white font-bold">
                <span className="border-b-2 border-[#F59E0B] py-3 text-[#F59E0B]">Live Chat Lobbies</span>
                <span className="text-[#737373]">Shared Notes</span>
              </div>

              {/* Chat Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 font-medium text-xs">
                {chatMessages.map((msg, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-[#737373]">
                      <span className={`font-bold ${msg.sender === 'System' ? 'text-[#F59E0B]' : msg.sender === 'You' ? 'text-[#10B981]' : 'text-white'}`}>
                        {msg.sender}
                      </span>
                      <span className="text-[9px]">{msg.time}</span>
                    </div>
                    <p className={`p-2.5 rounded-lg leading-relaxed ${
                      msg.sender === 'System' ? 'bg-[#0D0D0D]/40 text-[#737373] italic border border-[#2A2A2A]/40' : 
                      msg.sender === 'You' ? 'bg-[#10B981]/10 text-white border border-[#10B981]/15' : 
                      'bg-[#0D0D0D] text-white border border-[#2A2A2A]'
                    }`}>
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Input for Chat */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!newMessageText.trim()) return
                  setChatMessages(prev => [...prev, { sender: 'You', text: newMessageText, time: '12:13 PM' }])
                  setNewMessageText('')
                  // Simulated auto replies
                  setTimeout(() => {
                    setChatMessages(prev => [...prev, {
                      sender: callActiveSession.peerName,
                      text: `Great explanation! Let's cover more about components structure now.`,
                      time: '12:13 PM',
                    }])
                  }, 1200)
                }}
                className="p-4 border-t border-[#2A2A2A] flex gap-2"
              >
                <input
                  type="text"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="Enter message for peer swapper..."
                  className="flex-1 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs text-white focus:ring-2 focus:ring-[#F59E0B] outline-none"
                />
                <button type="submit" className="px-4 bg-[#F59E0B] text-black font-extrabold text-xs rounded-xl hover:brightness-110 active:scale-95 transition">
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
