import AccordionLayout from 'layouts/accordion';
import HeadFooter from 'layouts/head_footer';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MarketStyle from '@styles/Marketplace.module.css';
import {
  paginatedIndexesConfig,
  useContractInfiniteReads,
  useContractRead,
} from 'wagmi';
import { MARKETPLACE_BETA_ADDRESS, NFTS_PER_PAGE } from '@utils/main_utils';
import ABI_MARKETPLACE_BETA from '@abis/abi_marketplace_beta.json';
import { parseBigintTo_number } from '@utils/ether_utils';
import Spinner from '@components/Utils/Spinner';
import NftItem from '@components/NftItem/NftItem';

export default function Marketplace() {
  // States
  const [filtersMobile, setFiltersMobile] = useState(false);
  const [supplyLoad, setSupplyLoad] = useState(false);
  const [listingLoad, setListingLoad] = useState(false);

  const [nftsList, setNftsList] = useState<any>({});
  const [listToRender, setListTo_render] = useState<any>({});

  // Pagination states
  const [showPages, setShowPages] = useState(0);
  const [pageSelected, setPageSelected] = useState(1);

  // Hooks
  const router = useRouter();

  const { data: totalActive_listing } = useContractRead({
    address: MARKETPLACE_BETA_ADDRESS,
    abi: ABI_MARKETPLACE_BETA,
    functionName: 'getActiveListingsCount',
    onSuccess() {
      setSupplyLoad(true);
    },
  });

  const { data: nftsListings, fetchNextPage } = useContractInfiniteReads({
    cacheKey: 'nftsListings',
    ...paginatedIndexesConfig(
      //@ts-ignore
      (index) => {
        return [
          {
            address: MARKETPLACE_BETA_ADDRESS,
            abi: ABI_MARKETPLACE_BETA,
            functionName: 'listings',
            args: [index] as const,
          },
        ];
      },
      { start: 0, perPage: 200, direction: 'increment' }
    ),
    onSuccess() {
      setListingLoad(true);
    },
  });

  // Useeffects
  useEffect(() => {
    eventListeners();
  });

  useEffect(() => {
    if (
      nftsListings?.pages != undefined &&
      nftsListings?.pages.length > 0 &&
      listingLoad
    ) {
      setActiveListing(nftsListings.pages[0] as unknown as []);
    }
  }, [listingLoad, nftsListings]);

  useEffect(() => {
    if (Object.keys(nftsList).length > 0) {
      collectNfts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nftsList]);

  // Logic Functions
  const setActiveListing = (nfts_list: { result: any[]; status: string }[]) => {
    const activeListings: any = {};

    nfts_list.map((nft, index: number) => {
      let nftFix: any[] = [];

      if (nft.result[1]) {
        nft.result.map((value: any, index: number) => {
          if (index == 2 || index == 3)
            nftFix.push(parseBigintTo_number(value));
          else nftFix.push(value);
        });
        // list.push(nftFix);
        activeListings[index] = nftFix;
      }
    });

    const PAGES_COUNT = Object.keys(activeListings).length / NFTS_PER_PAGE;

    setShowPages(
      Number.isInteger(PAGES_COUNT) ? PAGES_COUNT : Math.trunc(PAGES_COUNT) + 1
    );
    setPageSelected(1);
    setNftsList(activeListings as never);
  };

  // Interface functions
  const eventListeners = () => {
    window.addEventListener('resize', (ev) => {
      if (filtersMobile) toggle_menuFilter_mobile(true);
    });
  };

  const toggle_menuFilter_mobile = (force = false) => {
    setFiltersMobile(force ? false : !filtersMobile);
  };

  const iconMenuFilter = () => {
    if (filtersMobile)
      return (
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
      );
    else
      return (
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
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </span>
      );
  };

  // Pagination functions
  const collectNfts = async (currentPage = 1) => {
    if (Object.keys(nftsList).length < 1) return;

    const startNumber = currentPage * NFTS_PER_PAGE - NFTS_PER_PAGE;
    // let nftsListCopy: any[] = JSON.parse(JSON.stringify(nftsList));
    // nftsListCopy = nftsListCopy.slice(startNumber, NFTS_PER_PAGE * currentPage);
    let nftsListCopy = Object.keys(nftsList).slice(startNumber, NFTS_PER_PAGE * currentPage).reduce((result: any, key: any) => {
      result[key] = nftsList[key];
      return result;
    }, {});

    setListTo_render(nftsListCopy as never);
  };

  const selectpage = (selected = 1) => {
    if (selected === pageSelected) return;

    if (selected > showPages || selected < 0) {
      setPageSelected(1);
      return;
    }

    setPageSelected(selected);
    collectNfts(selected);
  };

  const selectBack = () => {
    if (pageSelected - 1 < 1) return;

    setPageSelected(pageSelected - 1);

    collectNfts(pageSelected - 1);
  };

  const selectNext = () => {
    if (pageSelected + 1 > showPages) return;
    setPageSelected(pageSelected + 1);

    collectNfts(pageSelected + 1);
  };

  // Render Pagination bar
  const renderPaginationBar = () => {
    if (showPages < 1) return null;

    let showMore = pageSelected + 3;
    let options = [];

    for (
      let index = pageSelected;
      index <= showPages && index < showMore;
      index++
    ) {
      options.push(index);
    }

    return (
      <div className="w-full py-[20px] select-none">
        <ul className="flex justify-center items-center text-white">
          <li
            className="mr-[12px] w-[32px] h-[32px] md:w-[38px] md:h-[38px] flex justify-center items-center cursor-pointer bg-purpleExtraLight p-[4px] rounded-bl-[12px] rounded-tr-[12px] font-bold text-xl opacity-80 transition-all duration-300 hover:opacity-100"
            onClick={selectBack}
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
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </span>
          </li>

          {options.map((item) => {
            return (
              <li
                className={
                  'flex items-center justify-center w-[32px] h-[32px] md:w-[38px] md:h-[38px] cursor-pointer bg-purpleLight p-[4px] rounded-[6px] font-bold text-xl mx-[6px] transition-all duration-300 hover:opacity-100 ' +
                  (pageSelected == item ? 'opacity-100' : 'opacity-80')
                }
                key={item}
                onClick={() => selectpage(item)}
              >
                <span className="text-base">{item}</span>
              </li>
            );
          })}

          <li
            className="ml-[12px] w-[32px] h-[32px] md:w-[38px] md:h-[38px] flex justify-center items-center cursor-pointer bg-purpleExtraLight p-[4px] rounded-tl-[12px] rounded-br-[12px] font-bold text-xl opacity-80 transition-all duration-300 hover:opacity-100"
            onClick={selectNext}
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
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </span>
          </li>
        </ul>
      </div>
    );
  };

  // Render Nfts List
  const renderNfts_list = () => {
    return (
      <>
        <div className="w-full flex flex-wrap justify-center">
          {Object.keys(listToRender).map((id: any, index: number) => {
            return (
              <NftItem
                key={index}
                nftInfo={{
                  owner: listToRender[id][0],
                  active: listToRender[id][1],
                  tokenId: listToRender[id][2],
                  price: listToRender[id][3],
                  listingId: id
                }}
              />
            );
          })}
        </div>

        {/* Pagination */}
        <div>{renderPaginationBar()}</div>
      </>
    );
  };

  // Render Main
  return (
    <HeadFooter title="Marketplace">
      <div className="min-h-screen w-full relative flex flex-col justify-stretch items-stretch">
        {/* Navbar Marketplace */}
        <div className="select-none w-full bg-purpleLight border-b border-purpleLight">
          <div className="text-white font-light flex flex-nowrap justify-between">
            <ul className="flex flex-nowrap justify-start text-[14px] xxsm:text-[15px]">
              <li>
                <Link
                  href={router.pathname}
                  className={
                    (router.pathname == '/marketplace'
                      ? 'bg-purpleExtraLight'
                      : '') +
                    ' transition-all duration-300 flex items-center py-[16px] px-[20px] hover:bg-purpleOpacity'
                  }
                >
                  Characters
                </Link>
              </li>
            </ul>

            <div className="pr-4 md:hidden flex justify-center items-center">
              <button
                onClick={(event) => {
                  event.preventDefault();
                  toggle_menuFilter_mobile();
                }}
                className={
                  'p-1 border rounded transition-all duration-300 cursor-pointer ' +
                  (filtersMobile ? 'border-red' : '')
                }
                id="button_menuFilter"
              >
                <span>{iconMenuFilter()}</span>
              </button>
            </div>
          </div>
        </div>

        {/* NFTs Market */}
        <div className="flex flex-nowrap justify-items-stretch min-h-screen relative">
          {/* Menu Filters */}
          <div
            className={
              'bg-purpleDark w-[200px] md:w-[250px] min-h-screen border-r border-purpleLight text-white transition-all ease-in-out duration-500 absolute md:static ' +
              (filtersMobile ? 'left-0' : 'left-[-200px]')
            }
          >
            {/* Reset Button */}
            <div className="flex flex-nowrap justify-between text-[15px] py-[16px] px-[20px] border-b border-purpleLight">
              <div className="cursor-default">
                <span>Filter</span>
              </div>

              <button
                className="cursor-pointer text-green select-none"
                onClick={() => {}}
              >
                Reset
              </button>
            </div>

            {/* Class */}
            <div className="border-b border-purpleLight select-none">
              <AccordionLayout title="Classes" active={true}>
                <ul className="text-[14px]">
                  {/* Option */}
                  <li
                    className={
                      MarketStyle.option_nftsClass + ' w-full mb-[10px]'
                    }
                  >
                    <label className="group w-full flex items-center cursor-pointer relative">
                      <input
                        id="og-nfts"
                        name="ogNfts"
                        type="radio"
                        className="h-5 w-5 invisible"
                        defaultChecked={true}
                        value={''}
                        onClick={() => {}}
                      />

                      <span className="absolute w-[16px] h-[16px] rounded-full flex justify-center items-center transition border border-gray-3 group-hover:border-green circle-inputRadio">
                        <span className="absolute w-3 h-3 transition rounded-full circle-intoInputRadio"></span>
                      </span>

                      <span className="ml-2">OG’s NFTs</span>
                    </label>
                  </li>
                </ul>
              </AccordionLayout>
            </div>
          </div>

          {/* NFTs */}
          <div className="w-full p-[30px]">
            {/* Header */}
            <div className="w-full px-[12px] xxsm:px-[40px] py-[8px] border-b border-purpleExtraLight">
              {/* Title */}
              <div className="text-white font-normal text-[18px] xxsm:text-[20px] md:text-2xl cursor-default">
                <h2 className="flex items-center">
                  {supplyLoad ? (
                    parseBigintTo_number(totalActive_listing as string)
                  ) : (
                    <Spinner className="w-[22px] mr-[12px] h-[22px] text-purpleExtraLight" />
                  )}{' '}
                  NFTs
                </h2>
              </div>
            </div>

            {/* NFTs List */}
            <div className="w-full mt-[30px]">
              {/* Box NFts */}
              <div className="w-full h-full flex flex-wrap justify-center">
                <div
                  className={
                    'w-full text-center select-none ' +
                    (listingLoad && nftsList.length < 1 ? 'max-w-[550px]' : '')
                  }
                >
                  {!listingLoad ? (
                    <div className="flex w-full justify-center">
                      <Spinner className="w-[48px] h-[48px] text-purpleExtraLight" />
                    </div>
                  ) : Object.keys(listToRender).length > 0 ? (
                    renderNfts_list()
                  ) : (
                    <span className="text-[15px] xxsm:text-[17px] md:text-[18px] text-purpleExtraLight block text-center">
                      Our NFTs will be published soon. We suggest you stay tuned
                      so you don’t miss your great opportunity.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeadFooter>
  );
}
