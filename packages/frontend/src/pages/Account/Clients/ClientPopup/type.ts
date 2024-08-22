interface IRedirectUri {
  id: string;
  value: string;
}

interface IClientPopupInput {
  clientName: string;
  scopes: string[];
  grants: string[];
  redirectUris: IRedirectUri[];
}
