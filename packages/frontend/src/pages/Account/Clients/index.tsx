import { FC, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
} from '@mui/material';
import { AddBusiness, Delete } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ClientPopup from './ClientPopup';
import getClients from '../../../api/get-clients';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import deleteClient from '../../../api/delete-client';

interface Client {
  id: string;
  name: string;
  secret: string;
}

const Clients: FC<{}> = () => {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchClients = async () => {
    try {
      const response = await getClients();
      setClients(response.data.results);
    } catch (err) {
      enqueueSnackbar(
        err instanceof AxiosError && err?.response?.data?.error
          ? err.response.data.error
          : 'There was an issue retreiving clients, please try again',
        { variant: 'error' },
      );
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      const response = await deleteClient(id);
      enqueueSnackbar(
        response?.data?.message ?? 'Successfully deleted cleint',
        { variant: 'success' },
      );
      setClients(clients.filter((client) => client.id !== id));
    } catch (err) {
      enqueueSnackbar(
        err instanceof AxiosError && err?.response?.data?.error
          ? err.response.data.error
          : 'There was an issue deleting the client, please try again',
        { variant: 'error' },
      );
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const onClose = () => {
    setOpen(false);
    fetchClients();
  };

  const columns: GridColDef<(typeof clients)[number]>[] = [
    {
      field: 'clientName',
      headerName: 'Name',
      width: 200,
      editable: false,
    },
    {
      field: 'secret',
      headerName: 'Secret',
      width: 200,
      editable: false,
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

  return (
    <Card elevation={0}>
      <CardHeader
        title='Clients'
        action={
          <Button
            variant='outlined'
            color='success'
            startIcon={<AddBusiness />}
            onClick={() => setOpen(true)}
          >
            Create new Client
          </Button>
        }
      />
      <CardContent>
        <DataGrid
          rows={clients}
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
        <ClientPopup open={open} onClose={onClose} />
      </CardContent>
    </Card>
  );
};

export default Clients;
