import React, { ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function App(): ReactElement {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/proposals');
  }, []);
  return <></>;
}

export default App;
