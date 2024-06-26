import { Component, DoCheck, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { MonitoringService } from '../service/monitoring.service';
import { AuthService } from '../service/auth.service';
import { DropboxService } from '../service/dropbox.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { PendingDialogComponent } from '../shared/components/pending-dialog/pending-dialog.component';
import { ConfigDropboxDialogComponent } from '../shared/components/config-dropbox-dialog/config-dropbox-dialog.component';
import {ThemePalette, provideNativeDateAdapter} from '@angular/material/core';
import { format } from 'date-fns';
import { DropBoxEntry } from '../interfaces/DropBoxEntry.interface';
import { Banco, Monitoring, logMonitoring } from '../interfaces/LogMonitoring.interface';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrl: './monitoring.component.css',
  providers: [provideNativeDateAdapter()],
})
export class MonitoringComponent implements OnInit, DoCheck {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  statusAppsActive: string[] = [];

  statusApps = [
    {
      description: 'Ativo',
      icon: '✅',
      active:
        localStorage.getItem('statusApp') === null
          ? true
          : localStorage.getItem('statusApp')!.split(',').includes('Ativo')
          ? true
          : false,
    },
    {
      description: 'Aplicação Iniciada',
      icon: '🚀',
      active:
        localStorage.getItem('statusApp') === null
          ? true
          : localStorage
              .getItem('statusApp')!
              .split(',')
              .includes('Aplicação Iniciada')
          ? true
          : false,
    },
    {
      description: 'Aplicação Fechada',
      icon: '🚪',
      active:
        localStorage.getItem('statusApp') === null
          ? true
          : localStorage
              .getItem('statusApp')!
              .split(',')
              .includes('Aplicação Fechada')
          ? true
          : false,
    },
    {
      description: 'Alerta Fechada',
      icon: '🚨',
      active:
        localStorage.getItem('statusApp') === null
          ? true
          : localStorage
              .getItem('statusApp')!
              .split(',')
              .includes('Alerta Fechada')
          ? true
          : false,
    },
    {
      description: 'Alerta Ativo',
      icon: '🔔',
      active:
        localStorage.getItem('statusApp') === null
          ? true
          : localStorage
              .getItem('statusApp')!
              .split(',')
              .includes('Alerta Ativo')
          ? true
          : false,
    },
    {
      description: 'Erro',
      icon: '🚫',
      active:
        localStorage.getItem('statusApp') === null
          ? true
          : localStorage.getItem('statusApp')!.split(',').includes('Erro')
          ? true
          : false,
    },
    {
      description: 'Limpeza Finalizada e Reiniciando Aplicação',
      icon: '🔄',
      active:
        localStorage.getItem('statusApp') === null
          ? true
          : localStorage
              .getItem('statusApp')!
              .split(',')
              .includes('Limpeza Finalizada e Reiniciando Aplicação')
          ? true
          : false,
    },
    {
      description: 'Backup Iniciado',
      icon: '⏳🗃️',
      active:
        localStorage.getItem('statusApp') === null
          ? true
          : localStorage
              .getItem('statusApp')!
              .split(',')
              .includes('Backup Iniciado')
          ? true
          : false,
    },
    {
      description: 'Backup Finalizado e Upload Iniciado',
      icon: '⏳📤',
      active:
        localStorage.getItem('statusApp') === null
          ? true
          : localStorage
              .getItem('statusApp')!
              .split(',')
              .includes('Backup Finalizado e Upload Iniciado')
          ? true
          : false,
    },
    {
      description: 'Upload Finalizado e Limpeza Iniciada',
      icon: '⌛🗑️',
      active:
        localStorage.getItem('statusApp') === null
          ? true
          : localStorage
              .getItem('statusApp')!
              .split(',')
              .includes('Upload Finalizado e Limpeza Iniciada')
          ? true
          : false,
    },
    {
      description: 'Não encontrado',
      icon: '♾️',
      active:
        localStorage.getItem('statusApp') === null
          ? true
          : localStorage
              .getItem('statusApp')!
              .split(',')
              .includes('Não encontrado')
          ? true
          : false,
    },
  ];
  markAll: any;
  licenses: any[] = [];
  displayedColumns: string[] = [
    'statusApp',
    '%',
    'caminhoPasta',
    'dateCurrent',
    'status',
    'nameCurrent',
    'sizeCurrent',
    'namePrevious',
    'sizePrevious',
  ];
  dataSource: any;
  filterValue: any;
  isChecked: boolean = Boolean(localStorage.getItem('checkboxPedente'));
  user: any;
  situations: string[] = [
    'OK',
    'Não Subiu',
    'Reduzido',
    'Novo',
    'Gerando Backup',
    'Aguardando Upload',
    'Aguardando Retorno',
    'Aguardando Horário',
    'E-mail/WhatsApp Enviado',
  ];
  changesituations: any;
  log: logMonitoring[] = [];
  selectedSituation: string = '1';
  row: any;
  constructor(
    public auth: AuthService,
    private MonitoringService: MonitoringService,
    private dropboxService: DropboxService,
    public dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('statusApp') === null) {
      this.statusActive();
    }
    this.user = this.auth.UserAuth();

    if (this.user && (await this.dropboxService.Token())) {
      this.table()
        .then(async (result) => {
          this.dataSource = new MatTableDataSource(result);
        })
        .catch((error) => {
          console.error(error);
        });

      setInterval(async () => {
        await this.refresh();
      }, 300000);
    } else {
      this.auth.navigate('');
    }
  }

  emoji(element: any): any {
    this.statusApps = this.statusApps.map((app) => {
      if (app.description === element.description) {
        return { ...app, active: !app.active };
      }
      return app;
    });

    this.statusActive();
    this.refresh();
  }

  toggleAll() {
    const allTrue = this.statusApps.every((item) => item.active === true);

    this.statusApps.forEach((item) => (item.active = !allTrue));
    this.statusActive();
    if (allTrue === false) {
      this.refresh();
    }
  }

  isAllTrue(): boolean {
    return this.statusApps.every((item) => item.active === true);
  }

  isAllFalse(): boolean {
    return this.statusApps.every((item) => item.active === false);
  }

  statusActive(): any {
    this.statusAppsActive = [];
    this.statusApps.map((item) => {
      if (item.active === true) {
        this.statusAppsActive.push(item.description);
      }
    });

    localStorage.setItem('statusApp', this.statusAppsActive.toString());
  }
  async statusLog(key: string): Promise<any> {
    let resdescription = null;
    let result = null;
    let velidationLog: any[] = [];

    const dataInformationLog =
      await this.MonitoringService.getDataInformationLog(key);

    if (dataInformationLog !== null) {
      const transformedData = Object.entries(dataInformationLog).map(
        ([date, { description }]) => ({
          date,
          description,
        })
      );

      transformedData.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      for (const item of transformedData) {
        const dataHoraHorario = this.auth.getCurrentDateTime().split(' ')[0];
        const dataHoraAnterior = format(
          new Date(this.auth.getCurrentDateTime().split(' ')[0]),
          'yyyy-MM-dd'
        );
        const dataUltimoLog = item.date.split(' ')[0];

        if (
          dataUltimoLog === dataHoraHorario ||
          dataUltimoLog === dataHoraAnterior
        ) {
          velidationLog.push({
            description: `${this.auth.formatDate9(item.date)} ${
              switchLog(item.description).icon
            }`,
            obs: item.description.split(',')[1],
          });
        } else {
          if (dataUltimoLog === (transformedData[0]?.date).split(' ')[0]) {
            velidationLog.push({
              description: `${this.auth.formatDate9(item.date)} ${
                switchLog(item.description).icon
              }`,
              obs: item.description.split(',')[1],
            });
          }
        }
      }

      let validationDate = false;
      const validationHours = (await this.MonitoringService.getDatatoken())
        .validationHours;

      for (const horario of validationHours.split(',')) {
        let hourCurrent0 = this.auth
          .getCurrentDateTime()
          .split(':')[0]
          .replaceAll('-', '')
          .replaceAll(' ', '');
        let minuteCurrent1 = this.auth
          .getCurrentDateTime()
          .split(' ')[1]
          .split(':')[1];

        if (
          +formatDateHour(horario)
            .split(':')[0]
            .replaceAll('-', '')
            .replaceAll(' ', '') ===
          +this.auth
            .getCurrentDateTime()
            .split(':')[0]
            .replaceAll('-', '')
            .replaceAll(' ', '')
        ) {
          if (transformedData[0]?.description === 'Aplicação Fechada') {
            resdescription = { description: 'Alerta Fechada', icon: '🚨' };
          } else if (
            +(transformedData[0]?.date)
              .split(':')[0]
              .replaceAll('-', '')
              .replaceAll(' ', '') ===
            +formatDateHour(horario)
              .split(':')[0]
              .replaceAll('-', '')
              .replaceAll(' ', '')
          ) {
            resdescription = { description: 'Alerta Ativo', icon: '🔔' };
          } else {
            resdescription = { description: 'Alerta Fechada', icon: '🚨' };
            if (
              hourCurrent0 + minuteCurrent1 >= hourCurrent0 + 15 &&
              hourCurrent0 + minuteCurrent1 <= hourCurrent0 + 59
            ) {
              this.MonitoringService.updateStatusApp(
                key,
                this.auth.getCurrentDateTime(),
                'Aplicação Fechada'
              );
            }
          }

          break;
        } else {
          for (const item of transformedData) {
            const dataHoraHorario = this.auth
              .getCurrentDateTime()
              .split(' ')[0];
            const dataUltimoLog = item.date.split(' ')[0];

            if (dataUltimoLog === dataHoraHorario) {
              validationDate = true;
              break;
            } else {
              validationDate = false;
              break;
            }
          }

          if (validationDate) {
            resdescription = switchLog(transformedData[0]?.description);
          } else {
            resdescription = switchLog(transformedData[0]?.description);
          }
        }
      }
    } else {
      resdescription = { description: 'Não encontrado', icon: '♾️' };
    }

    result = {
      description: resdescription,
      date: velidationLog,
    };

    return result;

    function formatDateHour(hora: string): string {
      const dataAtual = new Date();
      const [hh, mm] = hora.split(':');

      // Ajustar a hora atual para os horários fornecidos
      dataAtual.setHours(parseInt(hh, 10));
      dataAtual.setMinutes(parseInt(mm, 10));

      // Obter as partes da data e hora local
      const ano = dataAtual.getFullYear();
      const mes = dataAtual.getMonth() + 1; // Meses são baseados em zero
      const dia = dataAtual.getDate();
      const horas = dataAtual.getHours();
      const minutos = dataAtual.getMinutes();

      // Formatar a data e hora manualmente
      const dataFormatada = `${ano}-${mes.toString().padStart(2, '0')}-${dia
        .toString()
        .padStart(2, '0')} ${horas.toString().padStart(2, '0')}:${minutos
        .toString()
        .padStart(2, '0')}`;

      return dataFormatada;
    }

    function switchLog(data: any) {
      let result;
      switch (data.split(',')[0]) {
        case 'Ativo':
          result = { description: data.split(',')[0], icon: '✅' };
          break;
        case 'Erro':
          result = { description: data.split(',')[0], icon: '🚫' };
          break;
        case 'Aplicação Fechada':
          result = { description: data.split(',')[0], icon: '🚪' };
          break;
        case 'Aplicação Iniciada':
          result = { description: data.split(',')[0], icon: '🚀' };
          break;
        case 'Backup Iniciado':
          result = { description: data.split(',')[0], icon: '⏳🗃️' };
          break;
        case 'Backup Finalizado e Upload Iniciado':
          result = { description: data.split(',')[0], icon: '⏳📤' };
          break;
        case 'Upload Finalizado e Limpeza Iniciada':
          result = { description: data.split(',')[0], icon: '⌛🗑️' };
          break;
        case 'Limpeza Finalizada e Reiniciando Aplicação':
          result = { description: data.split(',')[0], icon: '🔄' };
          break;
        default:
          result = { description: 'Não encontrado', icon: '♾️' };
          break;
      }

      return result;
    }
  }

  async refresh(): Promise<void> {
    if (this.user && (await this.dropboxService.Token())) {
      this.table()
        .then(async (result) => {
          this.dataSource = new MatTableDataSource(result);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      this.auth.navigate('');
    }
  }

  async refreshButton(event: Event): Promise<void> {
    // this.accordion.closeAll();
    event.stopPropagation();
    if (this.user && (await this.dropboxService.Token())) {
      this.table()
        .then(async (result) => {
          this.dataSource = new MatTableDataSource(result);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      this.auth.navigate('');
    }
  }

  ngDoCheck(): void {
    if (this.dataSource) {
      if (this.filterValue === undefined || this.filterValue === '') {
        this.dataSource.filter = null;
      }
    }
  }

  rowClicked(key: any): void {
    this.auth.navigate(`Register/${key}`);
  }
  rowClickedPending(key: any): void {
    const dialogRef = this.dialog.open(PendingDialogComponent, {
      width: '55rem',
      height: '40rem',
      data: key,
    });
  }

  rowClick(element: any): void {
    console.log(element);
    this.auth.Alert(
      `Banco de dados: ${element.nameDataBase}  Horários: ${element.hours}  Acesso: ${element.access} Senha: ${element.accessPassword}`,
      15000
    );
  }

  change(element: any): void {
    const listaCNPJs = this.obterListaCNPJs();

    this.adicionarCNPJNaLista(listaCNPJs, element.key);
  }

  checkboxChanged() {
    // this.accordion.closeAll();
    this.table()
      .then(async (result) => {
        this.dataSource = new MatTableDataSource(result);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  changecheckbox(status: boolean): void {
    if (status) {
      localStorage.setItem('checkboxPedente', status.toString());
    } else {
      localStorage.removeItem('checkboxPedente');
    }
  }
  situationChanged(event: any): void {
    this.selectedSituation = event.target.value;
    this.table()
      .then(async (result) => {
        this.dataSource = new MatTableDataSource(result);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

  async table(): Promise<Monitoring[]> {
    return new Promise<Monitoring[]>((resolve, reject) => {
      this.MonitoringService.getDataLincese().subscribe(
        (dados) => {
          this.licenses = dados;
          this.log = [];
          const listaMonitoramento: Monitoring[] = [];
          this.row = 0;
          this.licenses.forEach((item) => {
            if (item.config && item.config.bancos) {
              let bancosArray: Banco[] = JSON.parse(item.config.bancos);
              let pastas: string[] = [];
              let hour: any[] = [];
              bancosArray.forEach(async (banco) => {
                let caminhoPasta: string = banco.caminhopasta;
                hour.push({
                  [banco.caminhopasta]: {
                    [banco.databasename]: {
                      hour: `${banco.firstSchedule} ${
                        banco.secondSchedule === '  :  '
                          ? ''
                          : banco.secondSchedule
                      }`,
                    },
                  },
                });

                if (item.status === this.selectedSituation) {
                  if (
                    !pastas.includes(caminhoPasta) &&
                    caminhoPasta !== 'Licenca encerrada'
                  ) {
                    this.dropBox(caminhoPasta, this.selectedSituation)
                      .then((result) => {
                        const bancos: Record<string, DropBoxEntry[]> = {};
                        result.forEach((item) => {
                          const regex = /_(.*?)\.(backup|json)/;
                          const correspondencias = regex.exec(item.name);
                          if (correspondencias && correspondencias.length > 1) {
                            const nomeDoBanco = correspondencias[1];

                            if (!bancos[nomeDoBanco]) {
                              bancos[nomeDoBanco] = [];
                            }
                            bancos[nomeDoBanco].push(item);
                          }
                        });

                        Object.keys(bancos).forEach(async (nomeDoBanco) => {
                          const arquivosDoBanco = bancos[nomeDoBanco];
                          const arquivosOrdenados = arquivosDoBanco.sort(
                            (a, b) => {
                              return (
                                new Date(b.server_modified).getTime() -
                                new Date(a.server_modified).getTime()
                              );
                            }
                          );

                          const ultimosDoisArquivos = arquivosOrdenados.slice(
                            0,
                            2
                          );

                          let dateCurrent: string | null = null;
                          let datePrevious: string | null = null;
                          let sizeCurrent: number | null = null;
                          let sizePrevious: number | null = null;
                          let nameCurrent: string = '';
                          let namePrevious: string = '';
                          let key = item.key;
                          ultimosDoisArquivos.forEach((item, index) => {
                            let datearquivo = item.name.split('_');
                            if (index === 0) {
                              sizeCurrent = item.size;
                              nameCurrent = item.name;

                              if (datearquivo[0].length !== 8) {
                                dateCurrent = this.auth.formatDate2(
                                  item.server_modified
                                );
                              } else {
                                dateCurrent = this.auth.formatDate1(
                                  datearquivo[0]
                                );
                              }
                            } else {
                              sizePrevious = item.size;
                              namePrevious = item.name;

                              if (datearquivo[0].length !== 8) {
                                datePrevious = this.auth.formatDate2(
                                  item.server_modified
                                );
                              } else {
                                datePrevious = this.auth.formatDate1(
                                  datearquivo[0]
                                );
                              }
                            }
                          });

                          const listaCNPJs = this.obterListaCNPJs();

                          const estaNaLista = verificarCNPJNaLista(
                            listaCNPJs,
                            key
                          );

                          let ischecked: boolean = false;
                          if (estaNaLista) {
                            ischecked = true;
                          } else {
                            ischecked = false;
                          }
                          let returnpercentage = calculatepercentage(
                            sizePrevious,
                            sizeCurrent
                          );

                          const status = await this.status(
                            sizeCurrent,
                            sizePrevious,
                            dateCurrent,
                            key,
                            nomeDoBanco,
                            nameCurrent
                          );
                          const statusApp = await this.statusLog(key);

                          let hourData: any[] = [];
                          hour.forEach((item) => {
                            if (item[caminhoPasta][nomeDoBanco] !== undefined) {
                              hourData.push(
                                item[caminhoPasta][nomeDoBanco]?.hour
                              );
                            }
                          });
                          const statusAppsActives = localStorage
                            .getItem('statusApp')!
                            .split(',');

                          if (
                            statusAppsActives.includes(
                              statusApp.description.description
                            )
                          ) {
                            if (
                              nameCurrent.split('_')[1].split('.')[0] ===
                              'newcompany'
                            ) {
                              listaMonitoramento.push({
                                checked: ischecked,
                                sign: returnpercentage.sign,
                                percentage: returnpercentage.percentage,
                                key,
                                caminhoPasta,
                                nameDataBase: nomeDoBanco,
                                status: 'Novo',
                                statusAppDescription:
                                  statusApp.description.description,
                                statusAppIcon: statusApp.description.icon,
                                statusAppLog: statusApp.date,
                                dateCurrent,
                                datePrevious: null,
                                sizeCurrent: this.auth.formatSize1(null),
                                sizePrevious: this.auth.formatSize1(null),
                                nameCurrent: null,
                                namePrevious: null,
                                hours: null,
                                access: null,
                                accessPassword: null,
                              });
                              this.row = this.row + 1;
                            } else {
                              if (this.isChecked) {
                                if (status !== 'OK') {
                                  listaMonitoramento.push({
                                    checked: ischecked,
                                    sign: returnpercentage.sign,
                                    percentage: returnpercentage.percentage,
                                    key,
                                    caminhoPasta,
                                    nameDataBase: nomeDoBanco,
                                    status: status,
                                    statusAppDescription:
                                      statusApp.description.description,
                                    statusAppIcon: statusApp.description.icon,
                                    statusAppLog: statusApp.date,
                                    dateCurrent,
                                    datePrevious,
                                    sizeCurrent:
                                      this.auth.formatSize1(sizeCurrent),
                                    sizePrevious:
                                      this.auth.formatSize1(sizePrevious),
                                    nameCurrent,
                                    namePrevious,
                                    hours: hourData,
                                    access: (
                                      await this.MonitoringService.getDataRegister(
                                        key
                                      )
                                    ).acesso,
                                    accessPassword: (
                                      await this.MonitoringService.getDataRegister(
                                        key
                                      )
                                    ).senha,
                                  });
                                  this.row = this.row + 1;
                                }
                              } else {
                                listaMonitoramento.push({
                                  checked: ischecked,
                                  sign: returnpercentage.sign,
                                  percentage: returnpercentage.percentage,
                                  key,
                                  caminhoPasta,
                                  nameDataBase: nomeDoBanco,
                                  status: status,
                                  statusAppDescription:
                                    statusApp.description.description,
                                  statusAppIcon: statusApp.description.icon,
                                  statusAppLog: statusApp.date,
                                  dateCurrent,
                                  datePrevious,
                                  sizeCurrent:
                                    this.auth.formatSize1(sizeCurrent),
                                  sizePrevious:
                                    this.auth.formatSize1(sizePrevious),
                                  nameCurrent,
                                  namePrevious,
                                  hours: hourData,
                                  access: (
                                    await this.MonitoringService.getDataRegister(
                                      key
                                    )
                                  ).acesso,
                                  accessPassword: (
                                    await this.MonitoringService.getDataRegister(
                                      key
                                    )
                                  ).senha,
                                });
                                this.row = this.row + 1;
                              }
                            }
                          }
                        });
                      })
                      .catch((error) => {
                        console.error(caminhoPasta, error);
                      });

                    pastas.push(caminhoPasta);
                  }
                }
              });
            }
          });

          resolve(listaMonitoramento);
        },
        (error) => {
          console.error('Erro ao obter dados de licença', error);
          reject(error);
        }
      );
    });

    function verificarCNPJNaLista(
      listaCNPJs: string,
      cnpjProcurado: string
    ): boolean {
      const lista = listaCNPJs.split(',').map((cnpj) => cnpj.trim()); // Divide a lista em um array
      return lista.includes(cnpjProcurado); // Verifica se o CNPJ procurado está na lista
    }

    function calculatepercentage(sizePrevious: any, sizeCurrent: any): any {
      const subtract =
        (sizeCurrent ? sizeCurrent : 0) - (sizePrevious ? sizePrevious : 0);

      const calculation = (subtract * 100) / (sizeCurrent ? sizeCurrent : 0);
      const sign = subtract >= 0 ? '+' : '-';

      const res = {
        percentage: `${calculation.toFixed(2).replace('.', ',')} %`,
        sign: sign,
      };

      return res;
    }
  }

  getColorStyle(element: any): any {
    if (element.percentage === '0,00 %') {
      return { color: 'black' };
    } else if (element.sign === '+') {
      return { color: 'green' };
    } else if (element.sign === '-') {
      return { color: 'red' };
    } else {
      return { color: 'black' };
    }
  }

  async status(
    sizeCurrent: any,
    sizePrevious: any,
    dateCurrent: any,
    key: any,
    dataBase: any,
    nameCurrent: any
  ): Promise<any> {
    let status: string;

    const dataAtual = new Date();
    const dataAnterior = new Date(dataAtual);
    dataAnterior.setDate(dataAtual.getDate() - 1);

    // Formatando as datas como strings (opcional)
    const formatoData = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    } as const;
    const stringDataAtual = dataAtual.toLocaleDateString('pt-BR', formatoData);
    const stringDataAnterior = dataAnterior.toLocaleDateString(
      'pt-BR',
      formatoData
    );

    if (
      this.auth.formatDate3(dateCurrent) ===
        this.auth.formatDate3(stringDataAtual) ||
      this.auth.formatDate3(dateCurrent) ===
        this.auth.formatDate3(stringDataAnterior)
    ) {
      if (sizeCurrent === 0) {
        status = 'Zerado';
      } else if (sizePrevious > sizeCurrent) {
        status = 'Reduzido';
      } else {
        status = 'OK';
      }
    } else {
      status = 'Não Subiu';
    }

    try {
      const logData: any = await this.auth.getLog(key, dataBase);
      if (logData && logData.length > 0) {
        if (logData[0].namefile === nameCurrent) {
          status = logData[0].situation;
        }
      }
    } catch (error) {
      console.error(error);
    }

    return status;
  }

  async dropBox(
    caminhoDropbox: string,
    selectedSituation: any
  ): Promise<DropBoxEntry[]> {
    try {
      let file;
      if (selectedSituation === '1') {
        file = 'VRBackup';
      } else {
        file = 'VRBackup/Licenca encerrada';
      }
      const result = await this.dropboxService.listarArquivos(
        `/${file}/${caminhoDropbox}`
      );

      const results: DropBoxEntry[] = result.entries.map((item) => ({
        server_modified: item['.tag'] === 'file' && item.server_modified,
        name: item.name,
        client_modified: item['.tag'] === 'file' && item.client_modified,
        size: item['.tag'] === 'file' && item.size,
      }));
      return results;
    } catch (error) {
      // console.error(error);

      const dataAtual = new Date();
      const dataAtualFormatada = `${dataAtual.getFullYear()}-${this.padZero(
        dataAtual.getMonth() + 1
      )}-${this.padZero(dataAtual.getDate())}T${this.padZero(
        dataAtual.getHours()
      )}:${this.padZero(dataAtual.getMinutes())}:${this.padZero(
        dataAtual.getSeconds()
      )}Z`;

      return [
        {
          server_modified: dataAtualFormatada,
          name: '20240204_newcompany.backup',
          client_modified: dataAtualFormatada,
          size: 0,
        },
      ];
    }
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }

  async perfil(): Promise<void> {
    try {
      this.auth.navigate(`User/Perfil/${this.user.uid}`);
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
    }
  }

  async passwordNew(): Promise<void> {
    try {
      this.auth.navigate(`User/Password/${this.user.uid}`);
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
    }
  }

  config(): void {
    const dialogRef = this.dialog.open(ConfigDropboxDialogComponent, {
      width: '60rem',
      height: '70rem',
      data: null,
    });
  }

  addCompany(): void {
    try {
      this.auth.navigate(`Register`);
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
    }
  }
  addUser(): void {
    try {
      this.auth.navigate(`User`);
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
    }
  }

  adicionarCNPJNaLista(listaCNPJs: string, novoCNPJ: string): string {
    const lista = listaCNPJs.split(',').map((cnpj) => cnpj.trim());

    if (!lista.includes(novoCNPJ)) {
      lista.push(novoCNPJ);

      localStorage.setItem('listaCNPJs', lista.join(','));

      return '';
    } else {
      this.removerCNPJDaLista(listaCNPJs, novoCNPJ);
      return '';
    }
  }

  obterListaCNPJs(): string {
    return localStorage.getItem('listaCNPJs') || '';
  }

  removerCNPJDaLista(listaCNPJs: string, cnpjRemover: string): string {
    const lista = listaCNPJs.split(',').map((cnpj) => cnpj.trim());

    const index = lista.indexOf(cnpjRemover);
    if (index !== -1) {
      lista.splice(index, 1);

      localStorage.setItem('listaCNPJs', lista.join(','));

      return '';
    } else {
      return '';
    }
  }
  async changestatus(data: any, situation: string): Promise<void> {
    const logdados = {
      key: data.key,
      situation: situation,
      situationPrevious: data.status,
      movementdate: this.auth.getCurrentDateTime(),
      date: this.auth.getCurrentDate(),
      dateCurrent: this.auth.formatDate3(data.dateCurrent),
      namefile: data.nameCurrent,
      sizefile: data.sizeCurrent,
      percentage: data.percentage,
      dataBase: data.nameDataBase,
    };
    let status;
    try {
      const logData: any = await this.auth.getLog(data.key, data.nameDataBase);
      if (logData && logData.length > 0) {
        status = logData[0].situation;
      }
    } catch (error) {
      console.error(error);
    }

    if (status !== situation) {
      this.MonitoringService.logMonitoring(logdados)
        .then(() => {
          data.status = situation;
        })
        .catch((error) => {
          console.error('Erro ao salvar dados:', error);
        });
    }
  }

}