import { useEffect } from 'react';
import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import Login from './Login';
import Confirm from './Confirm';
import getInteractionStatus from '../api/get-interaction-status';
import Register from './Register';
import { AxiosError } from 'axios';

function Pages() {
  const { enqueueSnackbar } = useSnackbar();
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
      enqueueSnackbar(
        err instanceof AxiosError && err?.response?.data?.error
          ? err.response.data.error
          : 'Failed to process authentication',
        { variant: 'error' },
      );
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
