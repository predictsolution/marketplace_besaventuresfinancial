import { useRouter } from 'next/router';
import HeadFooter from './head_footer';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type AccountMenuProps = {
  title: string;
  children: React.ReactNode;
};

export default function AccountMenu(props: AccountMenuProps) {
  // Hooks
  const router = useRouter();

  // States
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Use effects
  useEffect(() => {
    catchEvents();
  });

  // Functions
  const catchEvents = () => {
    // Resize
    window.addEventListener('resize', () => {
      if (isMenuOpen) {
        handleMenuOpen(true);
      }
    });

    // Click outside
    window.addEventListener('click', (event) => {
      if (isMenuOpen && event.target instanceof Element) {
        if (
          event.target.id != 'triggerMenuAccount_btn' &&
          !document
            .querySelector('#triggerMenuAccount_btn')
            ?.contains(event.target)
        )
          handleMenuOpen(true);
      }
    });
  };

  const handleMenuOpen = (force = false) => {
    setIsMenuOpen(force ? false : !isMenuOpen);
  };

  return (
    <HeadFooter title={props.title}>
      <div className="min-h-screen w-full flex">
        {/* Navbar account */}
        <div className="text-white select-none min-h-screen relative">
          {/* Menu */}
          <ul
            className={
              'w-[180px] md:w-[210px] bg-purpleDark border-t border-t-purpleLight border-r border-r-purpleLight min-h-screen absolute md:static transition-all duration-500 ease-in-out text-[15px] ' +
              (isMenuOpen ? 'left-0' : 'left-[-180px]')
            }
          >
            <li>
              <Link
                href={'/account'}
                className={
                  'px-[24px] py-[16px] border-b border-purpleLight hover:bg-purpleOpacity transition-all duration-300 ease-in-out flex items-center' +
                  (router.pathname == '/account' ? ' text-green' : '')
                }
              >
                <span className="mr-[6px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-[20px] h-[20px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </span>

                <span>Account</span>
              </Link>
            </li>
            <li>
              <Link
                href={'/account/nfts'}
                className={
                  'px-[24px] py-[16px] border-b border-purpleLight hover:bg-purpleOpacity transition-all duration-300 ease-in-out flex items-center' +
                  (router.pathname == '/account/nfts' ? ' text-green' : '')
                }
              >
                <span className="mr-[6px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-[20px] h-[20px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
                    />
                  </svg>
                </span>

                <span>NFTs</span>
              </Link>
            </li>
            <li>
              <Link
                href={'/account/coins'}
                className={
                  'px-[24px] py-[16px] border-b border-purpleLight hover:bg-purpleOpacity transition-all duration-300 ease-in-out flex items-center' +
                  (router.pathname == '/account/coins' ? ' text-green' : '')
                }
              >
                <span className="mr-[6px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-[20px] h-[20px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>

                <span>Coins</span>
              </Link>
            </li>
          </ul>

          {/* Trigger mobile menu */}
          <div
            className={
              'absolute transition-all duration-500 ease-in-out ' +
              (isMenuOpen ? 'right-[-210px]' : 'right-[-30px]')
            }
          >
            <button
              id="triggerMenuAccount_btn"
              onClick={(event) => {
                event.preventDefault();
                handleMenuOpen();
              }}
              className="bg-yellow w-[30px] text-black px-[4px] py-[10px] rounded-sm"
            >
              <span>
                <svg
                  className={
                    'w-[22px] h-[22px] transition-all duration-500 ease-in-out ' +
                    (isMenuOpen ? '-rotate-180' : 'rotate-0')
                  }
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="w-full p-[30px]">{props.children}</div>
      </div>
    </HeadFooter>
  );
}
