import React, { FC, useEffect } from 'react';
import LeftMenu from '../components/leftMenu';
import ProposalCard from './proposalCard';
import { createClient } from '@supabase/supabase-js';
import { useAccount, useAuth } from '@micro-stacks/react';
import {
  callReadOnlyFunction,
  contractPrincipalCV,
  cvToValue
} from '@stacks/transactions';

interface proposalType {
  address: string;
  proposal_name: string;
  concluded: string;
  passed: string;
  description: string;
  title: string;
}

type TabIdentifier = 'myProposals' | 'allProposals';

const Tab: FC<{
  id: TabIdentifier;
  activeTab: TabIdentifier;
  children: React.ReactNode;
  setActiveTab: (id: TabIdentifier) => void;
}> = ({ id, activeTab, setActiveTab, children }) => (
  <li
    className={`cursor-pointer px-4 py-2 text-sm font-medium text-center ${
      activeTab === id
        ? 'border-b-2 border-blue-500 text-blue-600'
        : 'text-gray-500 hover:text-gray-600'
    }`}
    onClick={() => setActiveTab(id)}
  >
    {children}
  </li>
);
const supabase = createClient(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  import.meta.env.VITE_SUPABASE_PROJECT_URL,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Proposals = () => {
  const [activeTab, setActiveTab] =
    React.useState<TabIdentifier>('myProposals');
  const [proposals, setProposals] = React.useState<proposalType[]>([]);
  const [allProposals, setAllProposals] = React.useState<proposalType[]>([]);
  const { stxAddress } = useAccount();
  const { isSignedIn } = useAuth();

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

        return cvToValue(result).value;
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    }
  };

  const fetchAllProposals = async () => {
    const { data, error, status } = await supabase.from('proposals').select();
    const proposalList: proposalType[] = [];
    console.log(data);
    if (status === 200) {
      const result = await Promise.all(
        data!.map(async (proposal) => {
          const proposalData = await fetchProposalInfo(
            proposal.address,
            proposal.proposal_name
          );
          return {
            address: proposal.address,
            proposal_name: proposal.proposal_name,
            concluded: proposalData.concluded.value,
            passed: proposalData.passed.value,
            description: proposalData.description.value,
            title: proposalData.title.value
          };

          //return proposalList;
        })
      );

      const filteredProposals = result.filter(
        (proposal) => proposal.address == stxAddress
      );

      setAllProposals(result);
      setProposals(filteredProposals);
    }
  };

  useEffect(() => {
    fetchAllProposals();
  }, []);

  return (
    <div className=" bg-blue-50 w-screen h-screen max-h-screen">
      <LeftMenu />

      <main className="ml-60 pt-10 ">
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 mb-5">
              <h1 className="text-3xl font-bold mb-5">Proposals</h1>

              <div className="w-full  mx-auto ">
                <ul className="flex border-b">
                  <Tab
                    id="myProposals"
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  >
                    Your Proposals
                  </Tab>
                  <Tab
                    id="allProposals"
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  >
                    All Proposals
                  </Tab>
                </ul>
                <div className="p-4 pt-10">
                  {activeTab === 'myProposals' && (
                    <div className=" gap-x-20">
                      <div className="flex flex-col gap-5 h-[300px] max-h-[500px] overflow-hidden overflow-scroll ">
                        {proposals.map((proposal) => {
                          return (
                            <ProposalCard
                              contractName={proposal.proposal_name}
                              title={proposal.title}
                              passed={proposal.passed}
                              concluded={proposal.concluded}
                              description={proposal.description}
                            ></ProposalCard>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {activeTab === 'allProposals' && (
                    <div className=" gap-x-20">
                      <div className="flex flex-col gap-5 h-[300px] max-h-[500px] overflow-hidden overflow-scroll ">
                        {allProposals.map((proposal) => {
                          return (
                            <ProposalCard
                              contractName={proposal.proposal_name}
                              title={proposal.title}
                              passed={proposal.passed}
                              concluded={proposal.concluded}
                              description={proposal.description}
                            ></ProposalCard>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Proposals;
