import { TOAST_CFG } from '@utils/main_utils';
import { getCsrfToken, signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { SiweMessage } from 'siwe';
import { useAccount, useConnect, useNetwork, useSignMessage } from 'wagmi';
import { bsc } from 'wagmi/chains';
import Image from 'next/image';

export default function AccountLogin({ closeMenu }: { closeMenu: () => void }) {
  // Hooks to login
  const { signMessageAsync } = useSignMessage();
  const { chain } = useNetwork();
  const {
    address: user_address,
    isConnected,
    connector: currentConnector,
  } = useAccount();
  const { connect, isLoading, pendingConnector, connectors } = useConnect();

  // Hooks session
  const { data: session, status } = useSession();

  // States
  const [metamaskDisabled, setMetamas_disabled] = useState(false);

  // Effect
  useEffect(() => {
    if (isConnected && !session) {
      initLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  useEffect(() => {
    //@ts-ignore
    if (window.ethereum === undefined) {
      setMetamas_disabled(true);
    }
  }, []);

  // Functiones
  const initLogin = async (provider = '') => {
    // Connectors description
    // 0: MetaMask
    // 1: WalletConnect

    if (!isConnected) {
      connect({
        connector:
          provider == 'MetaMask' && !metamaskDisabled
            ? connectors[0]
            : connectors[1],
        chainId: bsc.id,
      });

      return;
    }

    try {
      const callbackUrl = '/';

      const message = new SiweMessage({
        domain: window.location.host,
        address: user_address,
        statement:
          'Welcome to Besa Gaming. Check your account at ' +
          window.location.host,
        uri: window.location.origin,
        version: '1',
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      const result = await signIn('credentials', {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      });

      if (result != undefined) {
        if (result.error || !result.ok)
          toast.error(
            'An error has occurred, please try again later.',
            TOAST_CFG
          );
      }
    } catch (error) {
      toast.error('An error has occurred, please try again later.', TOAST_CFG);
    }
  };

  // Render
  return (
    <div
      onClick={(event) => {
        // Close account menu
        if (event.target instanceof Element) {
          if (
            event.target.id == 'boxAccount_login' ||
            document.querySelector('#boxAccount_login')?.contains(event.target)
          )
            return;
        }
        closeMenu();
      }}
      className="fixed top-0 bottom-0 right-0 left-0 bg-purpleOpacity text-white flex justify-center items-center px-[30px] xsm:px-0 z-[250]"
    >
      <div
        className="bg-purpleLight py-[42px] px-[22px] xsm:px-[36px] rounded-lg w-full xsm:w-[400px] md:w-[500px] relative"
        id="boxAccount_login"
      >
        {/* Close button */}
        <div className="absolute top-[12px] right-[12px] hover:text-red transition-all duration-300 ease-in-out">
          <button
            aria-label="Close Login Menu"
            id="closeLoginMenu"
            onClick={(event) => {
              event.preventDefault();
              closeMenu();
            }}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
          </button>
        </div>

        {/* Body */}
        <div>
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-[50px] xsm:w-[60px]">
              <Image
                src={'/static/resources/images/besa_gaming_logo.webp'}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto"
                alt="Besa gaming brand logo"
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-[17px] xxsm:text-[18px] xsm:text-[20px] mt-[18px] font-semibold text-center text-white uppercase">
            <h3>Connect Wallet</h3>
          </div>

          {/* Login options */}
          <div className="mt-[22px]">
            <ul>
              {/* Metamask */}
              <li>
                <button
                  aria-label="Login with Metamask"
                  id="loginMetamask"
                  onClick={(event) => {
                    event.preventDefault();

                    if (
                      !session &&
                      !isConnected &&
                      !metamaskDisabled &&
                      !isLoading &&
                      !pendingConnector
                    ) {
                      initLogin('MetaMask');
                    } else if (metamaskDisabled) {
                      toast.custom(
                        (t) => (
                          <div className="bg-white p-4 rounded-lg">
                            <div className="flex items-center">
                              <div className="text-lg text-red">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </div>
                              <div className="ml-3 text-black">
                                <p className="font-medium">
                                  <span>Metamask is not installed.</span>
                                  <a
                                    className="ml-[6px] text-blue"
                                    href="https://metamask.io/download/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Click here to install
                                  </a>
                                </p>
                              </div>
                            </div>
                          </div>
                        ),
                        {
                          id: 'metamask-not-installed',
                        }
                      );
                    }
                  }}
                  className={
                    'flex justify-center items-center rounded-[4px] py-[4px] px-[8px] transition-all duration-300 ease-in-out w-full' +
                    (isLoading &&
                    (pendingConnector || currentConnector?.name == 'MetaMask')
                      ? ' cursor-not-allowed'
                      : '') +
                    (metamaskDisabled
                      ? ' cursor-not-allowed bg-transparent border-whiteOpacity border'
                      : ' bg-purpleExtraLight hover:bg-purple')
                  }
                >
                  {/* Logo */}
                  <span className="mr-[6px]">
                    <Image
                      src={'/static/resources/images/icons/metamask_logo.png'}
                      width={32}
                      height={32}
                      alt="Metamask logo"
                    />
                  </span>

                  {/* Text */}
                  <span className="uppercase font-semibold text-[12px] xxsm:text-[13px]">
                    {isLoading && currentConnector?.name == 'MetaMask'
                      ? 'Connecting...'
                      : 'Login with Metamask'}
                  </span>
                </button>
              </li>

              {/* Wallet Connect */}
              <li className="mt-[18px]">
                <button
                  aria-label="Login with Wallet Connect"
                  id="loginWalletConnect"
                  onClick={(event) => {
                    event.preventDefault();

                    if (
                      !session &&
                      !isConnected &&
                      !metamaskDisabled &&
                      !isLoading &&
                      !pendingConnector
                    ) {
                      initLogin('WalletConnect');
                    }
                  }}
                  className={
                    'flex justify-center items-center rounded-[4px] py-[4px] px-[8px] transition-all duration-300 ease-in-out w-full' +
                    (isLoading &&
                    (pendingConnector ||
                      currentConnector?.name == 'walletConnect')
                      ? ' cursor-not-allowed'
                      : '') +
                    (metamaskDisabled
                      ? ' cursor-not-allowed bg-transparent border-whiteOpacity border'
                      : ' bg-purpleExtraLight hover:bg-purple')
                  }
                >
                  {/* Logo */}
                  <span className="mr-[6px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      version="1.1"
                      baseProfile="basic"
                      id="Layer_1"
                      x="0px"
                      y="0px"
                      className="w-[32px] h-[32px]"
                      viewBox="0 0 387.6 237.6"
                      xmlSpace="preserve"
                    >
                      <path
                        id="WalletConnect_00000073703063438220642730000002917717552236472496_"
                        fill="#3B99FC"
                        d="M79.4,46.4 c63.2-61.9,165.7-61.9,228.9,0l7.6,7.4c3.2,3.1,3.2,8.1,0,11.2l-26,25.5c-1.6,1.5-4.1,1.5-5.7,0l-10.5-10.3 c-44.1-43.2-115.6-43.2-159.7,0l-11.2,11c-1.6,1.5-4.1,1.5-5.7,0L71,65.8c-3.2-3.1-3.2-8.1,0-11.2L79.4,46.4z M362.1,99.1l23.2,22.7 c3.2,3.1,3.2,8.1,0,11.2L280.8,235.3c-3.2,3.1-8.3,3.1-11.4,0c0,0,0,0,0,0l-74.1-72.6c-0.8-0.8-2.1-0.8-2.9,0c0,0,0,0,0,0 l-74.1,72.6c-3.2,3.1-8.3,3.1-11.4,0c0,0,0,0,0,0L2.4,133c-3.2-3.1-3.2-8.1,0-11.2l23.2-22.7c3.2-3.1,8.3-3.1,11.4,0l74.1,72.6 c0.8,0.8,2.1,0.8,2.9,0c0,0,0,0,0,0l74.1-72.6c3.2-3.1,8.3-3.1,11.4,0c0,0,0,0,0,0l74.1,72.6c0.8,0.8,2.1,0.8,2.9,0l74.1-72.6 C353.8,96,358.9,96,362.1,99.1z"
                      />
                    </svg>
                  </span>

                  {/* Text */}
                  <span className="uppercase font-semibold text-[12px] xxsm:text-[13px]">
                    {isLoading && currentConnector?.name == 'WalletConnect'
                      ? 'Connecting...'
                      : 'Login with Wallet Connect'}
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
