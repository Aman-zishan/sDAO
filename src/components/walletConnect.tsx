import { useAccount, useAuth } from '@micro-stacks/react';
import React from 'react';
import { fetchSTXBalance } from '../lib/utils';
import { SVGComponent } from './stacksSvg';
import {
  callReadOnlyFunction,
  cvToValue,
  standardPrincipalCV
} from '@stacks/transactions';

export const WalletConnectButton = () => {
  const { openAuthRequest, isRequestPending, signOut, isSignedIn } = useAuth();

  const [balance, setBalance] = React.useState(0);
  const [sgtBalance, setSGTBalance] = React.useState(0);
  const { stxAddress } = useAccount();

  const fetchBalance = async () => {
    if (isSignedIn) {
      try {
        const fetchedSTXBalance = await fetchSTXBalance(stxAddress!);
        setBalance(fetchedSTXBalance.balance / 1000000);
        console.log('Fetched balance:', fetchedSTXBalance);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    }
  };

  const fetchSGTBalance = async () => {
    if (isSignedIn) {
      try {
        const functionArgs = [standardPrincipalCV(stxAddress!)];
        const result = await callReadOnlyFunction({
          network: 'devnet',
          contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
          contractName: 'membership-token',
          functionName: 'get-balance',
          functionArgs,
          senderAddress: stxAddress!
        });

        setSGTBalance(cvToValue(result).value);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    }
  };

  React.useEffect(() => {
    fetchBalance();
    fetchSGTBalance();
  }, [isSignedIn]); // The empty array causes this effect to only run on mount

  const label = isRequestPending
    ? 'Loading...'
    : isSignedIn
    ? 'Sign out'
    : 'Connect Stacks wallet';
  return (
    <>
      <span className="flex flex-row gap-2 items-center mb-4 justify-start">
        <SVGComponent /> {balance} <span className="font-bold">STX</span>
      </span>
      <span className="flex flex-row gap-2 items-center mb-4 justify-start">
        <img width="32px" src="/assets/SGT.png" alt="" /> {sgtBalance}{' '}
        <span className="font-bold">SGT</span>
      </span>
      <button
        onClick={async () => {
          if (isSignedIn) await signOut();
          else await openAuthRequest();
        }}
        className="w-[250px] relative px-5 py-3 overflow-hidden font-medium text-gray-600 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group"
      >
        <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
        <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
        <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
        <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
        <span className="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
        <span className="relative transition-colors duration-300 delay-200 group-hover:text-white ease">
          {label}
        </span>
      </button>
    </>
  );
};
