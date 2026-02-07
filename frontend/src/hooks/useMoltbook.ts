'use client'

import { useState, useEffect, useCallback } from 'react'

const MOLTBOOK_API_BASE = 'https://www.moltbook.com/api/v1'

export interface MoltbookProfile {
    name: string
    description: string
    karma: number
    follower_count: number
    following_count: number
    is_claimed: boolean
}

export interface MoltbookPost {
    id: string
    title: string
    content?: string
    url?: string
    author_name: string
    submolt: string
    upvotes: number
    comment_count: number
    created_at: string
}

export function useMoltbook() {
    const [apiKey, setApiKey] = useState<string | null>(null)
    const [profile, setProfile] = useState<MoltbookProfile | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const savedKey = localStorage.getItem('MOLTBOOK_API_KEY')
        if (savedKey) setApiKey(savedKey)
    }, [])

    const fetchMe = useCallback(async (key: string) => {
        try {
            const res = await fetch(`${MOLTBOOK_API_BASE}/agents/me`, {
                headers: { 'Authorization': `Bearer ${key}` }
            })
            const data = await res.json()
            if (data.success) {
                setProfile(data.data.agent)
                return true
            }
            return false
        } catch (err) {
            console.error(err)
            return false
        }
    }, [])

    const saveApiKey = async (key: string) => {
        setIsLoading(true)
        const success = await fetchMe(key)
        if (success) {
            localStorage.setItem('MOLTBOOK_API_KEY', key)
            setApiKey(key)
            setError(null)
        } else {
            setError('Invalid API Key')
        }
        setIsLoading(false)
    }

    const logout = () => {
        localStorage.removeItem('MOLTBOOK_API_KEY')
        setApiKey(null)
        setProfile(null)
    }

    const createPost = async (title: string, content: string, submolt: string = 'general') => {
        if (!apiKey) return
        const res = await fetch(`${MOLTBOOK_API_BASE}/posts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content, submolt })
        })
        return await res.json()
    }

    const getFeed = async (sort: string = 'new') => {
        const res = await fetch(`${MOLTBOOK_API_BASE}/posts?sort=${sort}&limit=10`, {
            headers: apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}
        })
        const data = await res.json()
        return data.success ? data.data : []
    }

    const registerAgent = async (name: string, description: string) => {
        setIsLoading(true)
        try {
            const res = await fetch(`${MOLTBOOK_API_BASE}/agents/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description })
            })
            const data = await res.json()
            setIsLoading(false)
            return data
        } catch (err) {
            setIsLoading(false)
            return { success: false, error: 'Network error' }
        }
    }

    return {
        apiKey,
        profile,
        isLoading,
        error,
        saveApiKey,
        logout,
        createPost,
        getFeed,
        registerAgent
    }
}
