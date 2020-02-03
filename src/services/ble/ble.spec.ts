import { Injectable, NgZone,Component } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BleService } from './ble';
import { of, throwError } from 'rxjs';




describe('BleService', () => {
  let service: BleService;
  let ngZone: NgZone;
  let id = '12:34:56:78:9A:BC';
  const device_data = {
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
  const data = {
    "name": "Battery Demo",
    "id": "20:FF:D0:FF:D1:C0",
    "advertising": [2,1,6,3,3,15,24,8,9,66,97,116,116,101,114,121],
    "rssi": -55
  }
  const dataInt8 = new Uint8Array(1);
  dataInt8[0] = 1;
  let formattedData = dataInt8.buffer;
  let bleSpy;

  beforeEach(() => {
    bleSpy = jasmine.createSpyObj('ble', {
      connect: of(device_data),
      scan: of(data),
      write: Promise.resolve(),
      startNotification: of(formattedData),
      read: Promise.resolve(formattedData)

    })

    service = new BleService(bleSpy as any, ngZone);
   });


  it('connect should call API connect and onConnect', () => {
    const onConnectSpy = spyOn(service, 'onConnect');
    service.connect(id,service.notified);
    expect(bleSpy.connect).toHaveBeenCalledWith(id);
    expect(onConnectSpy).toHaveBeenCalled();
  });

  it('connect should call API connect and fail', () => {
    const onDisconnectSpy = spyOn(service, 'onDisconnect');
    service.ble.connect = jasmine.createSpy().and.returnValue(throwError('error'));
    service.connect(id,service.notified);
    expect(bleSpy.connect).toHaveBeenCalledWith(id);
    expect(onDisconnectSpy).toHaveBeenCalled();
  });
  it('onConnect should call API startNotification', () => {
    //const onConnectSpy = spyOn(service, 'onConnect');
    service.onConnect(device_data,service.notified);
    //service.connect(id,service.notified);
    expect(bleSpy.startNotification).toHaveBeenCalled();
  });
  it('onConnect should call startNotification and notify of error', () => {
    spyOn(window, 'alert');
    service.ble.startNotification = jasmine.createSpy().and.returnValue(throwError('error'));
    service.onConnect(device_data,service.notified);
    expect(window.alert).toHaveBeenCalledWith('Unexpected Error, Failed to subscribe for data changes');
    expect(bleSpy.startNotification).toHaveBeenCalled();
  });
  it('onConnect should call API read', () => {
    service.onConnect(device_data,service.notified);
    expect(bleSpy.read).toHaveBeenCalled();
  });
  it('onConnect should call read and notify of error', () => {
    spyOn(window, 'alert');
    service.ble.read = jasmine.createSpy().and.returnValue(Promise.reject('error'));
    service.onConnect(device_data,service.notified);
    expect(window.alert).toHaveBeenCalledWith('Unexpected Error, Failed to read');
    expect(bleSpy.read).toHaveBeenCalled();
  });
  // it('connect should call notified', () => {
  //   const bleSpy = spyOn(service, 'connect').and.callThrough();
  //   service.connect(id,service.notified);
  //   expect(bleSpy).toHaveBeenCalled();
  // });
  // it('connect should call onChange', () => {
  //   const bleSpy = spyOn(service, 'onChange').and.callThrough();
  //   service.connect(id,service.notified);
  //   expect(bleSpy).toHaveBeenCalled();
  // });
  // it('connect should call API read', () => {
  //   const apiSpy = spyOn(api, 'read').and.callThrough();
  //   const bleSpy = spyOn(service, 'connect').and.callThrough();
  //   service.connect(id,service.notified);
  //   expect(apiSpy).toHaveBeenCalled(); 
  //   expect(bleSpy).toHaveBeenCalled();
  // });
  // it('connect should call API startNotification', () => {
  //   const apiSpy = spyOn(api, 'startNotification').and.callThrough();
  //   const bleSpy = spyOn(service, 'connect').and.callThrough();
  //   service.connect(id,service.notified);
  //   expect(apiSpy).toHaveBeenCalled(); 
  //   expect(bleSpy).toHaveBeenCalled();
  // });
  // it('writeToPeripheral should call API write', () => {
  //   const apiSpy = spyOn(api, 'write').and.callThrough();
  //   const bleSpy = spyOn(service, 'writeToPeripheral').and.callThrough();
  //   var data = new Uint8Array(1);
  //   data[0] = 1;
  //   let writeData = data.buffer;
  //   service.writeToPeripheral(id,writeData);
  //   expect(apiSpy).toHaveBeenCalled(); 
  //   expect(bleSpy).toHaveBeenCalled();
  // });
  // it('getDevices should call API scan', () => {
  //   const apiSpy = spyOn(api, 'scan').and.callThrough();
  //   const bleSpy = spyOn(service, 'getDevices').and.callThrough();
  //   service.getDevices();
  //   expect(apiSpy).toHaveBeenCalled(); 
  //   expect(bleSpy).toHaveBeenCalled();
  // });
  // it('getDevices should call onDeviceDiscovered and populate devices array', () => {
  //   const bleSpy = spyOn(service, 'onDeviceDiscovered').and.callThrough();
  //   service.getDevices();
  //   expect(bleSpy).toHaveBeenCalled();
  //   expect(service.devices[0].name).toBe("Battery Demo")
  // });
});



//https://angular.io/guide/testing // create mock class and function 
