import { Request, Response } from 'express';
import { ClientService } from '../services';

import { HTTP_STATUSES } from '../constants';
import { AnyItem } from 'dynamoose/dist/Item';

class AdminController {
  public static async createClient(req: Request, res: Response) {
    try {
      await ClientService.createClient(req.body);
      res
        .json({ message: 'Successfully registered client!' })
        .status(HTTP_STATUSES.ok);
    } catch (err) {
      console.log(err);
      res
        .status(HTTP_STATUSES.serverError)
        .json({ error: 'Failed registering client' });
    }
  }

  public static async getClients(req: Request, res: Response) {
    try {
      const clients = await ClientService.getClients();

      const results = clients.map((client: AnyItem) => ({
        id: client.id,
        clientId: client.clientId,
        clientName: client.clientName,
        secret: client.secret,
      }));

      res
        .json({ results, message: 'Successfully retrieved clients!' })
        .status(HTTP_STATUSES.ok);
    } catch (err) {
      console.log(err);
      res
        .status(HTTP_STATUSES.serverError)
        .json({ error: 'Failed retrieve clients' });
    }
  }

  public static async getClient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const clientRecord = await ClientService.getClientById(id);
      res.status(HTTP_STATUSES.ok).json({ client: clientRecord });
    } catch (err) {
      console.log(err);
      res
        .status(HTTP_STATUSES.notFound)
        .json({ error: 'There was an issue fetching client info' });
    }
  }

  public static async updateClient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ClientService.updateClient(id, req.body);
      res
        .status(HTTP_STATUSES.ok)
        .json({ message: 'Successfully updated client record!' });
    } catch (err) {
      console.log(err);
      res
        .status(HTTP_STATUSES.notFound)
        .json({ error: 'There was an issue updating client record' });
    }
  }

  public static async deleteClient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ClientService.deleteClients(id);
      res
        .status(HTTP_STATUSES.ok)
        .json({ message: 'Successfully deleted client record!' });
    } catch (err) {
      console.log(err);
      res
        .status(HTTP_STATUSES.notFound)
        .json({ error: 'There was an issue deleting client' });
    }
  }
}

export default AdminController;
