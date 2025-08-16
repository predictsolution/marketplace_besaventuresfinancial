import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import NavHeader from '@components/NavHeader/NavHeader';
import Image from 'next/image';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import AccountLogin from '@components/Account/AccountLogin';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { hiddenLogin } from '@slices/interfaceStatus_slice';
import { useSession } from 'next-auth/react';
import { useAccount } from 'wagmi';

type HeadFooterProps = {
  title: string;
  children: React.ReactNode;
};

const HeadFooter = (props: HeadFooterProps) => {
  // Session
  const { status: status_session, data: session } = useSession();
  const { address: user_address, isConnected } = useAccount();

  // Store
  const InterfaceStatus = useSelector(
    (state: RootState) => state.InterfaceStatus
  );
  const dispatch = useDispatch();

  // Status
  const [titleHead, setTitle_head] = useState('');

  useEffect(() => {
    setTitle_head(props.title + ' - Satoshi Yolo swap');
  }, [props.title]);

  // Funtions
  // Close menus
  const closeLogin_menu = () => {
    if (InterfaceStatus.loginStatus) dispatch(hiddenLogin());
  };

  // Render
  return (
    <div>
      {/* Meta info*/}
      <Head>
        {/* Meta */}
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Access our games, buy nfts, measure your progress and win from our decentralized application"
        />
        <meta
          name="keywords"
          content="blockchain, nft, crypto, game, dapp, play to earn, bnb, marketplace"
        />

        {/* Cfg */}
        <link
          rel="shortcut icon"
          href="/static/resources/images/besa_gaming_favicon.webp"
          type="image/x-icon"
        />
        <title>{titleHead as string}</title>
      </Head>

      {/* Main Navbar */}
      <NavHeader />

      {/* Body */}
      <div className="bg-purple">
        <Toaster />
        {props.children}
      </div>

      {/* Login Menu */}
      {InterfaceStatus.loginStatus && (!session || !isConnected) ? (
        <AccountLogin closeMenu={() => closeLogin_menu()} />
      ) : null}

      {/* Footer */}
      <div>
        <footer className="bg-purple px-[30px] xsm:px-[60px] mobile:px-[80px] pt-[80px] border-t border-purpleLight">
          <div className="flex flex-col mobile:flex-row flex-wrap justify-between items-center">
            {/* Logo */}
            <div className="mb-[50px]">
              <div className="select-none cursor-default w-[70px] xxsm:w-[90px] xsm:w-[100px] mobile:w-[120px]">
                <Image
                  src={'/static/resources/images/besa_gaming_logo.webp'}
                  alt="Besa gaming logo on footer"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Menus */}
            <div className="mb-[50px] flex select-none text-white">
              {/* Item */}
              <div className="mr-[30px] xxsm:mr-[60px] xsm:mr-[100px] border-l-[2px] border-purpleExtraLight flex flex-col justify-between h-[170px] pl-[18px] xxsm:pl-[26px] py-[6px]">
                <Link
                  href={'/'}
                  className="text-[14px] transition-colors duration-300 ease-in-out hover:text-green inline-block"
                >
                  Dashboard
                </Link>

                <Link
                  href={'/marketplace'}
                  className="text-[14px] transition-colors duration-300 ease-in-out hover:text-green inline-block"
                >
                  Marketplace
                </Link>

                <Link
                  href={'/games'}
                  className="text-[14px] transition-colors duration-300 ease-in-out hover:text-green inline-block"
                >
                  Games
                </Link>

                <Link
                  href={'https://www.besagaming.com/en'}
                  className="text-[14px] transition-colors duration-300 ease-in-out hover:text-green inline-block"
                >
                  WebSite
                </Link>
              </div>

              {/* Item */}
              <div className="border-l-[2px] border-purpleExtraLight flex flex-col justify-between h-[170px] pl-[18px] xxsm:pl-[26px] py-[6px]">
                <Link
                  href={'https://whitepaper.besagaming.com/gameplay/game'}
                  target="_blank"
                  className="text-[14px] transition-colors duration-300 ease-in-out hover:text-green inline-block"
                >
                  Instructions
                </Link>
                <Link
                  href={
                    'https://whitepaper.besagaming.com/official-channels/socials'
                  }
                  target="_blank"
                  className="text-[14px] transition-colors duration-300 ease-in-out hover:text-green inline-block"
                >
                  Community
                </Link>
                <Link
                  href={'https://whitepaper.besagaming.com/faqs/terms-of-use'}
                  target="_blank"
                  className="text-[14px] transition-colors duration-300 ease-in-out hover:text-green inline-block"
                >
                  FAQ
                </Link>
                <Link
                  href="https://whitepaper.besagaming.com/"
                  target="_blank"
                  className="text-[14px] transition-colors duration-300 ease-in-out hover:text-green inline-block"
                >
                  Whitepaper
                </Link>
              </div>
            </div>

            {/* Socials */}
            <div className="cursor-default">
              <div>
                {/* Title */}
                <div className="mb-[8px] text-center text-purpleExtraLight text-[20px] uppercase">
                  <h3>Join our community</h3>
                </div>

                <div className="flex justify-center mobile:justify-end">
                  {/* Telegram */}
                  <a
                    href="https://t.me/GamingUmbrella"
                    aria-label="Telegram Link"
                    target="_blank"
                    className="mx-[10px] transition-all duration-300 ease-in-out hover:opacity-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 240 240"
                      className="w-[26px] h-[26px]"
                    >
                      <path
                        d="M66.964 134.874s-32.08-10.062-51.344-16.002c-17.542-6.693-1.57-14.928 6.015-17.59 7.585-2.66 186.38-71.948 194.94-75.233 8.94-4.147 19.884-.35 14.767 18.656-4.416 20.407-30.166 142.874-33.827 158.812-3.66 15.937-18.447 6.844-18.447 6.844l-83.21-61.442z"
                        fill="#ffffff"
                        stroke="transparent"
                        strokeWidth={10}
                      ></path>
                      <path
                        d="M92.412 201.62s4.295.56 8.83-3.702c4.536-4.26 26.303-25.603 26.303-25.603"
                        fill="none"
                        stroke="transparent"
                        strokeWidth={10}
                      ></path>
                      <path
                        d="M66.985 134.887l28.922 14.082-3.488 52.65s-4.928.843-6.25-3.613c-1.323-4.455-19.185-63.12-19.185-63.12z"
                        fillRule="evenodd"
                        stroke="transparent"
                        strokeWidth={10}
                        strokeLinejoin="bevel"
                      ></path>
                      <path
                        d="M66.985 134.887s127.637-77.45 120.09-71.138c-7.55 6.312-91.168 85.22-91.168 85.22z"
                        fillRule="evenodd"
                        stroke="transparent"
                        strokeWidth={9.67}
                        strokeLinejoin="bevel"
                      ></path>
                    </svg>
                  </a>

                  {/* Discord */}
                  <a
                    href="https://discord.com/invite/BChUf6tC"
                    aria-label="Discord Link"
                    target="_blank"
                    className="mx-[8px] transition-all duration-300 ease-in-out hover:opacity-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#fff"
                      className="w-[26px] h-[26px]"
                      viewBox="0 0 16 16"
                    >
                      <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"></path>
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://instagram.com/besa_gaming_umbrella/"
                    aria-label="Instagram Link"
                    target="_blank"
                    className="mx-[8px] transition-all duration-300 ease-in-out hover:opacity-50"
                  >
                    <svg
                      fill="#fff"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      className="w-[26px] h-[26px]"
                    >
                      <path d="M 16.5 5 C 10.16639 5 5 10.16639 5 16.5 L 5 31.5 C 5 37.832757 10.166209 43 16.5 43 L 31.5 43 C 37.832938 43 43 37.832938 43 31.5 L 43 16.5 C 43 10.166209 37.832757 5 31.5 5 L 16.5 5 z M 16.5 8 L 31.5 8 C 36.211243 8 40 11.787791 40 16.5 L 40 31.5 C 40 36.211062 36.211062 40 31.5 40 L 16.5 40 C 11.787791 40 8 36.211243 8 31.5 L 8 16.5 C 8 11.78761 11.78761 8 16.5 8 z M 34 12 C 32.895 12 32 12.895 32 14 C 32 15.105 32.895 16 34 16 C 35.105 16 36 15.105 36 14 C 36 12.895 35.105 12 34 12 z M 24 14 C 18.495178 14 14 18.495178 14 24 C 14 29.504822 18.495178 34 24 34 C 29.504822 34 34 29.504822 34 24 C 34 18.495178 29.504822 14 24 14 z M 24 17 C 27.883178 17 31 20.116822 31 24 C 31 27.883178 27.883178 31 24 31 C 20.116822 31 17 27.883178 17 24 C 17 20.116822 20.116822 17 24 17 z"></path>
                    </svg>
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://facebook.com/BesaGamingCompany"
                    aria-label="Facebook Link"
                    target="_blank"
                    className="mx-[8px] transition-all duration-300 ease-in-out hover:opacity-50"
                  >
                    <svg
                      fill="#fff"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-[26px] h-[26px]"
                    >
                      <path d="M16.403,9H14V7c0-1.032,0.084-1.682,1.563-1.682h0.868c0.552,0,1-0.448,1-1V3.064c0-0.523-0.401-0.97-0.923-1.005 C15.904,2.018,15.299,1.999,14.693,2C11.98,2,10,3.657,10,6.699V9H8c-0.552,0-1,0.448-1,1v2c0,0.552,0.448,1,1,1l2-0.001V21 c0,0.552,0.448,1,1,1h2c0.552,0,1-0.448,1-1v-8.003l2.174-0.001c0.508,0,0.935-0.381,0.993-0.886l0.229-1.996 C17.465,9.521,17.001,9,16.403,9z"></path>
                    </svg>
                  </a>

                  {/* Twitter */}
                  <a
                    href="https://twitter.com/besagaming"
                    aria-label="Twitter Link"
                    target="_blank"
                    className="mx-[8px] transition-all duration-300 ease-in-out hover:opacity-50"
                  >
                    <svg
                      fill="#fff"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 30 30"
                      className="w-[26px] h-[26px]"
                    >
                      <path d="M28,6.937c-0.957,0.425-1.985,0.711-3.064,0.84c1.102-0.66,1.947-1.705,2.345-2.951c-1.03,0.611-2.172,1.055-3.388,1.295 c-0.973-1.037-2.359-1.685-3.893-1.685c-2.946,0-5.334,2.389-5.334,5.334c0,0.418,0.048,0.826,0.138,1.215 c-4.433-0.222-8.363-2.346-10.995-5.574C3.351,6.199,3.088,7.115,3.088,8.094c0,1.85,0.941,3.483,2.372,4.439 c-0.874-0.028-1.697-0.268-2.416-0.667c0,0.023,0,0.044,0,0.067c0,2.585,1.838,4.741,4.279,5.23 c-0.447,0.122-0.919,0.187-1.406,0.187c-0.343,0-0.678-0.034-1.003-0.095c0.679,2.119,2.649,3.662,4.983,3.705 c-1.825,1.431-4.125,2.284-6.625,2.284c-0.43,0-0.855-0.025-1.273-0.075c2.361,1.513,5.164,2.396,8.177,2.396 c9.812,0,15.176-8.128,15.176-15.177c0-0.231-0.005-0.461-0.015-0.69C26.38,8.945,27.285,8.006,28,6.937z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* All rights */}
          <div className="mt-[60px] px-[20px] mobile:px-[30px] cursor-default">
            <p className="text-center text-[15px] xxsm:text-[16px] mobile:text-[17px] border-t border-purpleLight pt-[10px] pb-[20px] text-white">
              ©2022, all rights reserved
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HeadFooter;
