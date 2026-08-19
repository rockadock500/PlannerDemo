import React, { useState, useEffect, useRef } from 'react';
import { sendCognitoMessage, confirmCognitoAction, getErrorMessage } from '../api';
import { Bot, Send, User, AlertTriangle, Check, X, Sparkles, Loader2 } from 'lucide-react';

const Cognito = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: `Hello! I'm Cognito, your AI assistant for TAU CRM. I can help you with:

- **Pipeline**: "Show me the pipeline summary" or "What's our weighted pipeline?"
- **Opportunities**: "List all opportunities" or "Show verbal stage deals"
- **Contacts**: "List contacts"
- **Companies**: "Show companies"

What would you like to know?`
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [pendingAction, setPendingAction] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const response = await sendCognitoMessage(userMessage, sessionId);

            setSessionId(response.session_id);

            if (response.pending_action) {
                setPendingAction(response.pending_action);
            }

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.response,
                actions: response.actions_taken,
                pending: response.pending_action
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Sorry, I encountered an error: ${getErrorMessage(error)}`,
                isError: true
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (confirmed) => {
        if (!pendingAction) return;

        setLoading(true);
        try {
            if (confirmed) {
                const response = await confirmCognitoAction(
                    pendingAction.confirmation_token,
                    sessionId
                );
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: response.response,
                    isConfirmation: true
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'Action cancelled.',
                    isCancelled: true
                }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Error: ${getErrorMessage(error)}`,
                isError: true
            }]);
        } finally {
            setPendingAction(null);
            setLoading(false);
        }
    };

    const formatMessage = (content) => {
        // Simple markdown-like formatting
        return content
            .split('\n')
            .map((line, i) => {
                // Bold text
                line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                // List items
                if (line.startsWith('- ')) {
                    return `<li key="${i}" class="ml-4">${line.substring(2)}</li>`;
                }
                return `<p key="${i}">${line}</p>`;
            })
            .join('');
    };

    return (
        <div className="h-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-950">
            {/* Header */}
            <div className="px-6 py-4 bg-white/5 backdrop-blur-sm border-b border-white/10 flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Bot size={20} className="text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        Cognito
                        <Sparkles size={14} className="text-indigo-400" />
                    </h2>
                    <p className="text-xs text-slate-400">AI-powered CRM Assistant</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {message.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                <Bot size={16} className="text-white" />
                            </div>
                        )}

                        <div
                            className={`max-w-[70%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-md'
                                    : message.isError
                                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                        : message.isConfirmation
                                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                            : message.isCancelled
                                                ? 'bg-slate-700/50 text-slate-400'
                                                : 'bg-white/10 text-slate-200 rounded-bl-md'
                                }`}
                        >
                            <div
                                className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                            />

                            {message.actions && message.actions.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-white/10">
                                    <div className="text-xs text-indigo-300">
                                        Actions: {message.actions.join(', ')}
                                    </div>
                                </div>
                            )}

                            {message.pending && (
                                <div className="mt-3 flex gap-2">
                                    <button
                                        onClick={() => handleConfirm(true)}
                                        disabled={loading}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 disabled:opacity-50"
                                    >
                                        <Check size={14} />
                                        Confirm Delete
                                    </button>
                                    <button
                                        onClick={() => handleConfirm(false)}
                                        disabled={loading}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-600 text-white rounded-lg text-xs font-medium hover:bg-slate-500 disabled:opacity-50"
                                    >
                                        <X size={14} />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {message.role === 'user' && (
                            <div className="w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center flex-shrink-0">
                                <User size={16} className="text-slate-300" />
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <Bot size={16} className="text-white" />
                        </div>
                        <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Loader2 size={16} className="animate-spin" />
                                <span className="text-sm">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Pending Action Banner */}
            {pendingAction && !loading && (
                <div className="mx-4 mb-2 p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg flex items-center gap-3">
                    <AlertTriangle size={20} className="text-amber-400" />
                    <div className="flex-1 text-sm text-amber-200">
                        Action requires confirmation. Respond above to proceed or cancel.
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white/5 border-t border-white/10">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask Cognito anything about your CRM..."
                        disabled={loading || pendingAction}
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim() || pendingAction}
                        className="px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </form>
                <div className="mt-2 text-center text-xs text-slate-500">
                    {sessionId ? `Session: ${sessionId.slice(0, 8)}...` : 'New session'}
                </div>
            </div>
        </div>
    );
};

export default Cognito;
