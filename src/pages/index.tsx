import React, { useState } from 'react';
import HeadFooter from 'layouts/head_footer';
import Link from 'next/link';
import {
  useContractInfiniteReads,
  useContractRead,
  paginatedIndexesConfig,
} from 'wagmi';
import { BESA_OG_NFTS_ADDRESS } from '@utils/main_utils';
import { parseBigintTo_number, reduceTotalOwners } from '@utils/ether_utils';
import Spinner from '@components/Utils/Spinner';
import ABI_BESA_OG from '@abis/abi_besa_og_nfts.json';

export default function IndexApp() {
  // States
  const [supplyLoad, setSupplyLoad] = useState(false);
  const [ownersLoad, setOwnersLoad] = useState(false);

  // Hooks
  const { data: totalSupply } = useContractRead({
    address: BESA_OG_NFTS_ADDRESS,
    abi: ABI_BESA_OG,
    functionName: 'totalSupply',
    onSuccess(data: any) {
      setSupplyLoad(true);
    },
    cacheTime: 0,
  });

  const { data: ownerAddresses, fetchNextPage } = useContractInfiniteReads({
    cacheKey: 'ownersAddresses',
    ...paginatedIndexesConfig(
      //@ts-ignore
      (index) => {
        return [
          {
            address: BESA_OG_NFTS_ADDRESS,
            abi: ABI_BESA_OG,
            functionName: 'ownerOf',
            args: [index] as const,
          },
        ];
      },
      { start: 1, perPage: 100, direction: 'increment' }
    ),
    onSuccess() {
      setOwnersLoad(true);
    },
  });

  // Render
  return (
    <HeadFooter title="Home">
      <div className="px-[30px] mobile:px-[60px] py-[80px]">
        {/* New */}
        <div className="mb-[52px]">
          <div className="w-full border-dashed border-[2px] border-purpleLight rounded-xl select-none">
            <span className="text-[15px] xxsm:text-[16px] sm:text-[18px] uppercase text-purpleExtraLight px-[32px] py-[20px] sm:py-[42px] block text-center">
              Good news coming soon
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="text-white text-[24px] xxsm:text-[26px] sm:text-[32px] font-bold w-full border-b border-purpleExtraLight cursor-default pb-[16px]">
          <h2 className="tracking-[1px] sm:tracking-[2px]">Dashboard</h2>
        </div>

        {/* Statistics */}
        <div className="text-white my-[60px] xsm:my-[80px] flex flex-col mobile:flex-row justify-center items-center mobile:items-stretch cursor-default">
          {/* One */}
          <div className="flex flex-col xsm:flex-row justify-between items-center w-full xxsm:w-[90%] mobile:w-[50%] mobile:mr-[40px]">
            {/* item total nfts */}
            <div className="mb-[20px] xsm:mb-0 xsm:mr-[20px] sm:mr-[40px] bg-purpleLight rounded-2xl flex flex-col items-center justify-center w-full xsm:w-[50%] py-[24px]">
              {/* Icon */}
              <div className="select-none bg-purpleExtraLight inline-block rounded-tl-[18px] rounded-br-[18px] p-[8px] w-[42px] h-[42px] sm:w-[56px] sm:h-[56px]">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-full h-full"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
                    />
                  </svg>
                </span>
              </div>

              {/* Title */}
              <div className="text-[13px] uppercase my-[8px]">
                <span>Total NFTs</span>
              </div>

              {/* data */}
              <div className="text-[18px] sm:text-[22px] font-bold leading-none">
                {supplyLoad ? (
                  <span>{parseBigintTo_number(totalSupply as string)}</span>
                ) : (
                  <Spinner className="w-[24px] h-[24px] text-purpleExtraLight" />
                )}
              </div>
            </div>

            {/* item total owners */}
            <div className="bg-purpleLight rounded-2xl flex flex-col items-center justify-center w-full xsm:w-[50%] py-[24px]">
              {/* Icon */}
              <div className="select-none bg-purpleExtraLight inline-block rounded-tl-[18px] rounded-br-[18px] p-[8px] w-[42px] h-[42px] sm:w-[56px] sm:h-[56px]">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-full h-full"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    />
                  </svg>
                </span>
              </div>

              {/* Title */}
              <div className="text-[13px] uppercase my-[8px]">
                <span>Total Owners</span>
              </div>

              {/* data */}
              <div className="text-[18px] sm:text-[22px] font-bold leading-none">
                {ownersLoad && ownerAddresses?.pages[0] ? (
                  <span>
                    {reduceTotalOwners(ownerAddresses?.pages[0] as [])}
                  </span>
                ) : (
                  <Spinner className="w-[24px] h-[24px] text-purpleExtraLight" />
                )}
              </div>
            </div>
          </div>

          {/* part two */}
          <div className="flex flex-col xsm:flex-row justify-between items-center w-full xxsm:w-[90%] mobile:w-[50%] mt-[20px] sm:mt-[40px] mobile:mt-0">
            {/* item transaction volume */}
            <div className="mb-[20px] xsm:mb-0 xsm:mr-[20px] sm:mr-[40px] bg-purpleLight rounded-2xl flex flex-col items-center justify-center w-full xsm:w-[50%] py-[24px]">
              {/* Icon */}
              <div className="select-none bg-purpleExtraLight inline-block rounded-tl-[18px] rounded-br-[18px] p-[8px] w-[42px] h-[42px] sm:w-[56px] sm:h-[56px]">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-full h-full"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                    />
                  </svg>
                </span>
              </div>

              {/* Title */}
              <div className="text-[13px] uppercase my-[8px]">
                <span>Transaction volume</span>
              </div>

              {/* data */}
              <div className="text-[18px] sm:text-[22px] font-bold leading-none">
                <span>0.0</span>
              </div>
            </div>

            {/* item total volume */}
            <div className="bg-purpleLight rounded-2xl flex flex-col items-center justify-center w-full xsm:w-[50%] py-[24px]">
              {/* Icon */}
              <div className="select-none bg-purpleExtraLight inline-block rounded-tl-[18px] rounded-br-[18px] p-[8px] w-[42px] h-[42px] sm:w-[56px] sm:h-[56px]">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-full h-full"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                    />
                  </svg>
                </span>
              </div>

              {/* Title */}
              <div className="text-[13px] uppercase my-[8px]">
                <span>Total Volume</span>
              </div>

              {/* data */}
              <div className="text-[18px] sm:text-[22px] font-bold leading-none flex items-center">
                {/* Icon */}
                <span className="mr-[6px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[20px] h-[20px]"
                    viewBox="0 0 2000 2000"
                  >
                    <g fill="#fff">
                      <path d="M611.59 840.42l388.4-388.39 388.6 388.59 226-226L999.99 0 385.6 614.42l225.99 226M.006 999.969l226.007-226.007 225.992 225.993L226 1225.96zM611.59 1159.58l388.4 388.39 388.59-388.58 226.12 225.88-.11.12L999.99 2000l-614.41-614.4-.32-.32 226.33-225.7M1548.013 1000.093l226.007-226.006 225.992 225.992-226.006 226.007z" />
                      <path d="M1229.22 999.88h.1L999.99 770.55 830.51 940.03h-.01l-19.47 19.48-40.16 40.17-.32.31.32.33 229.12 229.13 229.33-229.33.11-.13-.21-.11" />
                    </g>
                  </svg>
                </span>

                {/* Amount */}
                <span>0.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Games */}
        <div className="">
          {/* Title */}
          <div className="flex justify-between items-start text-white">
            <h2 className="text-[24px] xxsm:text-[26px] sm:text-[32px] tracking-[1px] sm:tracking-[2px] font-bold cursor-default">
              Games
            </h2>

            {/* View all */}
            <div className="select-none">
              <Link
                className="flex items-center text-white text-[13px] bg-purpleLight px-[8px] py-[6px] transition-all duration-300 ease-in-out hover:bg-purpleExtraLight rounded-tl-[12px] rounded-br-[12px]"
                href="/games"
              >
                <span>View all</span>
                <span className="ml-[6px]">
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
                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* List */}
          <div className="bg-purpleDark flex text-white rounded-lg mt-[20px] p-[22px]">
            {/* Item */}
            <div className="border border-dashed border-purpleLight w-[50%] xsm:w-[33%] h-[50px] xsm:h-[60px] rounded-lg">
              <div className="flex justify-center items-center h-full cursor-default">
                <span className="text-purpleLight text-[14px] xxsm:text-[16px]">
                  Developing
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeadFooter>
  );
}
