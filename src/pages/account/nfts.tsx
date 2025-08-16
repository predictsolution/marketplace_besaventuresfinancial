import AccountMenu from '@layouts/account_menu';
import { IncomingMessage, ServerResponse } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';

export async function getServerSideProps(context: {
  req:
    | any
    | (IncomingMessage & { cookies: Partial<{ [key: string]: string }> })
    | NextApiRequest;
  res: any | ServerResponse<IncomingMessage> | NextApiResponse<any>;
}) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default function Nfts() {
  // Render
  return (
    <AccountMenu title="NFTs">
      <div>
        {/* NFTs info */}
        <div>
          {/* Title */}
          <div className="border-b border-purpleLight pb-[6px] cursor-default">
            <h2 className="text-white font-semibold text-[22px] md:text-[25px] pl-[12px]">
              NFTs
            </h2>
          </div>

          {/* Content */}
          <div className="mt-[30px] text-white">
            {/* Info */}
            <div className="flex flex-col xsm:flex-row items-center">
              <span className='text-center xsm:text-left'>You haven’t purchased a nft yet </span>
              <Link
                className="select-none mt-[12px] xsm:mt-0 xsm:ml-[12px] text-green rounded-tl-[14px] rounded-br-[14px] border-green border px-[12px] py-[6px] hover:shadow-md hover:shadow-green transition-all duration-500 ease-in-out"
                href="/marketplace"
              >
                Marketplace
              </Link>
            </div>

            <div className="bg-purpleDark flex text-white rounded-lg mt-[20px] p-[22px]">
              <div className="border border-dashed border-purpleLight w-full xsm:w-[200px] h-[200px] rounded-lg">
                <div className="flex justify-center items-center h-full cursor-default">
                  <span className="text-purpleLight text-[16px]">
                    Not found
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AccountMenu>
  );
}
