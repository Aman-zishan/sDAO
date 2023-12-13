import { useAuth } from '@micro-stacks/react';
import React from 'react';

export const WalletConnectButton = () => {
  const { openAuthRequest, isRequestPending, signOut, isSignedIn } = useAuth();
  const label = isRequestPending
    ? 'Loading...'
    : isSignedIn
    ? 'Sign out'
    : 'Connect Stacks wallet';
  return (
    <button
      onClick={async () => {
        if (isSignedIn) await signOut();
        else await openAuthRequest();
      }}
    >
      {label}
    </button>
  );
};
