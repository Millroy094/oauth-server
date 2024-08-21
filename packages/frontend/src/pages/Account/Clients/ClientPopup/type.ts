interface IRedirectUri {
  id: string;
  value: string;
}

interface IClientPopupInput {
  name: string;
  scopes: string[];
  grants: string[];
  redirectUris: IRedirectUri[];
}
