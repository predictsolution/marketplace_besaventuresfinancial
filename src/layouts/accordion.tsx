import React, { useState } from 'react';

export default function AccordionLayout({
  title,
  active,
  children,
}: {
  title: string;
  active: boolean;
  children: React.ReactNode;
}) {
  const [activated, setActivated] = useState(active);

  const toggleAccordion = () => {
    activated ? setActivated(false) : setActivated(true);
  };

  return (
    <div className="py-[16px] px-[20px]">
      {/* Title */}
      <div
        onClick={() => toggleAccordion()}
        className="flex flex-nowrap justify-between cursor-pointer"
      >
        <div className="font-semibold text-[15px]">{title}</div>
        <div
          className={
            'transition-all ease-in-out duration-500' +
            (activated ? ' rotate-180' : '')
          }
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-[18px] h-[18px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Children */}
      <div
        className={
          'transition-all ease-in-out duration-500 h-0 overflow-hidden' +
          (activated ? ' pt-[16px] h-[130px]' : '')
        }
      >
        {children}
      </div>
    </div>
  );
}
