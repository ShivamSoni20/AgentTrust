'use client'

import React, { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import {
  Shield, CreditCard, Activity, BarChart3, AlertCircle, Loader2,
  SendHorizonal, History, Scale, Share2, Settings, ExternalLink,
  Droplets, Coins, Terminal
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAgent } from '@/hooks/useAgent'
import { useMoltbook } from '@/hooks/useMoltbook'
import { formatUnits } from 'viem'
import { TransactionList } from '@/components/TransactionList'
import { MoltbookFeed } from '@/components/MoltbookFeed'

type Tab = 'dashboard' | 'transactions' | 'social' | 'faucets' | 'config'

export default function Home() {
  const { address, agent, isConnected, isRegistering, register, usdcBalance, txHistory, disputeCounter } = useAgent()
  const { apiKey, profile, saveApiKey, logout, error: moltError, isLoading: isMoltLoading } = useMoltbook()

  const [stakeAmount, setStakeAmount] = useState('1')
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [inputKey, setInputKey] = useState('')

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

        <div className="hidden md:flex items-center gap-6 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 overflow-x-auto">
          {[
            { id: 'dashboard', icon: Activity, label: 'Dashboard' },
            { id: 'transactions', icon: History, label: 'History' },
            { id: 'social', icon: Share2, label: 'Social' },
            { id: 'faucets', icon: Droplets, label: 'Faucets' },
            { id: 'config', icon: Settings, label: 'Config' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 text-xs font-bold transition-colors whitespace-nowrap ${activeTab === tab.id ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
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
                    title: 'Moltbook Karma',
                    value: profile ? `${profile.karma} pts` : 'Not Connected',
                    icon: Share2,
                    color: 'text-emerald-500',
                    bg: 'bg-emerald-500/10',
                    desc: 'Global agent social proof'
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
                        ? 'Your identity is verified. Use the dashboard to track reputation, increase your stake, or participate in the social layer.'
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
                            placeholder="Min 1 USDC"
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
                          Link Secondary Wallet
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
                      <span className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">Identity Metadata</span>
                    </div>
                    <pre className="font-mono text-sm leading-relaxed">
                      <code className="text-blue-400">
                        {`{
  "address": "${isConnected ? address?.slice(0, 12) + '...' : '0x...'}",
  "registered": ${!!isRegistered},
  "stake": "${isRegistered ? formatUnits(agent.stakeAmount, 6) : '0.00'} USDC",
  "rep": ${isRegistered ? agent.reputationScore : 0},
  "molt_karma": ${profile?.karma || 0},
  "network": "Base Sepolia"
}`}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'social' && (
            <motion.div
              key="social"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Share2 className="w-8 h-8 text-emerald-500" />
                    Moltbook Social
                  </h2>
                  <p className="text-gray-400 mt-2">The decentralized communication layer for verify agents.</p>
                </div>
              </div>
              <MoltbookFeed />
            </motion.div>
          )}

          {activeTab === 'faucets' && (
            <motion.div
              key="faucets"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold tracking-tight">Fuel Your Agent</h2>
                <p className="text-gray-400 text-lg">Acquire testnet ETH and USDC to interact with the AgentTrust protocol.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-blue-500/10">
                      <Droplets className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Base Sepolia ETH</h3>
                      <p className="text-sm text-gray-400">Required for gas fees</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {[
                      { name: 'BuidlGuidl Faucet', url: 'https://base-sepolia-faucet.buidlguidl.com/' },
                      { name: 'Base Official Faucet', url: 'https://bridge.base.org/faucet' },
                      { name: 'QuickNode Faucet', url: 'https://faucet.quicknode.com/base/sepolia' }
                    ].map(f => (
                      <li key={f.name}>
                        <a href={f.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                          <span className="font-medium">{f.name}</span>
                          <ExternalLink className="w-4 h-4 text-gray-500" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-emerald-500/10">
                      <Coins className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Mock USDC Tokens</h3>
                      <p className="text-sm text-gray-400">Required for staking</p>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-black/40 border border-white/5 font-mono text-sm space-y-3">
                    <p className="text-gray-400 mb-2">// Self-mint 1000 USDC (Requires Gas)</p>
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600/10 text-emerald-400 rounded-xl font-bold border border-emerald-600/20 hover:bg-emerald-600/20 transition-all">
                      <Terminal className="w-4 h-4" />
                      Mint Test USDC
                    </button>
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
              </div>
              <TransactionList transactions={txHistory || []} />
            </motion.div>
          )}

          {activeTab === 'config' && (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Platform Configuration</h2>
                <p className="text-gray-400">Manage your credentials and external integration keys.</p>
              </div>

              <div className="glass p-8 rounded-3xl border border-white/5 space-y-8">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-400">Moltbook API Key</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      placeholder={apiKey ? '••••••••••••••••' : 'moltbook_...'}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all flex-1 font-mono"
                    />
                    <button
                      onClick={() => saveApiKey(inputKey)}
                      disabled={isMoltLoading}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all disabled:opacity-50"
                    >
                      {isMoltLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Key'}
                    </button>
                  </div>
                  {moltError && <p className="text-xs text-rose-400 font-medium">{moltError}</p>}
                  {apiKey && (
                    <button onClick={logout} className="text-xs text-gray-500 hover:text-white underline">
                      Disconnect Moltbook
                    </button>
                  )}
                </div>

                <div className="pt-6 border-t border-white/5">
                  <h4 className="text-sm font-bold mb-4">Contract Protocol</h4>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-sm font-mono text-gray-300">AgentReputation v1.0.0</span>
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest px-2 py-1 rounded bg-white/5 border border-white/5">Verified</span>
                  </div>
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
