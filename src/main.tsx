import React from 'react';
import App from './App';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import * as MicroStacks from '@micro-stacks/react';

import './index.css';
import NewGrantProposal from './pages/newGrantProposal';
import NewClaimProposal from './pages/newClaimProposal';
import { StacksMocknet } from 'micro-stacks/network';
import { Toaster } from 'sonner';
import Proposals from './pages/proposals';
import Bootstrap from './pages/bootstrap';
import ProposalPage from './pages/proposal';

const devnet = new StacksMocknet({ coreApiUrl: 'http://localhost:3999' });

createRoot(document.getElementById('root') as HTMLElement).render(
  <MicroStacks.ClientProvider
    appName="sDAO"
    appIconUrl="APP_ICON.png"
    network={devnet}
  >
    <React.StrictMode>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/new-proposal" element={<NewGrantProposal />}></Route>
          <Route path="/proposals" element={<Proposals />}></Route>
          <Route path="/proposals/:slug" element={<ProposalPage />}></Route>
          <Route path="/claim" element={<NewClaimProposal />}></Route>
          <Route path="/bootstrap" element={<Bootstrap />}></Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </MicroStacks.ClientProvider>
);
