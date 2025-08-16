import {
  BSC_ADDRESS_LINK,
  EXTERNAL_URL_OG_NFTS,
  MARKETPLACE_BETA_ADDRESS,
  TOAST_CFG,
} from '@utils/main_utils';
import { resumedAddress } from '@utils/text_utils';
import ABI_MARKETPLACE_BETA from '@abis/abi_marketplace_beta.json';
import { writeContract, prepareWriteContract } from '@wagmi/core';
import Image from 'next/image';
import Link from 'next/link';
import { parseEther } from 'viem';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAccount, useConnect } from 'wagmi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { showLogin } from '@slices/interfaceStatus_slice';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';

interface props {
  key: number;
  nftInfo: {
    owner: string;
    active: boolean;
    tokenId: number;
    price: number;
    listingId: string;
  };
}

export default function NftItem(props: props) {
  // Hooks
  const { status: status_session, data: session } = useSession();
  const {
    address: user_address,
    isConnected,
    connector: currentConnector,
  } = useAccount();

  // Store
  const InterfaceStatus = useSelector(
    (state: RootState) => state.InterfaceStatus
  );
  const dispatch = useDispatch();

  // Pay functions
  const payNft = async (listing_id: string, price: number) => {
    if (
      status_session == 'unauthenticated' ||
      !session?.user ||
      user_address == undefined ||
      currentConnector == undefined ||
      !isConnected
    ) {
      dispatch(showLogin());
      return;
    }

    try {
      const { request } = await prepareWriteContract({
        address: MARKETPLACE_BETA_ADDRESS,
        abi: ABI_MARKETPLACE_BETA,
        functionName: 'buy',
        args: [listing_id],
        value: BigInt(`${price}`),
        account: user_address,
      });

      const { hash } = await writeContract(request);
      

      console.log('HASH');
      console.log(hash);
    } catch (error: any) {
      let message = 'Failed to execute transaction';

      toast.error(message, TOAST_CFG);
      console.log(error);
    }
  };

  // Render
  return (
    <div className="min-w-[200px] w-full xxsm:w-[50%] sm:w-[33%] xl:w-[25%] max-w-[350px] p-[16px] xl:p-[20px] flex flex-col items-center overflow-hidden">
      {/* Image */}
      <div className="w-full">
        <Image
          className={'w-full h-full object-contain'}
          width={0}
          height={0}
          sizes="100vw"
          src={EXTERNAL_URL_OG_NFTS + props.nftInfo.tokenId + '.jpg'}
          alt={'original nft number ' + props.nftInfo.tokenId}
        />
      </div>

      {/* Owner */}
      <div className="text-white w-full mt-[12px]">
        <Link
          className="flex flex-wrap justify-center items-center text-[13px] mobile:text-[14px]"
          href={BSC_ADDRESS_LINK + props.nftInfo.owner}
          target="_blank"
        >
          <span className="mr-[6px] text-purpleExtraLight font-bold">
            Owner:
          </span>
          <span className="text-[#ffffffb0]">
            {resumedAddress(props.nftInfo.owner, 8)}
          </span>
        </Link>
      </div>

      {/* Price */}
      <button
        onClick={(event) => {
          event.preventDefault();
          payNft(props.nftInfo.listingId, props.nftInfo.price);
        }}
        className="w-full bg-yellow font-bold px-[8px] py-[4px] rounded-bl-[24px] rounded-tr-[24px] mt-[12px] flex items-center justify-center transition-all duration-300 ease-linear hover:opacity-80"
      >
        {/* Amount */}
        <span className="text-[16px] mobile:text-[18px] mr-[6px]">
          {ethers.utils.formatEther(BigInt(`${props.nftInfo.price}`))}
        </span>

        {/* Icon */}
        <span className="flex flex-row-reverse justify-start items-center">
          <span className="text-[14px] mobile:text-[15px]">BNB</span>
          <span className="mr-[4px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-[16px] mobile:w-[18px] h-[16px] mobile:h-[18px]"
              viewBox="0 0 2000 2000"
            >
              <g fill="#000">
                <path d="M611.59 840.42l388.4-388.39 388.6 388.59 226-226L999.99 0 385.6 614.42l225.99 226M.006 999.969l226.007-226.007 225.992 225.993L226 1225.96zM611.59 1159.58l388.4 388.39 388.59-388.58 226.12 225.88-.11.12L999.99 2000l-614.41-614.4-.32-.32 226.33-225.7M1548.013 1000.093l226.007-226.006 225.992 225.992-226.006 226.007z" />
                <path d="M1229.22 999.88h.1L999.99 770.55 830.51 940.03h-.01l-19.47 19.48-40.16 40.17-.32.31.32.33 229.12 229.13 229.33-229.33.11-.13-.21-.11" />
              </g>
            </svg>
          </span>
        </span>
      </button>
    </div>
  );
}
