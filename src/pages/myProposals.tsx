import React, { useEffect } from 'react';
import LeftMenu from '../components/leftMenu';

interface proposalType {
  abi: string;
  contract_id: string;
}
const MyProposals = () => {
  const [proposals, setProposals] = React.useState<proposalType[]>([]);
  const fetchProposalsByTrait = async () => {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    fetch(
      'http://localhost:3999/extended/v1/contract/by_trait?trait_abi=%7B%09%22functions%22%3A%20%5B%5D%2C%09%22variables%22%3A%20%5B%5D%2C%09%22maps%22%3A%20%5B%5D%2C%09%22fungible_tokens%22%3A%20%5B%5D%2C%09%22non_fungible_tokens%22%3A%20%5B%5D%2C%09%22epoch%22%3A%20%22Epoch21%22%2C%09%22clarity_version%22%3A%20%22Clarity2%22%7D',
      options
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setProposals(response.results);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProposalsByTrait();
  }, []);

  return (
    <div className=" bg-blue-50 w-screen">
      <LeftMenu />

      <main className="ml-60 pt-10 ">
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 mb-5">
              <h1 className="text-3xl font-bold mb-5">Proposals</h1>
              <div className="pb-5">
                <p>Here you can see the list of proposals you have submitted</p>
              </div>

              <div>
                {proposals
                  ? proposals.map((proposal) => (
                      <div>{proposal.contract_id}</div>
                    ))
                  : 'loading...'}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyProposals;
