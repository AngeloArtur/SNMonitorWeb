import { Component, OnInit } from '@angular/core';
import { MonitoringService } from '../../../service/monitoring.service';
import { CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../service/auth.service';
import { TableData } from '../../../interfaces/TableData.interface';

@Component({
  selector: 'app-sn-test-list',
  templateUrl: './sn-test-list.component.html',
  styleUrl: './sn-test-list.component.css',
})

export class SnTestListComponent implements OnInit {
  dataSource: TableData[] = [];
  arraySupermercados: string[] = [];
  updateList: string = '';
  savedPositions: string[] = [];
  user: any;
  
  constructor(
    private monitoringService: MonitoringService,
    public dialog: MatDialog,
    public auth: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.getData();
    this.user = this.auth.UserAuth();
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

        this.dataSource = [tableData];
      } else {
        console.error('Dados do Firebase não disponíveis.');
      }
    } catch (error) {
      console.error('Erro ao obter dados do Firebase:', error);
    }
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
}
