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
    <div className="border-b-2 border-black">
      <button
        className="w-full flex justify-between items-center p-4 font-bold text-left"
        onClick={onClick}
      >
        <span>{title}</span>
        <ChevronDown
          className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && <div className="p-4">{children}</div>}
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
    <div className="border-2 border-black">
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