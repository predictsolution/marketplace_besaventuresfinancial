import HeadFooter from 'layouts/head_footer';

export default function IndexGames() {
  return (
    <HeadFooter title="Games">
      <div className="w-full min-h-screen px-[30px] mobile:px-[60px] py-[80px]">
        {/* Title */}
        <div className="text-white text-[24px] xxsm:text-[26px] sm:text-[32px] font-bold w-full border-b border-purpleExtraLight cursor-default pb-[16px]">
          <h2 className="tracking-[1px] sm:tracking-[2px]">Games</h2>
        </div>

        {/* Content */}
        <div className="my-[40px] md:my-[60px] text-white">
          {/* Info */}
          <div className="text-center text-gray text-[16px] xxsm:text-[17px] md:text-[18px]">
            <p>Our games are in the last phase, stay tuned.</p>
          </div>

          <div className="bg-purpleDark flex flex-col xxsm:flex-row items-center xxsm:items-start text-white rounded-lg mt-[20px] p-[12px] xsm:p-[22px] text-[15px] md:text-[16px]">
            {/* Item 1 */}
            <div className="border border-dashed border-purpleLight w-[100%] xxsm:w-[50%] xsm:w-[40%] md:w-[33%] h-[50px] md:h-[60px] rounded-lg">
              <div className="flex justify-center items-center h-full cursor-default">
                <span className="text-purpleLight">Not found</span>
              </div>
            </div>

            {/* Item 2 */}
            <div className="mt-[24px] xxsm:mt-0 xxsm:ml-[24px] border border-dashed border-purpleLight w-[100%] xxsm:w-[50%] xsm:w-[40%] md:w-[33%] h-[50px] md:h-[60px] rounded-lg">
              <div className="flex justify-center items-center h-full cursor-default">
                <span className="text-purpleLight">Not found</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeadFooter>
  );
}
