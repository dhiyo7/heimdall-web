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
    <div className="border-b-2 border-black dark:border-white transition-colors duration-300 last:border-b-0">
      <button
        className="w-full flex justify-between items-center p-4 font-bold text-left dark:text-white focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition-colors"
        onClick={onClick}
      >
        <span>{title}</span>
        <ChevronDown
          className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && <div className="dark:text-white">{children}</div>}
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
    <div className="border-2 border-black dark:border-white transition-colors duration-300">
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