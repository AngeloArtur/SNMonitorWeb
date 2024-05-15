import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { formatDate } from '@angular/common';
import { Infor, InforLog } from '../interfaces/Infor.interface';
import { Register } from '../interfaces/Register.interface';
import { Token } from '../interfaces/DropBoxEntry.interface';
import { GetLog, TestData, logMonitoring } from '../interfaces/LogMonitoring.interface';

@Injectable({
  providedIn: 'root',
})

export class MonitoringService {
  constructor(private db: AngularFireDatabase) {}

  getDataLincese(): Observable<any[]> {
    const licenseRef: AngularFireList<any> = this.db.list('/license');
    return licenseRef.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((c) => {
          const key: string = c.payload.key as string;
          const data: any = c.payload.val();
          return { key, ...data };
        });
      })
    );
  }

  async getDataInformation(key: string): Promise<Infor | null> {
    const snapshot = await this.db.database
      .ref(`/information/${key}`)
      .orderByKey()
      .once('value');

    // Check if the snapshot exists and has a value
    if (snapshot.exists() && snapshot.val() !== null) {
      return snapshot.val();
    } else {
      return null; // Handle the case where the data is not available
    }
  }

  async getDataInformationLog(key: string): Promise<InforLog | null> {
    const snapshot = await this.db.database
      .ref(`/information/${key}/statusApp`)
      .orderByKey()
      .once('value');

    // Check if the snapshot exists and has a value
    if (snapshot.exists() && snapshot.val() !== null) {
      return snapshot.val();
    } else {
      return null; // Handle the case where the data is not available
    }
  }

  updateStatusApp(
    key: string,
    date: string,
    description: string
  ): Promise<void> {
    return this.db.database.ref(`/information/${key}/statusApp/${date}`).set({
      description,
    });
  }

  async getDataRegister(key: string): Promise<Register> {
    return (
      await this.db.database.ref(`/license/${key}`).orderByKey().once('value')
    ).val();
  }

  async getDatatoken(): Promise<Token> {
    return (
      await this.db.database
        .ref(`/authorizationDropbox`)
        .orderByKey()
        .once('value')
    ).val();
  }

  updateRegister(key: string, data: Register): Promise<void> {
    const {
      razaoSocial,
      status,
      email,
      responsavel,
      telefone,
      acesso,
      senha,
      qtdLoja,
      estado,
      so,
      observacao,
      config,
      expirationDate,
    } = data;
    return this.db.database.ref(`/license/${key}`).set({
      razaoSocial,
      status,
      email,
      responsavel,
      telefone,
      acesso,
      senha,
      qtdLoja,
      estado,
      so,
      observacao,
      config,
      expirationDate,
    });
  }

  updateToken(data: Token): Promise<void> {
    const {
      clientId,
      clientSecret,
      refreshToken,
      tokenEndpoint,
      remetente,
      passwordRemetente,
      destinatarios,
      destinatariosCopy,
      expirationDate,
      tokenBrevo,
      validationHours,
    } = data;
    return this.db.database.ref(`/authorizationDropbox`).set({
      clientId,
      clientSecret,
      refreshToken,
      tokenEndpoint,
      remetente,
      passwordRemetente,
      destinatarios,
      destinatariosCopy,
      expirationDate,
      tokenBrevo,
      validationHours,
    });
  }

  logMonitoring(data: logMonitoring): Promise<void> {
    const {
      key,
      situation,
      situationPrevious,
      movementdate,
      date,
      dateCurrent,
      namefile,
      sizefile,
      percentage,
      dataBase,
    } = data;
    return this.db.database
      .ref(`/logMonitoring/${date}/${key}/${movementdate}/${dataBase}`)
      .set({
        situation,
        situationPrevious,
        dateCurrent,
        namefile,
        sizefile,
        percentage,
      });
  }

  async getLog(key: string): Promise<GetLog> {
    const today = new Date();
    return (
      await this.db.database
        .ref(
          `/logMonitoring/${formatDate(today, 'yyyy-MM-dd', 'en-US')}/${key}`
        )
        .orderByKey()
        .once('value')
    ).val();
  }

  async getTestData(): Promise<TestData | null> {
    try {
      const snapshot = await this.db.database.ref('/test').once('value');

      if (snapshot.exists() && snapshot.val() !== null) {
        return snapshot.val() as TestData;
      } else {
        return null; // Tratar o caso em que os dados não estão disponíveis
      }
    } catch (error) {
      console.error('Erro ao obter dados de teste:', error);
      return null;
    }
  }

  async getLogDataTest(
    cnpj: string,
    banco: string,
    endpoint: string
  ): Promise<any> {
    try {
      const snapshot = await this.db.database
        .ref(`/test/log/${cnpj}/${banco}/${endpoint}`)
        .once('value');
      console.log('snapshot', snapshot);

      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.error(`Nenhum dado encontrado para o endpoint ${endpoint}.`);
        return null;
      }
    } catch (error) {
      console.error('Erro ao obter dados do Firebase:', error);
      return null;
    }
  }

  updateRefresh(refresh: boolean): Promise<void> {
    return this.db.database.ref(`test/settings/refresh`).set(refresh);
  }

  updateList(list: string): Promise<void> {
    return this.db.database.ref(`test/list`).set(list);
  }

  updateRestart(restart: boolean): Promise<void> {
    return this.db.database.ref('test/settings/restartApp').set(restart);
  }

  updateMaxAttempts(attemps: number) {
    return this.db.database
      .ref('test/settings/numberTentativaMax')
      .set(attemps);
  }
  
  updateLastLines(lines: number) {
    return this.db.database
      .ref('test/settings/numberlastFiveLines')
      .set(lines);
  }
}
