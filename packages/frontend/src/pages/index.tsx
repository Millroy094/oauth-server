import { useEffect } from 'react';
import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import Login from './Login';
import Confirm from './Confirm';
import getInteractionStatus from '../api/get-interaction-status';
import Register from './Register';

function Pages() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const navigateByInteractionStage = async (
    interactionId: string,
  ): Promise<void> => {
    try {
      const response = await getInteractionStatus(interactionId);
      if (response.data.status) {
        navigate(
          `/oauth/${response.data.status}/${searchParams.get('interactionId')}`,
        );
      }
    } catch (err) {
      console.log(err);
    }
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
