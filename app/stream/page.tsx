'use client';

import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function StreamPage() {
  const [content, setContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);
  const markdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const eventSource = new EventSource('/api/event-stream');

    eventSource.onopen = () => {
      setIsStreaming(true);
    };

    eventSource.onmessage = (event) => {
      if (event.data === '[DONE]') {
        setIsStreaming(false);
        eventSource.close();
        return;
      }

      setContent((prev) => (prev ? `${prev}\n${event.data}` : event.data));

      setTimeout(() => {
        markdownRef.current?.scrollTo({ top: markdownRef.current.scrollHeight, behavior: 'smooth' });
      }, 10);
    };

    eventSource.onerror = (err) => {
      if (eventSource.readyState === EventSource.CLOSED) {
        // ✅ Stream ended — no need to show error
        console.info('✅ SSE stream closed normally.');
      } else {
        console.error('❌ SSE connection error:', err);
      }
      setIsStreaming(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white flex flex-col items-center px-4 py-10 font-sans">
      <div className="w-full max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            📘 Markdown Stream Viewer
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Real-time Markdown rendering with Server-Sent Events
          </p>
        </header>

        {isStreaming && (
          <div className="mb-4 flex items-center gap-2 text-sm text-blue-400 animate-fade-in">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            <span className="animate-pulse">Streaming in progress...</span>
          </div>
        )}

        <div
          ref={markdownRef}
          className="prose prose-invert max-h-[70vh] overflow-y-auto border border-zinc-800 backdrop-blur-md bg-zinc-900/70 rounded-xl p-6 shadow-[0_0_15px_#0f0f0f40] transition-all duration-300 scroll-smooth custom-scrollbar animate-slide-up"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>

        {!isStreaming && (
          <div className="text-green-400 text-sm mt-4 animate-fade-in">
            ✅ Stream complete. All content loaded.
          </div>
        )}
      </div>
    </main>
  );
}
