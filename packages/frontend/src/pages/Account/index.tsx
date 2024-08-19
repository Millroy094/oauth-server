import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { AccountBox, Security, VpnKey } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppBar, Button, Container, Toolbar } from '@mui/material';
import Profile from './Profile';
import logoutUser from '../../api/logout-user';
import Sessions from './Sessions';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  size: 'sm' | 'md' | 'lg' | 'xl';
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, size } = props;

  return (
    value === index && (
      <Container maxWidth={size} sx={{ p: 2 }}>
        {children}
      </Container>
    )
  );
}

export default function Account() {
  const [value, setValue] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (err) {
      enqueueSnackbar(
        err instanceof AxiosError && err?.response?.data?.error
          ? err.response.data.error
          : 'Failed to logout user, please try again.',
        { variant: 'error' },
      );
    }
  };

  return (
    <>
      <AppBar position='static' sx={{ mb: '50px' }}>
        <Container maxWidth='xl'>
          <Toolbar>
            <Typography
              variant='h6'
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                flexGrow: 1,
              }}
            >
              LOGO
            </Typography>

            <Button variant='contained' color='error' onClick={handleLogout}>
              Log out
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: 'background.paper',
          display: 'flex',
        }}
      >
        <Tabs
          orientation='vertical'
          variant='scrollable'
          value={value}
          onChange={handleChange}
          aria-label='User Account Tabs'
          sx={{ borderRight: 1, borderColor: 'divider', width: 100 }}
        >
          <Tab label='Profile' icon={<AccountBox color='error' />} />
          <Tab label='Security' icon={<Security color='warning' />} />
          <Tab label='Sessions' icon={<VpnKey color='success' />} />
        </Tabs>
        <TabPanel value={value} index={0} size='sm'>
          <Profile />
        </TabPanel>
        <TabPanel value={value} index={1} size='sm'></TabPanel>
        <TabPanel value={value} index={2} size='md'>
          <Sessions />
        </TabPanel>
      </Box>
    </>
  );
}
