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
    <div className="border-b border-[var(--color-border)] transition-colors duration-300 last:border-b-0">
      <button
        className="w-full flex justify-between items-center p-4 font-sans font-medium text-[var(--color-text-secondary)] text-sm hover:bg-[var(--color-border)] transition-colors duration-200"
        onClick={onClick}
      >
        <span>{title}</span>
        <ChevronDown
          size={16}
          className={`transform transition-transform duration-250 text-[var(--color-text-muted)] ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && <div className="border-t border-[var(--color-border)] bg-[var(--color-background)]">{children}</div>}
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
    <div className="divide-y divide-[var(--color-border)] transition-colors duration-300">
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