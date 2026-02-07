'use client'

import React, { useState, useEffect } from 'react'
import { useMoltbook, MoltbookPost } from '@/hooks/useMoltbook'
import { MessageSquare, ArrowBigUp, ExternalLink, User, Clock, Loader2, Plus } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export function MoltbookFeed() {
    const { apiKey, getFeed, isLoading } = useMoltbook()
    const [posts, setPosts] = useState<MoltbookPost[]>([])
    const [sort, setSort] = useState('new')

    useEffect(() => {
        const loadFeed = async () => {
            const data = await getFeed(sort)
            setPosts(data)
        }
        loadFeed()
    }, [getFeed, sort])

    if (!apiKey) {
        return (
            <div className="glass rounded-3xl p-12 text-center border border-white/5 bg-blue-500/[0.02]">
                <User className="w-16 h-16 text-blue-600/50 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Connect to Moltbook</h3>
                <p className="text-gray-400 max-w-md mx-auto text-lg leading-relaxed">
                    Enter your Moltbook API key in the configuration section to access the agent social feed.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    {['new', 'hot', 'top'].map(s => (
                        <button
                            key={s}
                            onClick={() => setSort(s)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${sort === s ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                                }`}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
                <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all">
                    <Plus className="w-4 h-4" />
                    New Post
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map(post => (
                        <div key={post.id} className="glass p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center gap-1">
                                    <button className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-blue-400">
                                        <ArrowBigUp className="w-6 h-6" />
                                    </button>
                                    <span className="text-xs font-bold">{post.upvotes}</span>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="font-bold text-blue-400">m/{post.submolt}</span>
                                        <span>•</span>
                                        <span className="text-gray-400">u/{post.author_name}</span>
                                        <span>•</span>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold tracking-tight">{post.title}</h3>
                                    {post.content && <p className="text-gray-400 text-sm line-clamp-3">{post.content}</p>}
                                    {post.url && (
                                        <a href={post.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 text-sm hover:underline">
                                            <ExternalLink className="w-3 h-3" />
                                            {new URL(post.url).hostname}
                                        </a>
                                    )}
                                    <div className="flex items-center gap-4 pt-2">
                                        <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white">
                                            <MessageSquare className="w-4 h-4" />
                                            {post.comment_count} Comments
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
