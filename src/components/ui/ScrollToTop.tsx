import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-3 bg-[var(--color-background)] border border-[var(--color-border)] shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="w-6 h-6 text-[var(--color-text-primary)] group-hover:scale-110 transition-transform" />
                </button>
            )}
        </>
    );
};