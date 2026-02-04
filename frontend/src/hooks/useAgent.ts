'use client'

import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { AGENT_REPUTATION_ADDRESS, USDC_ADDRESS } from '@/config/wagmi'
import { AGENT_REPUTATION_ABI } from '@/config/abi'
import { parseUnits, formatUnits } from 'viem'
import { useState } from 'react'

export function useAgent() {
    const { address, isConnected } = useAccount()
    const [isRegistering, setIsRegistering] = useState(false)

    // 1. Check if registered
    const { data: agentData, refetch: refetchAgent } = useReadContract({
        address: AGENT_REPUTATION_ADDRESS as `0x${string}`,
        abi: AGENT_REPUTATION_ABI,
        functionName: 'getAgent',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    })

    // 2. USDC Balance & Allowance
    const { data: usdcBalance } = useReadContract({
        address: USDC_ADDRESS as `0x${string}`,
        abi: [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] }],
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    })

    // 3. Transaction History
    const { data: txHistory, refetch: refetchHistory } = useReadContract({
        address: AGENT_REPUTATION_ADDRESS as `0x${string}`,
        abi: AGENT_REPUTATION_ABI,
        functionName: 'getTransactionHistory',
        args: address ? [address, 0n, 10n] : undefined,
        query: {
            enabled: !!address,
        }
    })

    // 4. Disputes
    const { data: disputeCounter } = useReadContract({
        address: AGENT_REPUTATION_ADDRESS as `0x${string}`,
        abi: AGENT_REPUTATION_ABI,
        functionName: 'disputeCounter',
    })

    const { writeContractAsync: writeContract } = useWriteContract()

    const register = async (amount: string) => {
        if (!address) return
        setIsRegistering(true)
        try {
            const parsedAmount = parseUnits(amount, 6)

            // Approve USDC
            await writeContract({
                address: USDC_ADDRESS as `0x${string}`,
                abi: [{ name: 'approve', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }] }],
                functionName: 'approve',
                args: [AGENT_REPUTATION_ADDRESS as `0x${string}`, parsedAmount],
            })

            // Register
            const hash = await writeContract({
                address: AGENT_REPUTATION_ADDRESS as `0x${string}`,
                abi: AGENT_REPUTATION_ABI,
                functionName: 'registerAgent',
                args: [parsedAmount],
            })

            return hash
        } catch (err) {
            console.error(err)
            throw err
        } finally {
            setIsRegistering(false)
            refetchAgent()
            refetchHistory()
        }
    }

    const recordTx = async (counterparty: string, amount: string, successful: boolean, type: string) => {
        return await writeContract({
            address: AGENT_REPUTATION_ADDRESS as `0x${string}`,
            abi: AGENT_REPUTATION_ABI,
            functionName: 'recordTransaction',
            args: [counterparty as `0x${string}`, parseUnits(amount, 6), successful, type],
        })
    }

    const submitDispute = async (defendant: string, evidence: string) => {
        return await writeContract({
            address: AGENT_REPUTATION_ADDRESS as `0x${string}`,
            abi: AGENT_REPUTATION_ABI,
            functionName: 'submitDispute',
            args: [defendant as `0x${string}`, evidence],
        })
    }

    return {
        address,
        isConnected,
        agent: agentData as any,
        usdcBalance: usdcBalance ? formatUnits(usdcBalance as bigint, 6) : '0',
        txHistory: txHistory as any[],
        disputeCounter: Number(disputeCounter || 0),
        register,
        recordTx,
        submitDispute,
        isRegistering,
        refetchAgent,
        refetchHistory
    }
}
