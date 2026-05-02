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
        if (isMounted && editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value;
        }
    }, [value, isMounted]);

    const execCommand = (command: string, val: string = "") => {
        if (typeof document !== "undefined") {
            document.execCommand(command, false, val);
            if (editorRef.current) {
                onChange(editorRef.current.innerHTML);
            }
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    if (!isMounted) {
        return (
            <div className="w-full h-[400px] bg-gray-50 dark:bg-zinc-900 border-2 border-black animate-pulse" />
        );
    }

    return (
        <div className="flex flex-col border-2 border-black dark:border-white bg-white dark:bg-zinc-950 overflow-hidden h-full min-h-[400px]">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center bg-gray-50 dark:bg-zinc-900 border-b-2 border-black dark:border-white sticky top-0 z-10">
                <button type="button" onClick={() => execCommand("bold")} className="p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border-r-2 border-black dark:border-white"><Bold className="w-4 h-4" /></button>
                <button type="button" onClick={() => execCommand("italic")} className="p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border-r-2 border-black dark:border-white"><Italic className="w-4 h-4" /></button>
                <button type="button" onClick={() => execCommand("underline")} className="p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border-r-2 border-black dark:border-white"><Underline className="w-4 h-4" /></button>
                <div className="w-px h-8 bg-gray-300 dark:bg-zinc-800 mx-1" />
                <button type="button" onClick={() => execCommand("insertUnorderedList")} className="p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border-r-2 border-black dark:border-white"><List className="w-4 h-4" /></button>
                <button type="button" onClick={() => execCommand("insertOrderedList")} className="p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border-r-2 border-black dark:border-white"><ListOrdered className="w-4 h-4" /></button>
                <div className="w-px h-8 bg-gray-300 dark:bg-zinc-800 mx-1" />
                <button type="button" onClick={() => execCommand("formatBlock", "blockquote")} className="p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border-r-2 border-black dark:border-white"><Quote className="w-4 h-4" /></button>
                <button type="button" onClick={() => {
                    const url = window.prompt("Enter URL:");
                    if (url) execCommand("createLink", url);
                }} className="p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border-r-2 border-black dark:border-white"><LinkIcon className="w-4 h-4" /></button>
                <button type="button" onClick={() => execCommand("removeFormat")} className="p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"><Type className="w-4 h-4" /></button>
            </div>

            {/* Editable Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="flex-1 p-6 outline-none font-serif text-lg leading-relaxed dark:text-white overflow-y-auto min-h-[350px] prose dark:prose-invert max-w-none"
                placeholder={placeholder}
            />
            
            {/* Standard Global Styles for placeholder */}
            <style dangerouslySetInnerHTML={{ __html: `
                [contenteditable]:empty:before {
                    content: attr(placeholder);
                    color: #9ca3af;
                    font-style: italic;
                }
            `}} />
        </div>
    );
}
