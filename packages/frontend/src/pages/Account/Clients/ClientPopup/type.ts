interface IRedirectUri {
  id: string;
  value: string;
}

interface IClientPopupInput {
  clientId: string;
  clientName: string;
  scopes: string[];
  grants: string[];
  redirectUris: IRedirectUri[];
}
