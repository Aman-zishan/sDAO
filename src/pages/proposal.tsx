import React, { useEffect } from 'react';
import LeftMenu from '../components/leftMenu';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import {
  contractPrincipalCV,
  callReadOnlyFunction,
  cvToValue,
  boolCV,
  uintCV
} from '@stacks/transactions';
import {
  makeStandardSTXPostCondition,
  makeContractSTXPostCondition,
  FungibleConditionCode
} from 'micro-stacks/transactions';
import { useAccount, useAuth, useOpenContractCall } from '@micro-stacks/react';
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
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const paramAddress = query.get('address');
  const paramContractName = query.get('contractName');
  const [vote, setVote] = React.useState('');
  const [voteFor, setVoteFor] = React.useState('FOR');
  const { isSignedIn } = useAuth();
  const { stxAddress } = useAccount();
  const [proposalInfo, setProposalInfo] = React.useState<ProposalType>();
  const [milestoneInfo, setMilestoneInfo] = React.useState<any>();

  const { openContractCall } = useOpenContractCall();

  const voteForProposal = async () => {
    const voteStatus = voteFor === 'FOR' ? true : false;
    const functionArgs = [
      uintCV(vote),
      boolCV(voteStatus),
      contractPrincipalCV(paramAddress!, paramContractName!)
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
      },
      onCancel: () => {
        console.log('popup closed!');
      }
    });
  };

  const concludeProposal = async () => {
    const postConditions = [
      makeContractSTXPostCondition(
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        'milestone-extension',
        FungibleConditionCode.GreaterEqual,
        1n
      )
    ];
    const functionArgs = [
      contractPrincipalCV(paramAddress!, paramContractName!)
    ];

    await openContractCall({
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'proposal-voting',
      functionName: 'conclude',

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      functionArgs,

      postConditions: paramContractName?.includes('claim')
        ? postConditions
        : undefined,

      onFinish: async (data: any) => {
        console.log('finished contract call!', data);
      },
      onCancel: () => {
        console.log('popup closed!');
      }
    });
  };

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
    console.log('fetching milestones', address, contractName);
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

        console.log(cvToValue(result));
        setMilestoneInfo(cvToValue(result));
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    }
  };

  useEffect(() => {
    fetchProposalInfo(paramAddress!, paramContractName!);
    fetchProposalMilestoneInfo(paramAddress!, paramContractName!);
  }, []);

  return (
    <body className="relative bg-blue-50 overflow-hidden h-screen w-screen">
      <LeftMenu />

      <main className="ml-60 pt-16 max-h-screen overflow-auto">
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 mb-5">
              <h1 className="text-3xl font-bold mb-10">{`Proposal ${paramContractName}`}</h1>

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
                  <select
                    required
                    onChange={(e) => setVoteFor(e.target.value)}
                    id="default-input"
                    placeholder="vote number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="FOR">FOR</option>
                    <option value="AGAINST">AGAINST</option>
                  </select>
                  <button
                    type="button"
                    onClick={async () => {
                      voteForProposal();
                    }}
                    className="inline-flex items-center justify-center h-9 px-5 rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition"
                  >
                    Vote
                  </button>
                  <button
                    onClick={async () => {
                      concludeProposal();
                    }}
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

                {milestoneInfo && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4 mt-4">
                      Milestones ({milestoneInfo.length})
                    </h2>
                    <div className="flex flex-col h-[200px] max-h-[500px] overflow-scroll gap-10">
                      {milestoneInfo.map((milestone: any) => (
                        <div className="grid grid-cols gap-4">
                          <div className="flex p-4 bg-blue-200 rounded-xl text-gray-800 gap-5">
                            <div className="font-bold text-xl leading-none">
                              milestone ID : {milestone.value.id.value}
                            </div>
                            <div className="font-bold text-xl leading-none">
                              Amount : {milestone.value.amount.value / 1000000}{' '}
                              STX
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </body>
  );
};

export default ProposalPage;
