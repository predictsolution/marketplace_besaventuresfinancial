import React from 'react';

export default function InputMessage({
  message = '',
  success = false,
  show = false,
  className = '',
}) {
  const renderIcon_state = () => {
    if (success) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-[16px] h-[16px]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
      );
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-[16px] h-[16px]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      );
    }
  };
  return (
    <div
      className={
        `${className} w-full transition-all duration-300 ease-in-out rounded-[4px]` +
        (success
          ? ' border border-green text-green'
          : ' border border-grayLight text-danger') +
        (show ? '' : ' hidden')
      }
    >
      <p className="flex">
        <span className="mr-[4px]">{renderIcon_state()}</span>
        {message}
      </p>
    </div>
  );
}
