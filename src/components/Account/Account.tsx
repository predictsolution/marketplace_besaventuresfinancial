import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { useAccount, useDisconnect } from 'wagmi';
import AccountLogin from './AccountLogin';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { hiddenLogin, showLogin } from '@slices/interfaceStatus_slice';

interface Props {
  triggerMobile_menu: () => void;
  stateMobile_menu: boolean;
}

export default function AccountMenu(props: Props) {
  // Session
  const { isConnected } = useAccount();
  const { disconnect: disconnect_wallet } = useDisconnect();
  const { status: status_session, data: session } = useSession();

  // States
  const [deployAccount_menu, setDeployAccount_menu] = useState(false);

  // Store
  const InterfaceStatus = useSelector(
    (state: RootState) => state.InterfaceStatus
  );
  const dispatch = useDispatch();

  // UseEffect
  useEffect(() => {
    catchEventListeners();
  });

  useEffect(() => {
    if (session) dispatch(hiddenLogin());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // *************** //
  // Functions
  // *************** //
  // Catch events
  const catchEventListeners = () => {
    document.addEventListener('click', (event) => {
      // Close account menu
      if (deployAccount_menu && event.target instanceof Element) {
        if (
          event.target.id != 'triggerAccountMenu' &&
          !document.querySelector('#triggerAccountMenu')?.contains(event.target)
        )
          setDeployAccount_menu(false);
      }
    });
  };

  // Triggers
  const triggerAccount_menu = () => {
    setDeployAccount_menu(deployAccount_menu ? false : true);
  };

  const triggerLogin_menu = () => {
    dispatch(InterfaceStatus.loginStatus ? hiddenLogin() : showLogin());
  };

  // Icons
  const renderIconMobile = () => {
    if (props.stateMobile_menu) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-[34px] h-[34px]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      );
    }

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-[34px] h-[34px]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        ></path>
      </svg>
    );
  };

  return (
    <div className="ml-[12px] flex items-center relative text-[14px] font-light">
      {status_session == 'unauthenticated' || !session?.user ? (
        <button
          id="connectWallet_trigger"
          aria-label="Connect Wallet"
          onClick={(event) => {
            event.preventDefault();

            triggerLogin_menu();
          }}
          className="text-[15px] flex items-center px-[10px] py-[4px] border-[2px] border-green rounded-tl-[14px] rounded-br-[14px] bg-green text-purple font-bold transition-all duration-500 ease-in-out hover:shadow-md hover:shadow-green"
        >
          <span className="xsm:mr-[6px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-[22] h-[22px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
          </span>
          <span className="hidden xsm:inline-block">Connect Wallet</span>
        </button>
      ) : (
        <>
          <div>
            {/* Trigger */}
            <button
              aria-label="Account Menu Trigger"
              id="triggerAccountMenu"
              className="flex items-center"
              onClick={(event) => {
                event.preventDefault();
                triggerAccount_menu();
              }}
            >
              {/* Arrow */}
              <span
                className={
                  'text-green mr-[6px] transform transition-all duration-500 ease-in-out ' +
                  (deployAccount_menu ? 'rotate-180' : 'rotate-0')
                }
              >
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

              {/* Icon */}
              <span>
                <Image
                  src="/static/resources/images/icons/account_besa.webp"
                  alt="user account besa"
                  width={39}
                  height={39}
                />
              </span>
            </button>

            {/* Account menu */}
            <div
              className={
                'absolute bg-purple left-0 top-[50px] border-[2px] rounded-tr-[14px] rounded-bl-[14px] transition-all duration-500 ease-in-out w-auto overflow-hidden z-[100] ' +
                (deployAccount_menu
                  ? 'border-green h-[136px]'
                  : 'h-0 border-transparent')
              }
            >
              <ul className="w-full">
                <li>
                  <Link
                    href={'/account'}
                    className="px-[14px] py-[6px] w-full inline-block hover:text-green transition-all duration-300 ease-in-out"
                  >
                    Account
                  </Link>
                </li>
                <li>
                  <Link
                    href={'/account/nfts'}
                    className="px-[14px] py-[6px] w-full inline-block hover:text-green transition-all duration-300 ease-in-out"
                  >
                    NFTs
                  </Link>
                </li>
                <li>
                  <Link
                    href={'/account/coins'}
                    className="px-[14px] py-[6px] w-full inline-block hover:text-green transition-all duration-300 ease-in-out"
                  >
                    Coins
                  </Link>
                </li>
                <li>
                  <button
                    aria-label="Logout Account"
                    id="logoutAccount"
                    onClick={(event) => {
                      event.preventDefault();

                      if (!isConnected && !session) return;

                      disconnect_wallet();
                      signOut({
                        callbackUrl: '/',
                        redirect: true,
                      });
                    }}
                    className="px-[14px] py-[6px] w-full inline-block hover:text-red transition-all duration-300 ease-in-out"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}

      {/* Trigger mobile menu */}
      <div
        id="triggerMobileMenu"
        className={
          'relative border-r  md:hidden z-[300] ml-[12px] opacity-80 hover:opacity-100 transition-all duration-300 ease-in-out ' +
          (props.stateMobile_menu ? 'border-red' : 'border-green')
        }
      >
        <button
          aria-label="Mobile Menu Trigger"
          id="buttontMobileMenu"
          onClick={(event) => {
            event.preventDefault();
            props.triggerMobile_menu();
          }}
          className="bg-transparent z-[310] trigger_mobileMenu"
        >
          <span className="text-white">{renderIconMobile()}</span>
        </button>
      </div>
    </div>
  );
}
