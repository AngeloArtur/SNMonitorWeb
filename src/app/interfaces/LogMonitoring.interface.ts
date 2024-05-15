export interface logMonitoring {
  key: any;
  situationPrevious: any;
  situation: any;
  movementdate: any;
  date: any;
  dateCurrent: any;
  namefile: any;
  sizefile: any;
  percentage: any;
  dataBase: any;
}

export interface GetLog {
  [movementdate: string]: {
    [dataBase: string]: {
      situation: any;
      situationPrevious: any;
      dateCurrent: any;
      namefile: any;
      sizefile: any;
      percentage: any;
    };
  };
}

export interface TestData {
  list?: string[];
  log?: {
    [logId: string]: {
      vr: {
        dateHourProcess: string;
        logs: string;
        status: string;
        title: string;
      };
    };
  };
  settings?: {
    clientInProcess: string;
    dataBaseInProcess: string;
    numberTentativa: number;
    numberTentativaMax: number;
    numberlastFiveLines: number;
    refresh: boolean;
    restartApp: boolean;
  };
}

export interface Banco {
  databasename: string;
  caminhopasta: string;
  firstSchedule: string;
  secondSchedule: string;
}

export interface Send {
  dateCurrent: any;
  sizeCurrent: any;
  sizePrevious: any;
  pasta: any;
  key: any;
  responsavel: any;
  email: any;
  telefone: any;
}

export interface Monitoring {
  checked: any;
  sign: any;
  percentage: any;
  key: any;
  caminhoPasta: any;
  nameDataBase: any;
  status: any;
  statusAppDescription: any;
  statusAppIcon: any;
  statusAppLog: any;
  dateCurrent: any;
  datePrevious: any;
  sizeCurrent: any;
  sizePrevious: any;
  nameCurrent: any;
  namePrevious: any;
  hours: any;
  access: any;
  accessPassword: any;
}