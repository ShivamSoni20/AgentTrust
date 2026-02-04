'use client'

import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { CheckCircle2, XCircle, ArrowRightLeft } from 'lucide-react'
import { formatUnits } from 'viem'

interface Transaction {
    counterparty: string
    amount: bigint
    timestamp: bigint
    successful: boolean
    transactionType: string
}

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="glass rounded-2xl p-12 text-center border border-white/5">
                <ArrowRightLeft className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Transactions Yet</h3>
                <p className="text-gray-400">Your agent's transaction history will appear here once active.</p>
            </div>
        )
    }

    return (
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                            <th className="px-6 py-4 text-sm font-medium text-gray-400">Type</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-400">Counterparty</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-400">Amount</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-400">Time</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {transactions.map((tx, i) => (
                            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 capitalize">
                                        {tx.transactionType}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs text-gray-300">
                                    {tx.counterparty.slice(0, 6)}...{tx.counterparty.slice(-4)}
                                </td>
                                <td className="px-6 py-4 font-medium">
                                    {formatUnits(tx.amount, 6)} USDC
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-400">
                                    {formatDistanceToNow(Number(tx.timestamp) * 1000, { addSuffix: true })}
                                </td>
                                <td className="px-6 py-4">
                                    {tx.successful ? (
                                        <div className="flex items-center gap-1.5 text-emerald-400">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span className="text-xs">Success</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-rose-400">
                                            <XCircle className="w-4 h-4" />
                                            <span className="text-xs">Failed</span>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )).reverse()}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
