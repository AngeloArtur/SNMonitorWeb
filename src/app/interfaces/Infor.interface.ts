export interface Infor {
  [key: string]: {
    [date: string]: {
      shifts: {
        SizeByte?: any;
        SizeMbGb?: any;
        backup?: {
          end?: any;
          start?: any;
          erro?: any;
        };
        freeSpace?: any;
        last5Line?: any;
        lastLine?: any;
        sizeDataBase?: any;
        totalSpace?: any;
        upload?: {
          erro?: any;
          start?: any;
          end?: any;
        };
      }[];
    };
  };
}

export interface InforLog {
  [date: string]: {
    description: string;
  };
}