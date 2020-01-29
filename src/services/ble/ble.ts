import { Injectable, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
@Injectable()
export class BleService {
    devices:any[] = [];
    peripheral: any = {};
    globalData = '55';
    service_uuid = '0000180F-0000-1000-8000-00805f9b34fb';
    characteristic_uuid = '00002A19-0000-1000-8000-00805f9b34fb';

    constructor(private ble:BLE,private ngZone: NgZone) {}

    getDevices(){
        this.devices = [];
        this.ble.scan([],10).subscribe(
        device => this.onDeviceDiscovered(device)
        );
        return this.devices;
    }
    onDeviceDiscovered(device){
      console.log('Discovered' + JSON.stringify(device,null,2));
      this.ngZone.run(()=>{
        this.devices.push(device)
        console.log(device)
      })
    }

    connect(id,cb){
      this.ble.connect(id).subscribe(
        peripheral => this.onConnect(peripheral,cb),
          peripheral => this.onDisconnect()
      );
    }
 
    onDisconnect(){
      alert('Disconnected');
    }

    onConnect(peripheral,cb){
      this.peripheral = peripheral;
      alert('Connected to ' + (peripheral.name || peripheral.id))
        // Subscribe for notifications when the data changes
    this.ble.startNotification(this.peripheral.id, this.service_uuid, this.characteristic_uuid).subscribe(
      data => this.onChange(data,cb),
      () => alert('Unexpected Error, '+ 'Failed to subscribe for data changes')
    )

    // Read the current value of the data characteristic
    this.ble.read(this.peripheral.id, this.service_uuid, this.characteristic_uuid).then(
      data => this.onChange(data,cb),
      () => alert('Unexpected Error, '+ 'Failed to get dat')
    )
    }    

    getCurrent(){
      
      return this.globalData;
    }

    onChange(buffer:ArrayBuffer,cb){
      var data = new Uint8Array(buffer);
      this.ngZone.run(() => {
      alert(data[0]);
      this.globalData = data[0];
      cb();
    });
    
    }

    writeToPeripheral(id,writeData:ArrayBuffer){
        this.ble.write(id, this.service_uuid, this.characteristic_uuid, writeData).then(
        () => alert('succesful write'),
        () => alert('write unsuccessful')
          );
    }
}