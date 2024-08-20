import { FC, useState } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

const Users: FC<{}> = () => {
  const [users, setUsers] = useState<User[]>([]);

  const columns: GridColDef<(typeof users)[number]>[] = [
    {
      field: 'firstName',
      headerName: 'First Name',
      width: 200,
      editable: false,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 200,
      editable: false,
    },
  ];

  return (
    <Card elevation={0}>
      <CardHeader title='Users' />
      <CardContent>
        <DataGrid
          rows={users}
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

export default Users;
