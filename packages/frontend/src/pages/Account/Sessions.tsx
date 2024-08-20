import { FC, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import getUserSessions from '../../api/get-user-sessions';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Delete } from '@mui/icons-material';
import { format } from 'date-fns';
import deleteUserSession from '../../api/delete-user-session';
import deleteAllUserSession from '../../api/delete-all-user-session';
import { isEmpty } from 'lodash';

interface Session {
  id: string;
  loggedInAt: number;
  clients?: string[];
  iat: number;
  exp: number;
}

const Sessions: FC<{}> = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchSessions = async () => {
    try {
      const response = await getUserSessions();
      setSessions(response.data.sessions);
    } catch (err) {
      enqueueSnackbar(
        err instanceof AxiosError && err?.response?.data?.error
          ? err.response.data.error
          : 'There was an issue retreiving user sessions, please try again',
        { variant: 'error' },
      );
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const columns: GridColDef<(typeof sessions)[number]>[] = [
    {
      field: 'clients',
      headerName: 'Clients',
      width: 200,
      editable: false,
      renderCell: (params) =>
        !isEmpty(params.value) ? params.value.join(', ') : 'None',
    },
    {
      field: 'loggedInAt',
      headerName: 'Logged in at',
      width: 180,
      editable: false,
      valueFormatter: (value) =>
        format(new Date(value * 1000), 'dd/MM/yyyy HH:mm:ss'),
    },
    {
      field: 'iat',
      headerName: 'Started at',
      width: 180,
      editable: false,
      valueFormatter: (value) =>
        format(new Date(value * 1000), 'dd/MM/yyyy HH:mm:ss'),
    },
    {
      field: 'exp',
      headerName: 'Expires at',
      width: 180,
      editable: false,
      valueFormatter: (value) =>
        format(new Date(value * 1000), 'dd/MM/yyyy HH:mm:ss'),
    },
    {
      field: 'id',
      headerName: '',
      width: 10,
      editable: false,
      renderCell: (params) => (
        <IconButton color='error' onClick={() => handleDelete(params.value)}>
          <Delete />
        </IconButton>
      ),
    },
  ];

  const handleDelete = async (sessionId: string): Promise<void> => {
    try {
      const response = await deleteUserSession(sessionId);
      enqueueSnackbar(
        response?.data?.message ?? 'Successfully deleted session',
        { variant: 'success' },
      );
      setSessions(sessions.filter((session) => session.id !== sessionId));
    } catch (err) {
      enqueueSnackbar(
        err instanceof AxiosError && err?.response?.data?.error
          ? err.response.data.error
          : 'There was an issue deleting the session, please try again',
        { variant: 'error' },
      );
    }
  };

  const handleDeleteAll = async (): Promise<void> => {
    try {
      const response = await deleteAllUserSession();
      enqueueSnackbar(
        response?.data?.message ?? 'Successfully deleted all sessions',
        { variant: 'success' },
      );
      setSessions([]);
    } catch (err) {
      enqueueSnackbar(
        err instanceof AxiosError && err?.response?.data?.error
          ? err.response.data.error
          : 'There was an issue deleting all sessions, please try again',
        { variant: 'error' },
      );
    }
  };

  return (
    <Card elevation={0}>
      <CardHeader
        title='User sessions'
        action={
          <Button
            variant='outlined'
            color='error'
            startIcon={<Delete />}
            onClick={handleDeleteAll}
            disabled={sessions.length === 0}
          >
            Delete all Session
          </Button>
        }
      />
      <CardContent>
        <DataGrid
          rows={sessions}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </CardContent>
    </Card>
  );
};

export default Sessions;
