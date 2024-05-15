export interface DropBoxEntry {
  server_modified: any;
  name: any;
  client_modified: any;
  size: any;
}

export interface Token {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  tokenEndpoint: string;
  remetente: string;
  passwordRemetente: string;
  destinatarios: any;
  destinatariosCopy: any;
  expirationDate: any;
  tokenBrevo: any;
  validationHours: any;
}