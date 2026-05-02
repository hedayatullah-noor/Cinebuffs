"use client";

import { useState, useRef, useEffect } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Quote, Link as LinkIcon, Type } from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Sync external value to editor (only if different)
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const execCommand = (command: string, value: string = "") => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const ToolbarButton = ({ onClick, icon: Icon, title }: any) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className="p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors border-r-2 border-black dark:border-white last:border-r-0"
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    if (!isMounted) return null;

    return (
        <div className="flex flex-col border-2 border-black dark:border-white bg-white dark:bg-zinc-950 overflow-hidden h-full min-h-[400px]">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center bg-gray-50 dark:bg-zinc-900 border-b-2 border-black dark:border-white sticky top-0 z-10">
                <ToolbarButton onClick={() => execCommand("bold")} icon={Bold} title="Bold" />
                <ToolbarButton onClick={() => execCommand("italic")} icon={Italic} title="Italic" />
                <ToolbarButton onClick={() => execCommand("underline")} icon={Underline} title="Underline" />
                <div className="w-px h-8 bg-gray-300 dark:bg-zinc-800 mx-1" />
                <ToolbarButton onClick={() => execCommand("insertUnorderedList")} icon={List} title="Bullet List" />
                <ToolbarButton onClick={() => execCommand("insertOrderedList")} icon={ListOrdered} title="Numbered List" />
                <div className="w-px h-8 bg-gray-300 dark:bg-zinc-800 mx-1" />
                <ToolbarButton onClick={() => execCommand("formatBlock", "blockquote")} icon={Quote} title="Quote" />
                <ToolbarButton onClick={() => {
                    const url = prompt("Enter URL:");
                    if (url) execCommand("createLink", url);
                }} icon={LinkIcon} title="Link" />
                <ToolbarButton onClick={() => execCommand("removeFormat")} icon={Type} title="Clear Formatting" />
            </div>

            {/* Editable Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="flex-1 p-6 outline-none font-serif text-lg leading-relaxed dark:text-white overflow-y-auto custom-scrollbar min-h-[350px] prose dark:prose-invert max-w-none"
                placeholder={placeholder}
            />

            <style jsx global>{`
                [contenteditable]:empty:before {
                    content: attr(placeholder);
                    color: #9ca3af;
                    font-style: italic;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #000;
                    border: 2px solid #fff;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #fff;
                    border: 2px solid #000;
                }
            `}</style>
        </div>
    );
}
