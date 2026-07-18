import React, { useState, Children, cloneElement, isValidElement } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onClick?: () => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen = false, onClick }) => {
  return (
    <div className="border-b border-slate-150 dark:border-zinc-900 transition-colors duration-300 last:border-b-0">
      <button
        className="w-full flex justify-between items-center p-4 font-sans font-bold text-slate-800 dark:text-zinc-200 text-sm hover:bg-slate-50/60 dark:hover:bg-zinc-900/40 focus:outline-none transition-colors"
        onClick={onClick}
      >
        <span>{title}</span>
        <ChevronDown
          size={16}
          className={`transform transition-transform duration-250 text-slate-400 dark:text-zinc-500 ${isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''}`}
        />
      </button>
      {isOpen && <div className="border-t border-slate-50 dark:border-zinc-950 bg-slate-50/20 dark:bg-zinc-950/20">{children}</div>}
    </div>
  );
};

interface AccordionProps {
  children: React.ReactNode;
  defaultOpenIndex?: number;
}

export const Accordion: React.FC<AccordionProps> = ({ children, defaultOpenIndex }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex !== undefined ? defaultOpenIndex : null);

  const handleItemClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="divide-y divide-slate-150 dark:divide-zinc-900 transition-colors duration-300">
      {Children.map(children, (child, index) => {
        if (isValidElement<AccordionItemProps>(child)) {
          return cloneElement(child, {
            isOpen: openIndex === index,
            onClick: () => handleItemClick(index),
          });
        }
        return child;
      })}
    </div>
  );
};