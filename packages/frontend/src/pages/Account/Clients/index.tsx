import { FC, useState } from 'react';
import { Button, Card, CardContent, CardHeader } from '@mui/material';
import { Add } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ClientPopup from './ClientPopup';

interface Client {
  id: string;
  name: string;
  secret: string;
}

const Clients: FC<{}> = () => {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);

  const onClose = () => {
    setOpen(false);
  };

  const columns: GridColDef<(typeof clients)[number]>[] = [
    {
      field: 'name',
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
  ];

  return (
    <Card elevation={0}>
      <CardHeader
        title='Clients'
        action={
          <Button
            variant='outlined'
            color='success'
            startIcon={<Add />}
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
