import { useEffect } from 'react';
import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import Login from './Login';
import Confirm from './Confirm';
import getAuthenticationStatus from '../api/get-authentication-status';
import Register from './Register';

function Pages() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const navigateByInteractionStage = async (
    interactionId: string,
  ): Promise<void> => {
    const status = await getAuthenticationStatus(interactionId);
    navigate(`/oauth/${status}/${searchParams.get('interactionId')}`);
  };

  useEffect(() => {
    if (searchParams.has('interactionId')) {
      navigateByInteractionStage(searchParams.get('interactionId') ?? '');
    }
  }, []);

  return (
    <Routes>
      <Route path={`/register`} element={<Register />} />
      <Route path={`/oauth/login/:interactionId`} element={<Login />} />
      <Route path={`/oauth/consent/:interactionId`} element={<Confirm />} />
    </Routes>
  );
}

export default Pages;
