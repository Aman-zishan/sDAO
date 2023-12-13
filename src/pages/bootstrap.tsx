import {
  useOpenContractCall,
  useOpenStxTokenTransfer
} from '@micro-stacks/react';
import {
  FungibleConditionCode,
  boolCV,
  contractPrincipalCV,
  makeContractSTXPostCondition,
  stringAsciiCV,
  stringUtf8CV,
  uintCV
} from '@stacks/transactions';
import { useAtom } from 'jotai';
import React from 'react';
import LeftMenu from '../components/leftMenu';
import { bootStrapAtom } from '../store/stateStore';

const Bootstrap = () => {
  const [step, setStep] = useAtom(bootStrapAtom);
  const { openStxTokenTransfer } = useOpenStxTokenTransfer();
  const { openContractCall } = useOpenContractCall();

  const handleTokenTransfer = async () => {
    openStxTokenTransfer({
      recipient: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.core',
      amount: 1000000000000n, //1M STX
      memo: 'grant funds'
    });
    setStep(1);
  };
  const constructBootstrap = async () => {
    const functionArgs = [
      contractPrincipalCV(
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'bootstrap'
      )
    ];
    await openContractCall({
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'core',
      functionName: 'construct',

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      functionArgs,

      onFinish: async (data: any) => {
        console.log('finished contract call!', data);
        setStep(2);
      },
      onCancel: () => {
        console.log('popup closed!');
      }
    });
  };

  const proposeMilestoneExtension = async () => {
    const functionArgs = [
      contractPrincipalCV(
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'milestone-extension-proposal'
      ),
      stringAsciiCV('milestone-extension proposal'),
      stringUtf8CV('proposal to enable milestone extension')
    ];
    await openContractCall({
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'proposal-submission',
      functionName: 'propose',

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      functionArgs,

      onFinish: async (data: any) => {
        console.log('finished contract call!', data);
        setStep(3);
      },
      onCancel: () => {
        console.log('popup closed!');
      }
    });
  };

  const voteForMilestoneExtension = async () => {
    const functionArgs = [
      uintCV(100),
      boolCV(true),
      contractPrincipalCV(
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'milestone-extension-proposal'
      )
    ];
    await openContractCall({
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'proposal-voting',
      functionName: 'vote',

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      functionArgs,

      onFinish: async (data: any) => {
        console.log('finished contract call!', data);
        setStep(4);
      },
      onCancel: () => {
        console.log('popup closed!');
      }
    });
  };

  const concludeMilestoneExtension = async () => {
    const postConditions = [
      makeContractSTXPostCondition(
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'core',
        FungibleConditionCode.Equal,
        1000000000000n
      )
    ];
    const functionArgs = [
      contractPrincipalCV(
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'milestone-extension-proposal'
      )
    ];
    await openContractCall({
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'proposal-voting',
      functionName: 'conclude',

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      functionArgs,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      postConditions,

      onFinish: async (data: any) => {
        console.log('finished contract call!', data);
        setStep(5);
      },
      onCancel: () => {
        console.log('popup closed!');
      }
    });
  };
  return (
    <div className=" bg-blue-50 w-screen h-screen">
      <LeftMenu />

      <main className="ml-60 pt-10 ">
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 mb-5">
              <h1 className="text-3xl font-bold mb-5">Setup sDAO</h1>
              <div className="pb-5">
                <p>
                  Bootstrap the DAO by enabling extensions and passing milestone
                  proposals
                </p>
              </div>

              <ol className="ml-5 relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400">
                <li onClick={handleTokenTransfer} className="mb-10 ms-6">
                  {step === 1 ||
                  step === 2 ||
                  step === 3 ||
                  step === 4 ||
                  step === 5 ? (
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                      <svg
                        className="w-3.5 h-3.5 text-green-500 dark:text-green-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 16 12"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1 5.917 5.724 10.5 15 1.5"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                      <svg
                        className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 20"
                      >
                        <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                      </svg>
                    </span>
                  )}

                  <h3 className="font-medium leading-tight">
                    Transfer 1M STX grant fund
                  </h3>
                  <p className="text-sm">stx transfer</p>
                </li>
                <li
                  onClick={async () => {
                    await constructBootstrap();
                  }}
                  className="mb-10 ms-6"
                >
                  {step === 2 || step === 3 || step === 4 || step === 5 ? (
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                      <svg
                        className="w-3.5 h-3.5 text-green-500 dark:text-green-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 16 12"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1 5.917 5.724 10.5 15 1.5"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                      <svg
                        className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 20"
                      >
                        <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                      </svg>
                    </span>
                  )}
                  <h3 className="font-medium leading-tight">
                    Construct Bootstrap
                  </h3>
                  <p className="text-sm">enable extensions</p>
                </li>
                <li
                  onClick={async () => {
                    proposeMilestoneExtension();
                  }}
                  className="mb-10 ms-6"
                >
                  {step === 3 || step === 4 || step === 5 ? (
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                      <svg
                        className="w-3.5 h-3.5 text-green-500 dark:text-green-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 16 12"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1 5.917 5.724 10.5 15 1.5"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                      <svg
                        className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 20"
                      >
                        <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                      </svg>
                    </span>
                  )}
                  <h3 className="font-medium leading-tight">
                    Propose milestone extension
                  </h3>
                  <p className="text-sm">propose new extension</p>
                </li>
                <li
                  onClick={async () => {
                    voteForMilestoneExtension();
                  }}
                  className="mb-10 ms-6"
                >
                  {step === 4 || step === 5 ? (
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                      <svg
                        className="w-3.5 h-3.5 text-green-500 dark:text-green-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 16 12"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1 5.917 5.724 10.5 15 1.5"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                      <svg
                        className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 20"
                      >
                        <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                      </svg>
                    </span>
                  )}
                  <h3 className="font-medium leading-tight">
                    Vote for milestone extension
                  </h3>
                  <p className="text-sm">vote for milestone extension</p>
                </li>
                <li
                  onClick={async () => {
                    await concludeMilestoneExtension();
                  }}
                  className="ms-6"
                >
                  {step === 5 ? (
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                      <svg
                        className="w-3.5 h-3.5 text-green-500 dark:text-green-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 16 12"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1 5.917 5.724 10.5 15 1.5"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                      <svg
                        className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 20"
                      >
                        <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                      </svg>
                    </span>
                  )}
                  <h3 className="font-medium leading-tight">
                    Conclude milestone extension
                  </h3>
                  <p className="text-sm">enable milestone extension</p>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Bootstrap;
