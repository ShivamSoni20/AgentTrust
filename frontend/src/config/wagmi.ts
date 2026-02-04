import { http, createConfig } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

export const config = getDefaultConfig({
    appName: 'Agent Reputation & Credit System',
    projectId: 'YOUR_PROJECT_ID', // Usually from WalletConnect Cloud
    chains: [baseSepolia],
    ssr: true,
    transports: {
        [baseSepolia.id]: http('https://sepolia.base.org'),
    },
})

export const AGENT_REPUTATION_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'
export const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
