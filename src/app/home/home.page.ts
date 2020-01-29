import { Component, NgZone} from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  globalData;
  currentBleId;
  
  //**Testing uses two different BT Sim apps */

  //*for BLE peripheral sim* (to test read and notify functionality on battery service)
  //Characteristic UUID: 00002A19-0000-1000-8000-00805f9b34fb
  //Service UUID: 0000180F-0000-1000-8000-00805f9b34fb
  
  
  //*for "BLEperipheralsim"* (to test write functionality)
  // service_UUID: 180f
  //Characteristic_UUID: 2a19

  service_uuid = '180f';
  characteristic_uuid = '2a19';
  devices:any[] = [];
  peripheral: any = {};
  constructor(private ble:BLE,private ngZone: NgZone) 
  {
    
  }
  scan(){
    this.devices = [];
    this.ble.scan([],10).subscribe(
      device => this.onDeviceDiscovered(device)
    );
  }
  onDeviceDiscovered(device){
    console.log('Discovered' + JSON.stringify(device,null,2));
    this.ngZone.run(()=>{
      this.devices.push(device)
      console.log(device)
    })
  }
  
connect(id){
  this.ble.connect(id).subscribe(
    peripheral => this.onConnected(peripheral),
    peripheral => this.onDisconnect()
  );   
}
//sudo ionic cordova run android --device
//phone passwords 2323
//https://github.com/don/ionic-ble-examples/blob/d0acd2b47ea08011be4d1aa844c4f74426a22273/thermometer/src/pages/detail/detail.ts#L37-L55
onConnected(peripheral){
  this.peripheral = peripheral;
    alert('Connected to ' + (peripheral.name || peripheral.id));
    this.currentBleId = peripheral.id;
    // Subscribe for notifications when the temperature changes
    this.ble.startNotification(this.peripheral.id, this.service_uuid, this.characteristic_uuid).subscribe(
      data => this.onChange(data),
      () => alert('Unexpected Error, '+ 'Failed to subscribe for data changes')
    )

    // Read the current value of the temperature characteristic
    this.ble.read(this.peripheral.id, this.service_uuid, this.characteristic_uuid).then(
      data => this.onChange(data),
      () => alert('Unexpected Error, '+ 'Failed to get dat')
    )

}    
onChange(buffer:ArrayBuffer){

// Data is a 4 byte floating point value

var data = new Uint8Array(buffer);
//this.globalData = data;
//alert("data received: " + this.globalData);
this.ngZone.run(() => {
  this.globalData = data[0];
  alert("data received: " + this.globalData);
});
}
onDisconnect(){
  alert('Disconnected');
}
writeIt(){
  var data = new Uint8Array(1);
  data[0] = 1;
  this.ble.write(this.currentBleId, this.service_uuid, this.characteristic_uuid, data.buffer)
}


}
