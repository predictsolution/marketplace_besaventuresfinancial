import Spinner from '@components/Utils/Spinner';
import AccountMenu from '@layouts/account_menu';
import { TOAST_CFG, reloadWindow, verify_email } from '@utils/main_utils';
import { copy, parsetDate, resumedAddress } from '@utils/text_utils';
import axios from 'axios';
import { IncomingMessage, ServerResponse } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

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

export default function Account() {
  // Hooks
  const router = useRouter();
  const { status: session_status, data: session } = useSession();

  // State
  const [show_emailForm, setShow_emailForm] = useState(false);
  const [loadingForm, setLoading_form] = useState(false);

  // Ref
  const emailRef = useRef<HTMLInputElement>(null);

  // Email functions
  const toggleForm_email = (forceClose = false) => {
    if (forceClose) {
      setShow_emailForm(false);
      return;
    }

    setShow_emailForm(show_emailForm ? false : true);
    return;
  };

  const handlerForm_email = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    toast.remove();

    if (loadingForm || !emailRef.current) return;

    const emailInput = verify_email(emailRef.current.value);

    if (!emailInput.valid) {
      toast.error('Invalid email', TOAST_CFG);
      return;
    }

    setLoading_form(true);

    try {
      const response = await axios.post('/api/account/updateEmail', {
        email: emailInput.email,
      });

      if (!response.data.updated) {
        toast.error(response.data.message, TOAST_CFG);
        return;
      }

      // Update session
      await axios.get('/api/auth/session?updateEmail').then((response) => {
        reloadWindow();
      });

      toast.success(response.data.message, TOAST_CFG);
      toggleForm_email(true);
    } catch (error) {
      toast.error('Error updating email', TOAST_CFG);
    } finally {
      setLoading_form(false);
    }
  };

  const emailState = () => {
    if (show_emailForm) {
      return (
        <div className="flex items-center">
          <form
            onSubmit={(event) => {
              handlerForm_email(event);
            }}
            className="flex flex-col xsm:flex-row xsm:items-center"
          >
            <div>
              <input
                className="bg-purpleOpacity rounded border-purpleLight border outline-none text-[14px] py-[2px] px-[8px]"
                type="email"
                placeholder="Write your email"
                required
                ref={emailRef}
              />
            </div>

            <div className="flex items-center mt-[6px] xsm:mt-0">
              {/* Add button */}
              <div className="xsm:ml-[12px] text-green font-normal">
                <button
                  type="submit"
                  className="select-none flex items-center rounded-tl-[12px] rounded-br-[12px] bg-transparent border border-green text-[15px] px-[8px] py-[2px] hover:shadow-md hover:shadow-green transition-all duration-500 ease-in-out"
                >
                  {loadingForm ? (
                    <Spinner className="w-[18px h-[18px] mr-[6px]" />
                  ) : null}
                  <span>{loadingForm ? 'Adding' : 'Add'}</span>
                </button>
              </div>

              {/* Cancel button */}
              {loadingForm ? null : (
                <div className="ml-[12px] text-red font-normal">
                  <button
                    onClick={(event) => toggleForm_email(true)}
                    className="select-none rounded-tl-[12px] rounded-br-[12px] bg-transparent border border-red text-[15px] px-[8px] py-[2px] hover:shadow-md hover:shadow-red transition-all duration-500 ease-in-out"
                  >
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      );
    } else if (!session || session.user?.email == undefined) {
      return (
        <div className="flex items-center text-[15px]">
          <div>
            <span className="text-gray">Empty</span>
          </div>

          <div className="ml-[8px]">
            <button
              className="text-[13px] text-red border rounded-tl-[14px] rounded-br-[14px] pb-[1px] pt-[2px] px-4 border-red transition-all duration-300 hover:opacity-90 select-none"
              onClick={(event) => {
                event.preventDefault();
                toggleForm_email();
              }}
            >
              Add
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col xxsm:flex-row xxsm:items-center">
          <span className="text-[15px] xxsm:text-[16px] text-green">{session.user.email}</span>

          {/* Edit button */}
          <div className="mt-[6px] xxsm:mt-0 xxsm:ml-[12px] text-gray font-normal">
            <button
              onClick={(event) => toggleForm_email()}
              className="select-none rounded-tl-[12px] rounded-br-[12px] bg-transparent border border-gray text-[15px] px-[8px] py-[2px] hover:shadow-md hover:shadow-gray transition-all duration-500 ease-in-out"
            >
              <span>Edit</span>
            </button>
          </div>
        </div>
      );
    }
  };

  // Render
  return (
    <AccountMenu title="Account">
      <div>
        {/* Account info */}
        <div>
          {/* Title */}
          <div className="border-b border-purpleLight pb-[6px] cursor-default">
            <h2 className="text-white font-semibold text-[22px] md:text-[25px] pl-[12px]">
              Account
            </h2>
          </div>

          {/* Content */}
          <div className="mt-[30px] text-white pl-[12px]">
            {/* Address */}
            <div className="mb-[12px] flex items-center">
              <span className="font-semibold text-[16px] xsm:text-[17px] cursor-default">
                Address :
              </span>

              <div
                className="ml-[6px] text-[15px] xsm:text-[16px] text-green cursor-pointer flex items-center"
                onClick={(event) => {
                  event.preventDefault();
                  copy(
                    session && session.user ? (session.user.name as string) : ''
                  );
                }}
              >
                <span>
                  {resumedAddress(
                    session && session.user
                      ? (session.user.address as string)
                      : ''
                  )}
                </span>

                <span className="ml-[6px] text-gray">
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
                      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="mb-[12px]">
              <div className="flex flex-col xsm:flex-row xsm:items-center">
                <span className="font-semibold text-[16px] xsm:text-[17px] cursor-default">
                  Email :
                </span>

                {/* Input or info email */}
                <div className="xsm:ml-[6px] mt-[6px] xsm:mt-0">{emailState()}</div>
              </div>

              {/* Description */}
              <div className="mt-[2px]">
                <p className="text-[13px] text-gray">
                  Email to login to our games
                </p>
              </div>
            </div>

            {/* Created At */}
            <div>
              <div>
                <span className="font-semibold text-[16px] xsm:text-[17px] cursor-default">
                  Created At :
                </span>
                <span className="text-[15px] ml-[6px] text-yellow">
                  {parsetDate(session?.user.created_at as string)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Account game info */}
        <div className="mt-[60px]">
          {/* Title */}
          <div className="border-b border-purpleLight pb-[6px] cursor-default">
            <h2 className="text-white font-semibold text-[22px] md:text-[25px] pl-[12px] flex items-center">
              <span className="mr-[6px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-[22px] md:w-[26px] h-[22px] md:h-[26px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z"
                  />
                </svg>
              </span>
              <span>Games</span>
            </h2>
          </div>

          {/* Content */}
          <div className="mt-[30px] text-white pl-[12px]">
            <div className="bg-purpleDark flex text-white rounded-lg mt-[20px] p-[22px]">
              <div className="border border-dashed border-purpleLight w-full xxsm:w-[50%] sm:w-[33%] h-[60px] rounded-lg">
                <div className="flex justify-center items-center h-full cursor-default">
                  <span className="text-purpleLight text-[15px] xsm:text-[16px]">
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
