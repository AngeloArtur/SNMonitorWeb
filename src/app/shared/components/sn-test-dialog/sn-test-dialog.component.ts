import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MonitoringService } from '../../../service/monitoring.service';
import { AuthService } from '../../../service/auth.service';
import { CdkDragDrop, moveItemInArray, CdkDrag } from '@angular/cdk/drag-drop';
import { SnTestLogComponent } from '../sn-test-log/sn-test-log.component';
import { SnTestListComponent } from '../sn-test-list/sn-test-list.component';
import { TableData } from '../../../interfaces/TableData.interface';
import { TestData } from '../../../interfaces/LogMonitoring.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sn-test-dialog',
  templateUrl: './sn-test-dialog.component.html',
  styleUrls: ['./sn-test-dialog.component.css'],
})
export class SnTestDialogComponent implements OnInit {
  displayedColumns: string[] = ['name'];
  dataSource: TableData | undefined;
  variavel: any;
  arraySupermercados: string[] = []; // Alterado para um array unidimensional
  savedPositions: string[] = [];
  updateList: string = '';

  longText = '';
  key: any;
  user: any;
  testData: TestData = {};
  refresh: boolean = false;
  restart: boolean = false;

  logData: string[] = [];
  vData: string = '';
  vTitle: string = '';
  vLog: string = '';
  vStatus: string = '';
  titleParts: string[] = [];

  constructor(
    private monitoringService: MonitoringService,
    public auth: AuthService,
    public dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {
    this.savedPositions = [...this.arraySupermercados];
  }

  async ngOnInit(): Promise<void> {
    await this.getData();
    this.user = this.auth.UserAuth();
    await this.showLog();
    this.splitHtmlString();
  }

  signOut(): void {
    this.auth.navigate('Monitoring');
  }

  async getData(): Promise<void> {
    try {
      const data = await this.monitoringService.getTestData();
      if (data) {
        let novoTexto = '';
        const texto: any = data.list?.toString();
        for (let i = 0; i < texto.length; i++) {
          novoTexto += texto[i] === ' ' ? ' ' : texto[i];
        }

        const linhas: string[] = novoTexto.split(';');

        // Concatena todas as linhas em um array unidimensional
        this.arraySupermercados = linhas;

        const tableData: TableData = {
          list: this.arraySupermercados,
          clientInProcess: data.settings?.clientInProcess,
          databaseInProcess: data.settings?.dataBaseInProcess,
          numberTentativaMax: data.settings?.numberTentativaMax,
          numberlastFiveLines: data.settings?.numberlastFiveLines,
          refresh: data.settings?.refresh,
          restart: data.settings?.restartApp,
        };

        this.dataSource = tableData;
      } else {
        console.error('Dados do Firebase não disponíveis.');
      }
    } catch (error) {
      console.error('Erro ao obter dados do Firebase:', error);
    }
  }

  setRefreshTrue(): void {
    this.refresh = !this.refresh;
    this.monitoringService
      .updateRefresh(this.refresh)
      .then(() => {
        console.log('valor alterado', this.refresh);
      })
      .catch((error) => {
        console.error('Erro ao modificar o valor:', error);
      });
    this.refresh = false;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.arraySupermercados,
      event.previousIndex,
      event.currentIndex
    );
    this.savedPositions = [...this.arraySupermercados];
    this.updateList = this.savedPositions
      .toString()
      .replace(/(\d{14}),([^,]*)/g, '$1;$2');
    console.log(
      'Posições salvas:',
      this.savedPositions.toString().replace(/(\d{14}),([^,]*)/g, '$1;$2')
    );
  }

  sortPredicate(index: number, item: CdkDrag<string>) {
    console.log(index, item.data);
    return (index + 1) % 2 !== parseInt(item.data[0][0]) % 2;
  }

  setDataList(): void {
    this.monitoringService
      .updateList(this.updateList)
      .then(() => {
        console.log('valor alterado', this.updateList);
      })
      .catch((error) => {
        console.error('Erro ao modificar o valor:', error);
      });
  }

  setRestartTrue(): void {
    this.restart = !this.restart;
    this.monitoringService
      .updateRestart(this.restart)
      .then(() => {
        console.log('valor alterado', this.restart);
      })
      .catch((error) => {
        console.error('Erro ao modificar o valor:', error);
      });
    this.restart = false;
  }

  async showLog(): Promise<void> {
    const endpoints = ['title', 'status', 'dateHourProcess', 'logs'];

    for (let endpoint of endpoints) {
      const dataTeste = await this.monitoringService.getLogDataTest(
        this.dataSource?.clientInProcess,
        this.dataSource?.databaseInProcess,
        endpoint
      );
      // console.log(endpoint, dataTeste);
      switch (endpoint) {
        case 'title':
          this.vTitle = dataTeste.toString();
          break;
        case 'status':
          this.vStatus = dataTeste.toString();
          break;
        case 'dateHourProcess':
          this.vData = dataTeste.toString();
          break;
        case 'logs':
          this.vLog = dataTeste
            .toString()
            .split(
              '//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////'
            );
          break;
      }
    }
  }

  splitHtmlString(): void {
    const regex = /<br\/><br\/>/g;
    this.titleParts = this.vTitle.split(regex);
  }

  async openDialog() {
    const dialogRef = this.dialog.open(SnTestLogComponent, {
      width: '50rem',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }

  async openDialogClientes() {
    const dialogRef = this.dialog.open(SnTestListComponent, {
      width: '45rem',
      height: '55rem',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }

  openSnackBar(message: any, action: any) {
    this.snackbar.open(message, action);
  }
}