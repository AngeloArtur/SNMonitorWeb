export interface TableData {
  list: string[];
  clientInProcess: string | any;
  databaseInProcess: string | any;
  numberTentativaMax: number | undefined;
  numberlastFiveLines: number | undefined;
  refresh: boolean | undefined;
  restart: boolean | undefined;
}
