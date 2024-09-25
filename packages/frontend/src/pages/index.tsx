import { useEffect } from 'react';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import Login from './Login';
import Confirm from './Confirm';
import getInteractionStatus from '../api/oidc/get-interaction-status';
import Register from './Register';
import { PUBLIC_ROUTES } from '../constants';
import Account from './Account';
import useFeedback from '../hooks/useFeedback';
import globalRouter from '../utils/global-router';
import { useAuth } from '../context/AuthProvider';
import ForgotPassword from './ForgotPassword';

function Pages() {
  const { feedbackAxiosError } = useFeedback();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const Auth = useAuth();
  globalRouter.navigate = navigate;

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
      feedbackAxiosError(err, 'Failed to process authentication');
    }
  };

  useEffect(() => {
    if (pathname === '/' && searchParams.has('interactionId')) {
      navigateByInteractionStage(searchParams.get('interactionId') ?? '');
    } else if (!PUBLIC_ROUTES.includes(pathname) && pathname !== '/login') {
      Auth?.refreshUser();
    }
  }, []);

  return (
    <Routes>
      <Route path={`/registration`} element={<Register />} />
      <Route path={`/login`} element={<Login />} />
      <Route path={`/forgot-password`} element={<ForgotPassword />} />
      <Route path={`/account`} element={<Account />} />
      <Route path={`/oauth/login/:interactionId`} element={<Login />} />
      <Route path={`/oauth/consent/:interactionId`} element={<Confirm />} />
    </Routes>
  );
}

export default Pages;
