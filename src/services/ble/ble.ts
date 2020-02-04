import { Injectable, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';

var globalData = 0;
@Injectable()
export class BleService {
  devices: any[] = [];
  peripheral: any = {};
  connectBLE = this.ble.connect;
  service_uuid = '0000180F-0000-1000-8000-00805f9b34fb';
  characteristic_uuid = '00002A19-0000-1000-8000-00805f9b34fb';
  alertMsg: string = 'default alert';
  constructor(public ble: BLE, private ngZone: NgZone) { }


  getDevices() {
    this.devices = [];
    this.ble.scan([], 10).subscribe(
      device => this.onDeviceDiscovered(device)
    );
    return this.devices;
  }
  onDeviceDiscovered(device) {
    console.log('device:' + device[0]);
    console.log('Discovered' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device)
      console.log(device)
    })
  }

  connect(id, cb) {
    console.log(this.ble)
    this.ble.connect(id).subscribe(
      peripheral => this.onConnect(peripheral, cb),
      () => this.onDisconnect()
    );
  }

  onDisconnect() {
    alert('Disconnected');
  }

  onConnect(peripheral, cb) {
    this.peripheral = peripheral;
    this.service_uuid = this.peripheral.characteristics[0].service;
    this.characteristic_uuid = this.peripheral.characteristics[0].characteristic;
    alert('Connected to ' + (peripheral.name || peripheral.id))
    // Subscribe for notifications when the data changes
    this.read(this.peripheral.id, this.service_uuid, this.characteristic_uuid, cb);
  }

  read(id, service_uuid, characteristic_uuid, cb) {
    // Read the current value of the data characteristic
    this.ble.read(id, service_uuid, characteristic_uuid).then(
      data => {
        this.onChange(data, cb);
        this.startNotification(id, service_uuid, characteristic_uuid, cb)
      },
      () => {
        this.alertMsg = 'Unexpected Error, Failed to read';
        alert(this.alertMsg)
      }
    )
  }

  startNotification(id, service_uuid, characteristic_uuid, cb) {
    this.ble.startNotification(id, service_uuid, characteristic_uuid).subscribe(
      data => { this.onChange(data, cb) },
      () => {
        this.alertMsg = 'Unexpected Error, Failed to subscribe for data changes';
        alert(this.alertMsg)
      }
    )
  }

  notified() {
    alert('Notified/Read: ' + globalData);
  }
  getCurrent() {
    return globalData;
  }
  setData(myNumber) {
    globalData = myNumber;
  }
  onChange(buffer: ArrayBuffer, cb) {
    var data = new Uint8Array(buffer);
    this.ngZone.run(() => {
      globalData = data[0];
      cb();
    });

  }

  writeToPeripheral(id, writeData: ArrayBuffer) {
    this.ble.write(id, this.service_uuid, this.characteristic_uuid, writeData).then(
      () => {
        this.alertMsg = 'succesful write';
        alert(this.alertMsg)
      },
      () => {

        this.alertMsg = 'write unsuccessful';
        alert(this.alertMsg)

      }
    );
  }
}