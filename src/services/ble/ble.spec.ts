import { Injectable, NgZone,Component } from '@angular/core/';
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
    spyOn(window, 'alert');
    bleSpy = jasmine.createSpyObj('ble', {
      connect: of(device_data),
      scan: of(data),
      write: Promise.resolve(),
      startNotification: of(formattedData),
      read: Promise.resolve(formattedData)

    })
    ngZone = new NgZone({enableLongStackTrace: true});
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

  it('onConnect should call this.read()', () => {
    const onConnectSpy = spyOn(service, 'read');
    service.onConnect(device_data,service.notified);
    expect(onConnectSpy).toHaveBeenCalled();
  });

  it('this.read() should call API read, call this.startNotification() and this.onChange()', async () => {
    const startNotificationSpy = spyOn(service, 'startNotification');
    const onChangeSpy = spyOn(service, 'onChange');
    await service.read(id, device_data.characteristics[0].service, device_data.characteristics[0].characteristic, service.notified);
    expect(startNotificationSpy).toHaveBeenCalled();
    expect(onChangeSpy).toHaveBeenCalled();
    expect(bleSpy.read).toHaveBeenCalled();
  });
  it('this.read() should notify of read error', async () => {
    service.ble.read = jasmine.createSpy().and.returnValue(Promise.reject('error'));
    await service.read(id, device_data.characteristics[0].service, device_data.characteristics[0].characteristic, service.notified);
    expect(window.alert).toHaveBeenCalledWith('Unexpected Error, Failed to read');
    expect(bleSpy.read).toHaveBeenCalled();
  });

  it('this.startNotification() should call api startNotification() and this.onChange()', async () => {
    const onChangeSpy = spyOn(service, 'onChange');
    await service.startNotification(id, device_data.characteristics[0].service, device_data.characteristics[0].characteristic, service.notified);
    expect(onChangeSpy).toHaveBeenCalled();
  });
  it('this.startNotification() should call api startNotification() and notify of error', async () => {
    service.ble.startNotification = jasmine.createSpy().and.returnValue(throwError('error'));
    await service.startNotification(id, device_data.characteristics[0].service, device_data.characteristics[0].characteristic, service.notified);
    expect(window.alert).toHaveBeenCalledWith('Unexpected Error, Failed to subscribe for data changes');
  });
  
  it('this.onChange should set globalData and call callback function', async () => {
    const notifiedSpy = spyOn(service, 'notified');
    await service.onChange(formattedData, service.notified);
    expect(service.getCurrent()).toBe(1);
    expect(notifiedSpy).toHaveBeenCalled();
  });

  it('writeToPeripheral should call API write with success alert', async () => {
    await service.writeToPeripheral(id,formattedData);
    expect(bleSpy.write).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('succesful write');
  });
  it('writeToPeripheral should call API write with error alert', async () => {
    bleSpy.write = jasmine.createSpy().and.returnValue(Promise.reject());
    await service.writeToPeripheral(id,formattedData);
    expect(service.alertMsg).toBe('write unsuccessful');
  });

  it('getDevices should call API scan and onDeviceDiscovered', () => {
    const onDeviceSpy = spyOn(service, 'onDeviceDiscovered');
    service.getDevices();
    expect(bleSpy.scan).toHaveBeenCalled();
    expect(onDeviceSpy).toHaveBeenCalled();
  });
  it('getDevices should call onDeviceDiscovered and populate devices array', () => {
    const onDeviceSpy = spyOn(service, 'onDeviceDiscovered').and.callThrough();
    service.getDevices();
    expect(onDeviceSpy).toHaveBeenCalled();
    expect(service.devices[0].name).toBe("Battery Demo")
  });

  it('should set and get global data', () => {
    service.setData(5)
    expect(service.getCurrent()).toBe(5);
    
  });
});

