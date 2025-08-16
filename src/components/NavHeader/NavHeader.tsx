import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Account from '@components/Account/Account';

export default function NavHeader() {
  // Hooks
  const router = useRouter();

  // States
  const [mobileMenu, setMobileMenu] = useState(false);

  // UseEffects
  useEffect(() => {
    catchEvents();
  });

  // Functions
  const catchEvents = () => {
    // Close mobile menu on windows resize
    window.addEventListener('resize', () => {
      if (mobileMenu) {
        toggleMenu_mobile(true);
      }
    });

    // Close mobile menu on click outside
    document.addEventListener('click', (event) => {
      if (mobileMenu && event.target instanceof Element) {
        if (
          event.target.id != 'triggerMobileMenu' &&
          !document.querySelector('#triggerMobileMenu')?.contains(event.target)
        )
          toggleMenu_mobile(true);
      }
    });
  };

  const toggleMenu_mobile = (force = false) => {
    setMobileMenu(force ? false : !mobileMenu);
  };

  // Render
  return (
    <div>
      <header className=" bg-purpleDark flex justify-between items-center px-[30px] mobile:px-[60px] py-[10px] select-none relative">
        {/* Logo */}
        <div className="w-[40px] md:w-[50px]">
          <Link href={'/'}>
            <Image
              src={'/static/resources/images/besa_gaming_logo.webp'}
              alt="Besa gaming brand logo"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto"
            />
          </Link>
        </div>

        {/* Menu */}
        <nav className="text-white font-normal md:font-light text-[15px] md:text-[14px] flex items-center justify-end">
          <ul
            className={
              'flex flex-col md:flex-row md:items-center md:justify-end fixed md:static top-0  bottom-0 bg-purpleDark md:bg-transparent w-[180px] xsm:w-[200px] md:w-auto transition-all duration-500 ease-in-out z-[200] ' +
              (mobileMenu ? 'left-0' : 'left-[-180px] xsm:left-[-200px]')
            }
          >
            <li
              className={
                'md:mx-[12px] hover:text-green transition-all duration-300 ease-in-out md:px-[10px] md:py-[2px] ' +
                (router.pathname == '/'
                  ? 'text-green md:border-[2px] border-green rounded-tl-[14px] rounded-br-[14px]'
                  : '')
              }
            >
              <Link
                className={
                  'border-b block md:inline-block px-[24px] py-[16px] md:py-0 md:px-0 md:border-0 ' +
                  (router.pathname == '/'
                    ? 'border-green'
                    : 'border-whiteOpacity')
                }
                href={'/'}
              >
                Dashboard
              </Link>
            </li>

            <li
              className={
                'md:mx-[12px] hover:text-green transition-all duration-300 ease-in-out md:px-[10px] md:py-[2px] ' +
                (router.pathname == '/marketplace'
                  ? 'text-green md:border-[2px] border-green rounded-tl-[14px] rounded-br-[14px]'
                  : '')
              }
            >
              <Link
                className={
                  'border-b block md:inline-block px-[24px] py-[16px] md:py-0 md:px-0 md:border-0 ' +
                  (router.pathname == '/marketplace'
                    ? 'border-green'
                    : 'border-whiteOpacity')
                }
                href={'/marketplace'}
              >
                Marketplace
              </Link>
            </li>

            <li
              className={
                'md:mx-[12px] hover:text-green transition-all duration-300 ease-in-out md:px-[10px] md:py-[2px] ' +
                (router.pathname == '/games'
                  ? 'text-green md:border-[2px] border-green rounded-tl-[14px] rounded-br-[14px]'
                  : '')
              }
            >
              <Link
                className={
                  'border-b block md:inline-block px-[24px] py-[16px] md:py-0 md:px-0 md:border-0 ' +
                  (router.pathname == '/games'
                    ? 'border-green'
                    : 'border-whiteOpacity')
                }
                href={'/games'}
              >
                Games
              </Link>
            </li>
          </ul>

          <div
            className={
              'fixed left-0 top-0 bottom-0 right-0 z-[180] md:hidden bg-purpleOpacity' +
              (mobileMenu ? '' : ' hidden')
            }
          ></div>

          {/* Account menu */}
          <Account
            stateMobile_menu={mobileMenu}
            triggerMobile_menu={() => {
              toggleMenu_mobile();
            }}
          />
        </nav>
      </header>
    </div>
  );
}
