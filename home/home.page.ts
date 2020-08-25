import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { environment } from 'src/environments/environment';
import { PrintService } from '../services/print.service';

import PrintPDF from 'cordova-plugin-print-pdf/www/PrintPDF';
import { constBase64 } from 'src/environments/constBase64';


declare var cordova: any;    // global;
declare var window: any;    // global;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  urlApi: string = environment.urlApi;

  facturas: any[];
  mensajes: string[] = [];

  bluetoothList: any = [];
  selectedPrinter: any;

  constructor(
    private apiService: ApiService,
    private printer: Printer,
    private print: PrintService
  ) { }

  ngOnInit() {
    this.cargarFacturas();
    this.listPrinter();
  }

  cargarFacturas() {
    this.apiService.peticionGet('factura-siigo')
      .subscribe(
        (data: any) => {
          console.log({ data });
          this.facturas = data.facturas;
        },
        (error: any) => {
          console.log({ error });
        },
        () => {
          console.log('Finaliza función cargarFacturas');
        },
      );
  }

  imprimir(comprobante) {
    if (!comprobante) {
      comprobante = 'hola';
    }
    // this.printer.isAvailable().then(onSuccess, onError);
    this.printer.isAvailable().then(
      (respuesta) => {
        this.mensajes.push(`OK isAvailable ${comprobante}`);
      }, (error) => {
        this.mensajes.push(`Error isAvailable ${comprobante}`);
      }
    );

    const options: PrintOptions = {
      name: 'MyDocument',
      duplex: true,
      orientation: 'landscape',
      monochrome: true
    };

    let content = `${this.urlApi}facturas_siigo/${comprobante}.pdf`;

    if (comprobante === 'hola') {
      content = constBase64.ticketBase64;
    } else if (comprobante === 'drive') {
      content = 'https://si.ua.es/es/documentos/documentacion/pdf-s/mozilla12-pdf.pdf';
    } else if (comprobante === 'funcion') {
      content = 'http://localhost:3001/factura-siigo-pdf/PC2-36.pdf';
    }

    this.mensajes.push(content);

    this.printer.print(content, options).then(
      (respuesta) => {
        this.mensajes.push('OK print');
      }, (error) => {
        this.mensajes.push('Error print');
      }
    );
  }

  // This will list all of your bluetooth devices
  listPrinter() {
    this.print.searchBluetoothPrinter()
      .then(resp => {

        // List of bluetooth device list
        this.bluetoothList = resp;
      });
  }

  // This will store selected bluetooth device mac address
  selectPrinter(macAddress) {
    // Selected printer macAddress stored here
    this.selectedPrinter = macAddress;
  }

  // This will print
  printStuff() {
    // The text that you want to print
    const myText = 'HOLA TODITOS\nBIENVENIDOS\n\n\n';
    this.print.sendToBluetoothPrinter(this.selectedPrinter, myText);
    this.mensajes.push('OK imprimir texto');
  }

  imprimirbase64() {
    let data = constBase64.ticketBase64;
    this.mensajes.push('Inicia Función imprimir base64');


    (<any>window).plugins.PrintPDF.print({
      data,
      type: 'File',
      title: 'Print Document',
      success: function () {
        console.log('success');
        this.mensajes.push('OK imprimirPDF');
      },
      error: function (data) {
        console.log('failed: ' + data);
        this.mensajes.push('ERROR imprimirPDF');
      }
    });
  }

  imprimirArchivo() {
    this.mensajes.push('Inicia Función imprimir imprimirArchivo');

    (<any>window).plugins.PrintPDF.print({
      data: '../../assets/HOLA.pdf',
      type: 'File',
      title: 'Print Document',
      success: function () {
        console.log('success');
        this.mensajes.push('OK imprimirPDF');
      },
      error: function (data) {
        console.log('failed: ' + data);
        this.mensajes.push('ERROR imprimirPDF');
      }
    });
  }

  imprimirArchivoOnline() {
    this.mensajes.push('Inicia Función imprimir imprimirArchivoOnline');

    (<any>window).plugins.PrintPDF.print({
      
      data: 'https://si.ua.es/es/documentos/documentacion/pdf-s/mozilla12-pdf.pdf',
      type: 'File',
      title: 'Print Document',
      success: function () {
        console.log('success');
        this.mensajes.push('OK imprimirPDF');
      },
      error: function (data) {
        console.log('failed: ' + data);
        this.mensajes.push('ERROR imprimirPDF');
      }
    });
  }
  
  imprimirArchivoServidor() {
    this.mensajes.push('Inicia Función imprimir imprimirArchivoServidor');

    (<any>window).plugins.PrintPDF.print({
      data: 'http://localhost:3001/factura-siigo-pdf/PC2-36.pdf',
      type: 'File',
      title: 'Print Document',
      success: function () {
        console.log('success');
        // this.mensajes.push('OK imprimirPDF');
      },
      error: function (data) {
        console.log('failed: ' + data);
        // this.mensajes.push('ERROR imprimirPDF');
      }
    });
  }

  verificar() {
    this.mensajes.push('Función verificar');
    (<any>window).plugins.PrintPDF.isPrintingAvailable((isAvailable) => {
      this.mensajes.push('printing is available: '+ isAvailable);
    });
  }

}
