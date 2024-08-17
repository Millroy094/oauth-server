import { useEffect } from 'react';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { useSnackbar } from 'notistack';

import Login from './Login';
import Confirm from './Confirm';
import getInteractionStatus from '../api/get-interaction-status';
import Register from './Register';
import { AxiosError } from 'axios';
import isAuthenticated from '../api/is-authenicated-user';

function Pages() {
  const { enqueueSnackbar } = useSnackbar();
  const { pathname } = useLocation();
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

  const handleAuthenicatedUser = async (): Promise<void> => {
    try {
      await isAuthenticated();
      navigate('/account');
    } catch (err) {
      navigate('/login');
    }
  };

  useEffect(() => {
    if (pathname === '/' && searchParams.has('interactionId')) {
      navigateByInteractionStage(searchParams.get('interactionId') ?? '');
    } else if (pathname === '/') {
      handleAuthenicatedUser();
    }
  }, []);

  return (
    <Routes>
      <Route path={`/register`} element={<Register />} />
      <Route path={`/login`} element={<Login />} />
      <Route path={`/account`} element={<div>WIP</div>} />
      <Route path={`/oauth/login/:interactionId`} element={<Login />} />
      <Route path={`/oauth/consent/:interactionId`} element={<Confirm />} />
    </Routes>
  );
}

export default Pages;
