import { Component, NgZone} from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { BleService } from '../../services/ble/ble';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  htmlData:number;
  currentBleId;
  
  devices:any[] = [];
  constructor(private ngZone: NgZone,public bleService: BleService){} 
  
  scan(){
    this.devices = this.bleService.getDevices();
  }
  connect(id){
    this.bleService.connect(id,this.bleService.notified)
    this.currentBleId = id;
  }    
  displayData(){
    this.htmlData = this.bleService.getCurrent();
  }
  write(){
  var data = new Uint8Array(1);
  data[0] = 1;
  let formattedData = data.buffer;
  this.bleService.writeToPeripheral(this.currentBleId,formattedData)
  }
  }
