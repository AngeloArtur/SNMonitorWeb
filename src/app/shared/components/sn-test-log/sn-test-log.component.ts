import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MonitoringService } from '../../../service/monitoring.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableData } from '../../../interfaces/TableData.interface';
import { TableDataLog } from '../../../interfaces/TableDataLog.interface';

@Component({
  selector: 'app-sn-test-log',
  templateUrl: './sn-test-log.component.html',
  styleUrls: ['./sn-test-log.component.css'],
})

export class SnTestLogComponent implements OnInit {
  logData: TableDataLog | null = null;
  myForm: FormGroup = this.fb.group({
    numberField: ['', [Validators.required, Validators.min(1)]],
    numberField1: ['', [Validators.required, Validators.min(1)]],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TableData,
    private monitoringService: MonitoringService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  setData(numberValue: number, numberValue1: number) {
    if (this.myForm.valid) {
      this.monitoringService
        .updateMaxAttempts(numberValue)
        .then(() => {
          console.log('Alterações salvas com sucesso');
        })
        .catch((error) => {
          console.error('Erro ao salvar alterações:', error);
        });
      this.monitoringService
        .updateLastLines(numberValue1)
        .then(() => {
          console.log('Alterações salvas com sucesso');
        })
        .catch((error) => {
          console.error('Erro ao salvar alterações:', error);
        });
    } else {
      console.log('Formulário inválido');
    }
  }

  submitInformations() {
    const numberValue = this.myForm.get('numberField')?.value;
    const numberValue1 = this.myForm.get('numberField1')?.value;
    if (this.myForm.valid) {
      this.setData(numberValue, numberValue1);
      console.log('Number Value:', numberValue);
      console.log('Number Value:', numberValue1);
    } else {
      console.log('Form not valid', numberValue);
    }
  }
  get numberField() {
    return this.myForm.get('numberField');
  }

  get numberField1() {
    return this.myForm.get('numberField1');
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

        const tableData: TableDataLog = {
          clientInProcess: data.settings?.clientInProcess,
          numberTentativaMax: data.settings?.numberTentativaMax,
          numberlastFiveLines: data.settings?.numberlastFiveLines,
        };

        this.logData = tableData;

        // Atualize o formulário com os dados recuperados
        this.myForm.patchValue({
          numberField: this.logData.numberTentativaMax,
          numberField1: this.logData.numberlastFiveLines,
        });
      } else {
        console.error('Dados do Firebase não disponíveis.');
      }
    } catch (error) {
      console.error('Erro ao obter dados do Firebase:', error);
    }
  }
}