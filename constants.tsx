
import React from 'react';

export const LoadingIcon: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const WandIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v1.046a1 1 0 01.993.883l.007.117v1.046a1 1 0 01-1.993.117L11 4.117V2.046a1 1 0 01.3-.7zM4.9 8.046A1 1 0 015 9v1.046a1 1 0 01.993.883l.007.117v1.046a1 1 0 01-1.993.117L4 11.117V9.046a1 1 0 01.9-.999zM15.9 8.046a1 1 0 011 .999v2.071a1 1 0 01-1.993.117L15 11.117V9.046a1 1 0 01.9-.999zM8.53 4.22a1 1 0 010 1.414l-4.242 4.243a1 1 0 11-1.415-1.415l4.243-4.242a1 1 0 011.414 0zM15.708 4.22a1 1 0 010 1.414l-4.243 4.243a1 1 0 11-1.414-1.415l4.242-4.242a1 1 0 011.415 0zm-2.829 8.485a1 1 0 011.415 0l4.242 4.242a1 1 0 11-1.415 1.415l-4.242-4.243a1 1 0 010-1.414zM5.687 12.707a1 1 0 011.414 0l4.243 4.243a1 1 0 01-1.414 1.414l-4.243-4.242a1 1 0 010-1.415z" clipRule="evenodd" />
    </svg>
);

export const ChatBubbleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.083-3.25A8.825 8.825 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.416 14.158A6.86 6.86 0 0010 15c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6c0 1.31.424 2.514 1.173 3.55l-.62 1.861 1.862-.62z" clipRule="evenodd" />
    </svg>
);

export const InfoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const UndoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8a5 5 0 000-10H9" />
    </svg>
);

export const RedoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 15l3-3m0 0l-3-3m3 3H5a5 5 0 000 10h8" />
    </svg>
);

export const GlobeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.043l1.414-1.414a1 1 0 011.414 0l1.414 1.414M12 21a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
);

export const VeravoxLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg className={className} viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(0, 2)">
            <path d="M20 35C11.7157 35 5 28.2843 5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20C35 28.2843 28.2843 35 20 35Z" fill="#FBBF24"/>
            <path d="M20 12C16.6863 12 14 9.31371 14 6C14 2.68629 16.6863 0 20 0C23.3137 0 26 2.68629 26 6C26 9.31371 23.3137 12 20 12Z" fill="#1F2937"/>
            <circle cx="18" cy="5" r="1" fill="white"/>
            <circle cx="22" cy="5" r="1" fill="white"/>
            <path d="M5.12789 18C2.12937 12.8333 9.47398 5.62063 19.5 5.00001" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M34.8721 18C37.8706 12.8333 30.526 5.62064 20.5 5.00001" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20" y1="12" x2="20" y2="35" stroke="#4A5568" strokeWidth="1"/>
            <circle cx="15" cy="20" r="2.5" fill="#1F2937"/>
            <circle cx="25" cy="20" r="2.5" fill="#1F2937"/>
            <circle cx="20" cy="28" r="2.5" fill="#1F2937"/>
        </g>
        <text x="45" y="29" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" fontSize="26" fontWeight="bold" fill="#1F2937">veravox</text>
    </svg>
);