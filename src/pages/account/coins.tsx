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

export default function Coins() {
  // Render
  return (
    <AccountMenu title="Coins">
      <div>
        {/* Coins info */}
        <div>
          {/* Title */}
          <div className="border-b border-purpleLight pb-[6px] cursor-default">
            <h2 className="text-white font-semibold text-[22px] md:text-[25px] pl-[12px]">
              Coins
            </h2>
          </div>

          {/* Content */}
          <div className="mt-[30px] text-white">
            {/* Info */}
            <div className="w-full text-center text-gray">
              <p>We will list our token as soon as possible. Stay tuned.</p>
            </div>
          </div>
        </div>
      </div>
    </AccountMenu>
  );
}
