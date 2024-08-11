import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import Login from './Login';
import Confirm from './Confirm';
import { FC, useEffect } from 'react';
import getAuthenticationStatus from '../../api/get-authentication-status';

const Authenication: FC<{}> = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const navigateByInteractionStage = async (
    interactionId: string,
  ): Promise<void> => {
    const status = await getAuthenticationStatus(interactionId);
    navigate(`/${status}/${searchParams.get('interactionId')}`);
  };

  useEffect(() => {
    if (searchParams.has('interactionId')) {
      navigateByInteractionStage(searchParams.get('interactionId') ?? '');
    }
  }, []);

  return (
    <Routes>
      <Route path={`/login/:interactionId`} element={<Login />} />
      <Route path={`/consent/:interactionId`} element={<Confirm />} />
    </Routes>
  );
};

export default Authenication;
