import { Injectable, NgZone,Component } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BleService } from './ble';
import { mockBLE } from './mockBLE';
import { toBase64String } from '@angular/compiler/src/output/source_map';



describe('BleService', () => {
  let service: BleService;
  let api: mockBLE;
  let ngZone: NgZone;
  let id = '12:34:56:78:9A:BC';
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [BleService, mockBLE] }),
    api = TestBed.get(mockBLE),  
    service = TestBed.get(BleService);
   });

  it('connect should call API connect', () => {
    const apiSpy = spyOn(api, 'connect').and.callThrough();
    const bleSpy = spyOn(service, 'connect').and.callThrough();
    service.connect(id,service.notified);
    expect(apiSpy).toHaveBeenCalled(); 
    expect(bleSpy).toHaveBeenCalled();
  });
  it('connect should call notified', () => {
    const bleSpy = spyOn(service, 'connect').and.callThrough();
    service.connect(id,service.notified);
    expect(bleSpy).toHaveBeenCalled();
  });
  it('connect should call onChange', () => {
    const bleSpy = spyOn(service, 'onChange').and.callThrough();
    service.connect(id,service.notified);
    expect(bleSpy).toHaveBeenCalled();
  });
  it('connect should call API read', () => {
    const apiSpy = spyOn(api, 'read').and.callThrough();
    const bleSpy = spyOn(service, 'connect').and.callThrough();
    service.connect(id,service.notified);
    expect(apiSpy).toHaveBeenCalled(); 
    expect(bleSpy).toHaveBeenCalled();
  });
  it('connect should call API startNotification', () => {
    const apiSpy = spyOn(api, 'startNotification').and.callThrough();
    const bleSpy = spyOn(service, 'connect').and.callThrough();
    service.connect(id,service.notified);
    expect(apiSpy).toHaveBeenCalled(); 
    expect(bleSpy).toHaveBeenCalled();
  });
  it('writeToPeripheral should call API write', () => {
    const apiSpy = spyOn(api, 'write').and.callThrough();
    const bleSpy = spyOn(service, 'writeToPeripheral').and.callThrough();
    var data = new Uint8Array(1);
    data[0] = 1;
    let writeData = data.buffer;
    service.writeToPeripheral(id,writeData);
    expect(apiSpy).toHaveBeenCalled(); 
    expect(bleSpy).toHaveBeenCalled();
  });
  it('getDevices should call API scan', () => {
    const apiSpy = spyOn(api, 'scan').and.callThrough();
    const bleSpy = spyOn(service, 'getDevices').and.callThrough();
    service.getDevices();
    expect(apiSpy).toHaveBeenCalled(); 
    expect(bleSpy).toHaveBeenCalled();
  });
  it('getDevices should call onDeviceDiscovered and populate devices array', () => {
    const bleSpy = spyOn(service, 'onDeviceDiscovered').and.callThrough();
    service.getDevices();
    expect(bleSpy).toHaveBeenCalled();
    expect(service.devices[0].name).toBe("Battery Demo")
  });
});



//https://angular.io/guide/testing // create mock class and function 
