import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { SVGComponent } from './stacksSvg';

import { WalletConnectButton } from './walletConnect';
import { useAccount } from '@micro-stacks/react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any

const LeftMenu = () => {
  const { stxAddress } = useAccount();
  const { slug } = useParams();
  const getNavLinkClass = ({ isActive }: any) => {
    return isActive
      ? 'flex items-center gap-5 bg-blue-500 rounded-xl font-bold text-md text-white py-3 px-4'
      : 'flex items-center gap-5 bg-white hover:bg-blue-50 rounded-xl font-bold text-md text-gray-900 py-3 px-4';
  };
  return (
    <aside className="fixed inset-y-0 left-0 bg-white shadow-md w-80 h-screen">
      <div className="flex flex-col justify-between h-full">
        <div className="flex-grow">
          <div className="px-4 py-6 text-center border-b flex flex-row items-center justify-center gap-2">
            <SVGComponent />
            <h1 className="text-xl font-normal leading-none">
              <span className="text-blue-500">s</span>DAO
            </h1>
          </div>
          <div className="p-4">
            <ul className="space-y-5">
              {/* <li>
                <NavLink to={'/home'} className={getNavLinkClass}>
                  <img src="../assets/home.png" alt="" width={50} />
                  Home
                </NavLink>
              </li> */}
              <li>
                <NavLink to={'/proposals'} className={getNavLinkClass}>
                  <img src="../assets/proposals.png" alt="" width={50} />
                  Proposals
                </NavLink>
              </li>
              <li>
                <NavLink to={'/new-proposal'} className={getNavLinkClass}>
                  <img src="../assets/proposal.png" alt="" width={50} />
                  New grant proposal
                </NavLink>
              </li>
              <li>
                <NavLink to={'/claim'} className={getNavLinkClass}>
                  <img src="../assets/claim.png" alt="" width={50} />
                  Claim milestones
                </NavLink>
              </li>
              {stxAddress === 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM' && (
                <li>
                  <NavLink to={'/bootstrap'} className={getNavLinkClass}>
                    <img src="../assets/bootstrap.png" alt="" width={50} />
                    Bootstrap DAO
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="p-10 pb-25">
          <WalletConnectButton />
        </div>
      </div>
    </aside>
  );
};

export default LeftMenu;
