import {
  useAccount,
  useOpenContractCall,
  useOpenContractDeploy
} from '@micro-stacks/react';
import React from 'react';
import { toast } from 'sonner';
import CodeEditor from '../components/codeEditor';
import LeftMenu from '../components/leftMenu';
import {
  contractPrincipalCV,
  stringAsciiCV,
  stringUtf8CV
} from '@stacks/transactions';

import { createClient } from '@supabase/supabase-js';

const initialContractBoilerplate = `;; This is a boilerplate contract for a grant proposal 

(impl-trait .proposal-trait.proposal-trait)

(define-public (execute (sender principal))
	(begin
		(try! (contract-call? .milestone-extension set-milestone (as-contract tx-sender) {id: u1, start-height: block-height, end-height: (+ block-height u1440), amount: u100000000} ))
        (try! (contract-call? .milestone-extension set-milestone (as-contract tx-sender) {id: u2, start-height: (+ block-height u2880), end-height: u4320, amount: u100000000} ))
        (ok true)
	)
)
  `;
const supabase = createClient(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  import.meta.env.VITE_SUPABASE_PROJECT_URL,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const saveSubjectToDB = async (address: string, contract: string) => {
  const { error } = await supabase
    .from('proposals')
    .insert({ address: address, proposal_name: contract });
};

const NewGrantProposal = () => {
  const [code, setCode] = React.useState(initialContractBoilerplate);
  const [contractName, setContractName] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [response, setResponse] = React.useState('');
  const [deployed, setDeployed] = React.useState(false);

  const { openContractCall, isRequestPending: isProposeReqPending } =
    useOpenContractCall();

  const { openContractDeploy, isRequestPending } = useOpenContractDeploy();
  const { stxAddress } = useAccount();
  const handleCodeChange = (code) => {
    console.log('Code in parent component:', code);
    setCode(code);
    // Do something with the code here
  };

  const onDeploy = async () => {
    console.log('deploying contract', code);
    if (!contractName || !code) return;

    await openContractDeploy({
      contractName: contractName,
      // the clarity contract above
      codeBody: code,

      onFinish: async (data: any) => {
        console.log('finished contract deploy!', data);
        setResponse(data);
        toast(`contract ${contractName} deployed!`);
        setDeployed(true);
      },
      onCancel: () => {
        console.log('popup closed!');
      }
    });
  };

  const onPropose = async () => {
    if (!deployed || !contractName || !title || !description) {
      return;
    }

    const functionArgs = [
      contractPrincipalCV(stxAddress!, contractName),
      stringAsciiCV(title),
      stringUtf8CV(description)
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
        saveSubjectToDB(stxAddress!, contractName);
      },
      onCancel: () => {
        console.log('popup closed!');
      }
    });
  };

  return (
    <div className=" bg-blue-50 w-screen">
      <LeftMenu />

      <main className="ml-60 pt-10 ">
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 mb-5">
              <h1 className="text-3xl font-bold mb-5">Propose new grant</h1>
              <div className="pb-5">
                <p>
                  You can propose a new grant by deploying a contract containing
                  your idea and milestones. You can write and deploy a contract
                  from here.
                </p>
                <p>
                  You can set milestones for your project and allocate funds.
                  Once the proposal is passed your milestones will be set
                  on-chain and you can Claim your milestones via the Claim tab.
                </p>
              </div>

              <CodeEditor
                initialCode={initialContractBoilerplate}
                onCodeChange={handleCodeChange}
              ></CodeEditor>

              <div
                className={`${
                  deployed && 'hidden'
                } flex flex-row items-center justify-end gap-10 mt-5 p-2`}
              >
                <div>
                  <input
                    required
                    type="text"
                    onChange={(e) => setContractName(e.target.value)}
                    id="default-input"
                    placeholder="Grant name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={async () => {
                      onDeploy();
                    }}
                    className=" relative inline-flex items-center px-12 py-3 overflow-hidden text-lg font-medium text-indigo-600 border-2 border-indigo-600 rounded-full hover:text-white group hover:bg-gray-50"
                  >
                    <span className="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                    <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        ></path>
                      </svg>
                    </span>
                    <span className="relative">
                      {isRequestPending ? 'request pending...' : 'Deploy'}
                    </span>
                  </button>
                </div>
              </div>

              <div
                className={`${
                  !deployed && 'hidden'
                } flex flex-row items-center justify-end gap-10 mt-5 p-2`}
              >
                <input
                  required
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                  id="default-input"
                  placeholder="title"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <input
                  required
                  type="text"
                  onChange={(e) => setDescription(e.target.value)}
                  id="default-input"
                  placeholder="description"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />

                <div>
                  <button
                    type="button"
                    onClick={async () => {
                      onPropose();
                    }}
                    className=" relative inline-flex items-center px-12 py-3 overflow-hidden text-lg font-medium text-indigo-600 border-2 border-indigo-600 rounded-full hover:text-white group hover:bg-gray-50"
                  >
                    <span className="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                    <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        ></path>
                      </svg>
                    </span>
                    <span className="relative">
                      {isProposeReqPending ? 'request pending...' : 'Propose'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewGrantProposal;
