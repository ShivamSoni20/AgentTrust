'use client'

import React, { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Shield, CreditCard, Activity, BarChart3, AlertCircle, Loader2, SendHorizonal, History, Scale } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AGENT_REPUTATION_ADDRESS } from '@/config/wagmi'
import { useAgent } from '@/hooks/useAgent'
import { formatUnits } from 'viem'
import { TransactionList } from '@/components/TransactionList'

type Tab = 'dashboard' | 'transactions' | 'disputes'

export default function Home() {
  const { address, agent, isConnected, isRegistering, register, usdcBalance, txHistory, disputeCounter } = useAgent()
  const [stakeAmount, setStakeAmount] = useState('100')
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  const handleRegister = async () => {
    try {
      await register(stakeAmount)
      alert('Registration successful!')
    } catch (err) {
      alert('Registration failed. Check console for details.')
    }
  }

  const isRegistered = agent?.isRegistered

  return (
    <main className="min-h-screen bg-[#0a0a0b] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">AgentTrust</span>
        </div>

        <div className="hidden md:flex items-center gap-8 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`text-sm font-medium transition-colors ${activeTab === 'transactions' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`text-sm font-medium transition-colors ${activeTab === 'disputes' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            Disputes
          </button>
        </div>

        <div className="flex items-center gap-4">
          {isConnected && (
            <div className="hidden lg:block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400">
              {Number(usdcBalance).toLocaleString()} USDC
            </div>
          )}
          <ConnectButton />
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                  <Activity className="w-4 h-4" />
                  Live on Base Sepolia
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1]">
                  The Trust Layer for <span className="gradient-text">Agent Commerce</span>
                </h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl">
                  Building stable credit and reputation systems for the next billion autonomous transactions.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Reputation Score',
                    value: isRegistered ? `${agent.reputationScore}/1000` : 'Not Registered',
                    icon: BarChart3,
                    color: 'text-blue-500',
                    bg: 'bg-blue-500/10',
                    desc: 'Based on txn success rate'
                  },
                  {
                    title: 'Credit Limit',
                    value: isRegistered ? `$${(Number(agent.reputationScore) / 1000 * Number(agent.stakeAmount) / 1e6 * 5).toLocaleString()} USDC` : '$0 USDC',
                    icon: CreditCard,
                    color: 'text-purple-500',
                    bg: 'bg-purple-500/10',
                    desc: '5x Stake * Rep Multiplier'
                  },
                  {
                    title: 'Global Disputes',
                    value: `${disputeCounter} Total`,
                    icon: Scale,
                    color: 'text-emerald-500',
                    bg: 'bg-emerald-500/10',
                    desc: 'Community-governed'
                  },
                ].map((stat, i) => (
                  <div key={i} className="glass p-6 rounded-2xl card-hover border border-white/5">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-lg ${stat.bg}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
                    <p className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-2">{stat.desc}</p>
                  </div>
                ))}
              </div>

              {/* Action Card */}
              <div className="glass rounded-3xl p-8 md:p-12 border border-white/5 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] -mr-48 -mt-48 rounded-full"></div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-4xl font-bold mb-6 tracking-tight">
                      {isRegistered ? 'Agent Management' : 'Ready to Start?'}
                    </h2>
                    <p className="text-gray-400 mb-8 leading-relaxed text-lg">
                      {isRegistered
                        ? 'Your identity is verified. Use the dashboard to track reputation, increase your stake, or participate in the resolution system.'
                        : 'Autonomous agents require economic identity. Stake USDC to establish your reputation and unlock decentralized credit lines.'
                      }
                    </p>

                    {!isRegistered ? (
                      <div className="space-y-4 max-w-md">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="number"
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                            placeholder="Min 100 USDC"
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all flex-1 font-mono"
                          />
                          <button
                            onClick={handleRegister}
                            disabled={isRegistering || !isConnected}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-blue-900/20"
                          >
                            {isRegistering ? <Loader2 className="w-5 h-5 animate-spin" /> : <SendHorizonal className="w-5 h-5 text-white" />}
                            Register Agent
                          </button>
                        </div>
                        {!isConnected && <p className="text-sm text-amber-500/80 font-medium">Please connect your wallet to register on Base.</p>}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-4">
                        <button className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl font-bold transition-all">
                          Boost Stake
                        </button>
                        <button className="px-10 py-4 border border-white/5 hover:bg-white/5 rounded-2xl font-bold transition-all text-gray-400 hover:text-white">
                          Link Wallet
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="bg-black/60 rounded-3xl border border-white/5 p-8 shadow-2xl backdrop-blur-xl group">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 group-hover:bg-red-500/40 transition-colors"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500/40 transition-colors"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 group-hover:bg-green-500/40 transition-colors"></div>
                      </div>
                      <span className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">Agent Metadata</span>
                    </div>
                    <pre className="font-mono text-sm leading-relaxed">
                      <code className="text-blue-400">
                        {`{
  "address": "${isConnected ? address?.slice(0, 12) + '...' : '0x...'}",
  "registered": ${!!isRegistered},
  "stake": "${isRegistered ? formatUnits(agent.stakeAmount, 6) : '0.00'} USDC",
  "rep": ${isRegistered ? agent.reputationScore : 0},
  "limit": "${isRegistered ? (Number(agent.reputationScore) / 1000 * Number(agent.stakeAmount) / 1e6 * 5).toFixed(2) : '0.00'}",
  "network": "Base Sepolia"
}`}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold flex items-center gap-3">
                    <History className="w-8 h-8 text-blue-500" />
                    Transaction History
                  </h2>
                  <p className="text-gray-400 mt-2">Latest economic activity from your agent and sub-wallets.</p>
                </div>
                {isRegistered && (
                  <button className="px-6 py-2 glass border-blue-500/20 text-blue-400 rounded-xl text-sm font-semibold hover:bg-blue-500/10 transition-colors">
                    Filter by Type
                  </button>
                )}
              </div>
              <TransactionList transactions={txHistory || []} />
            </motion.div>
          )}

          {activeTab === 'disputes' && (
            <motion.div
              key="disputes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Scale className="w-8 h-8 text-emerald-500" />
                    Network Governance
                  </h2>
                  <p className="text-gray-400 mt-2">Vote on active disputes to maintain the integrity of the ecosystem.</p>
                </div>
              </div>

              <div className="glass rounded-3xl p-12 text-center border border-white/5 bg-emerald-500/[0.02]">
                <AlertCircle className="w-16 h-16 text-emerald-600/50 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-3 tracking-tight">All Quiet in the Network</h3>
                <p className="text-gray-400 max-w-md mx-auto text-lg leading-relaxed">
                  There are currently no active disputes. Your reputation score is safe and the network is operating within protocol parameters.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <button className="px-8 py-3 bg-emerald-600/10 text-emerald-400 rounded-xl font-bold hover:bg-emerald-600/20 border border-emerald-600/20 transition-all">
                    View Archival Records
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 mt-20 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-4">
          <div className="flex items-center gap-2 opacity-50">
            <Shield className="w-4 h-4" />
            <span className="font-bold uppercase tracking-widest text-xs">AgentTrust Protocol</span>
          </div>
          <p className="text-gray-600 text-sm">&copy; 2026 Moltbook USDC Hackathon. Optimized for the Base Ecosystem.</p>
        </div>
      </footer>
    </main>
  )
}
