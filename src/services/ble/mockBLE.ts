import { Injectable } from '@angular/core';
import { of , Observable } from "rxjs"
var device_data = {
    "name": "Battery Demo",
    "id": "20:FF:D0:FF:D1:C0",
    "advertising": [2,1,6,3,3,15,24,8,9,66,97,116,116,101,114,121],
    "rssi": -55,
    "services": [
        "1800",
        "1801",
        "180f"
    ],
    "characteristics": [
        {
            "service": "1800",
            "characteristic": "2a00",
            "properties": [
                "Read"
            ]
        },
        {
            "service": "1800",
            "characteristic": "2a01",
            "properties": [
                "Read"
            ]
        },
        {
            "service": "1801",
            "characteristic": "2a05",
            "properties": [
                "Read"
            ]
        },
        {
            "service": "180f",
            "characteristic": "2a19",
            "properties": [
                "Read"
            ],
            "descriptors": [
                {
                    "uuid": "2901"
                },
                {
                    "uuid": "2904"
                }
            ]
        }
    ]
  }
@Injectable()
export class mockBLE {
  

    constructor() {}
    scan(array,time){
      let data = {
        "name": "Battery Demo",
        "id": "20:FF:D0:FF:D1:C0",
        "advertising": [2,1,6,3,3,15,24,8,9,66,97,116,116,101,114,121],
        "rssi": -55
    }
      return of(data)
    }
    write(device_id, service_uuid, characteristic_uuid, writeData):Promise<any>{
      return new Promise((resolve, reject) => {
          resolve();
      });
    }
    startNotification(device_id,service_uuid, characteristic_uuid){
    var data = new Uint8Array(1);
    data[0] = 1;
    let formattedData = data.buffer;
    return of(formattedData);
    }
    read(device_id, service_uuid, characteristic_uuid){
    var data = new Uint8Array(1);
    data[0] = 1;
    let formattedData:ArrayBuffer = new ArrayBuffer(2);
    return new Promise<ArrayBuffer>((resolve, reject) => {
      resolve(formattedData);
    });
    }
    connect(device_id:any):Observable<any> {
        console.log("mock connect called");
    return of(device_data);
  }
  
startScan(){}
startScanWithOptions(){}
stopScan(){}
autoConnect(){}
disconnect(){}
requestMtu(){}
writeWithoutResponse(){}
stopNotification(){}
isEnabled(){}
isLocationEnabled(){}
isConnected(){}
startStateNotifications(){}
stopStateNotifications(){}
showBluetoothSettings(){}
enable(){}
readRSSI(){}
connectedPeripheralsWithServices(){}
peripheralsWithIdentifiers(){}
bondedDevices(){}
refreshDeviceCache(){}
  }
