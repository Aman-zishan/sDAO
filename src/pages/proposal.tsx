import React, { useEffect } from 'react';
import LeftMenu from '../components/leftMenu';
import { useParams } from 'react-router-dom';
import {
  contractPrincipalCV,
  callReadOnlyFunction,
  cvToValue
} from '@stacks/transactions';
import { useAccount, useAuth } from '@micro-stacks/react';
import { truncateAddress } from '../lib/utils';

type individualValue = {
  type: string;
  value: string;
};
type ProposalType = {
  concluded: individualValue;
  description: individualValue;
  'end-block-height': individualValue;
  passed: individualValue;
  proposer: individualValue;
  'start-block-height': individualValue;
  title: individualValue;
  'votes-against': individualValue;
  'votes-for': individualValue;
};
const ProposalPage = () => {
  const { slug } = useParams();
  const [vote, setVote] = React.useState('');
  const { isSignedIn } = useAuth();
  const { stxAddress } = useAccount();
  const [proposalInfo, setProposalInfo] = React.useState<ProposalType>();

  const fetchProposalInfo = async (address: string, contractName: string) => {
    if (isSignedIn) {
      try {
        const functionArgs = [contractPrincipalCV(address, contractName)];
        const result = await callReadOnlyFunction({
          network: 'devnet',
          contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
          contractName: 'proposal-voting',
          functionName: 'get-proposal-data',
          functionArgs,
          senderAddress: stxAddress!
        });

        console.log(cvToValue(result).value);
        setProposalInfo(cvToValue(result).value);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    }
  };

  const fetchProposalMilestoneInfo = async (
    address: string,
    contractName: string
  ) => {
    if (isSignedIn) {
      try {
        const functionArgs = [contractPrincipalCV(address, contractName)];
        const result = await callReadOnlyFunction({
          network: 'devnet',
          contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
          contractName: 'milestone-extension',
          functionName: 'get-milestones',
          functionArgs,
          senderAddress: stxAddress!
        });

        console.log(cvToValue(result).value);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    }
  };

  useEffect(() => {
    fetchProposalInfo(stxAddress!, slug!);
    fetchProposalMilestoneInfo(stxAddress!, slug!);
  }, []);

  return (
    <body className="relative bg-blue-50 overflow-hidden h-screen w-screen">
      <LeftMenu />

      <main className="ml-60 pt-16 max-h-screen overflow-auto">
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 mb-5">
              <h1 className="text-3xl font-bold mb-10">{`Proposal ${slug}`}</h1>

              <hr className="my-10" />
              <div className="flex items-center justify-between">
                <div className="flex items-stretch">
                  <div className="h-100 border-l mx-4"></div>
                </div>
                <div className="flex items-center gap-x-2">
                  <input
                    required
                    type="number"
                    onChange={(e) => setVote(e.target.value)}
                    id="default-input"
                    placeholder="vote number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  <button
                    type="button"
                    className="inline-flex items-center justify-center h-9 px-5 rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition"
                  >
                    Vote
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center h-9 px-5 rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition"
                  >
                    Conclude
                  </button>
                </div>
              </div>

              <hr className="my-10" />

              <div className="grid grid-cols gap-x-20">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Stats</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <div className="p-4 bg-green-100 rounded-xl">
                        <div className="font-bold text-xl text-gray-800 leading-none">
                          Proposer:
                        </div>
                        <div className="mt-5">
                          <button
                            type="button"
                            className="inline-flex items-center justify-center py-2 px-3 rounded-xl bg-white text-gray-800 hover:text-green-500 text-sm font-semibold transition"
                          >
                            {proposalInfo?.proposer.value}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-100 rounded-xl text-gray-800">
                      <div className="font-bold text-2xl leading-none">
                        {proposalInfo?.['votes-for'].value}
                      </div>
                      <div className="mt-2 font-bold">FOR Votes</div>
                    </div>
                    <div className="p-4 bg-yellow-100 rounded-xl text-gray-800">
                      <div className="font-bold text-2xl leading-none">
                        {proposalInfo?.['votes-against'].value}
                      </div>
                      <div className="mt-2 font-bold">AGAINST Votes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </body>
  );
};

export default ProposalPage;
