(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["home-home-module"],{

/***/ "./node_modules/raw-loader/index.js!./src/app/home/home.page.html":
/*!***************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/home/home.page.html ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ion-header>\n  <ion-toolbar>\n    <ion-title>\n      BLE Spike\n    </ion-title>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content>\n  <div class=\"ion-padding\">\n    <p>Current data being received: {{globalData}}</p>\n    <ion-button (click)='writeIt()'>Write Data</ion-button>\n    <ion-button (click)='scan()'>Scan</ion-button>\n  </div>\n  <ion-list>\n    <ion-card-content ion-item *ngFor=\"let device of devices\">\n      <p>{{device.name || 'Unnamed'}}</p>\n      <p>{{device.id}}</p>\n      <p> RSSI: {{device.rssi}}</p>\n      <p><ion-button (click)='connect(device.id)'>Connect</ion-button></p>\n    </ion-card-content>\n  </ion-list>\n</ion-content>\n"

/***/ }),

/***/ "./src/app/home/home.module.ts":
/*!*************************************!*\
  !*** ./src/app/home/home.module.ts ***!
  \*************************************/
/*! exports provided: HomePageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomePageModule", function() { return HomePageModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _home_page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./home.page */ "./src/app/home/home.page.ts");







let HomePageModule = class HomePageModule {
};
HomePageModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_3__["IonicModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterModule"].forChild([
                {
                    path: '',
                    component: _home_page__WEBPACK_IMPORTED_MODULE_6__["HomePage"]
                }
            ])
        ],
        declarations: [_home_page__WEBPACK_IMPORTED_MODULE_6__["HomePage"]]
    })
], HomePageModule);



/***/ }),

/***/ "./src/app/home/home.page.scss":
/*!*************************************!*\
  !*** ./src/app/home/home.page.scss ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2hvbWUvaG9tZS5wYWdlLnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/home/home.page.ts":
/*!***********************************!*\
  !*** ./src/app/home/home.page.ts ***!
  \***********************************/
/*! exports provided: HomePage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomePage", function() { return HomePage; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _ionic_native_ble_ngx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ionic-native/ble/ngx */ "./node_modules/@ionic-native/ble/ngx/index.js");



let HomePage = class HomePage {
    constructor(ble, ngZone) {
        this.ble = ble;
        this.ngZone = ngZone;
        //for BLE peripheral sim
        //Battery Characteristic: 00002A19-0000-1000-8000-00805f9b34fb
        //Battery Service UUID: 0000180F-0000-1000-8000-00805f9b34fb
        this.service_uuid = '180f';
        this.characteristic_uuid = '2a19';
        this.devices = [];
        this.peripheral = {};
    }
    scan() {
        this.devices = [];
        this.ble.scan([], 10).subscribe(device => this.onDeviceDiscovered(device));
    }
    onDeviceDiscovered(device) {
        console.log('Discovered' + JSON.stringify(device, null, 2));
        this.ngZone.run(() => {
            this.devices.push(device);
            console.log(device);
        });
    }
    connect(id) {
        this.ble.connect(id).subscribe(peripheral => this.onConnected(peripheral), peripheral => this.onDisconnect());
    }
    //sudo ionic cordova run android --device
    //phone passwords 2323
    //https://github.com/don/ionic-ble-examples/blob/d0acd2b47ea08011be4d1aa844c4f74426a22273/thermometer/src/pages/detail/detail.ts#L37-L55
    onConnected(peripheral) {
        this.peripheral = peripheral;
        alert('Connected to ' + (peripheral.name || peripheral.id));
        this.currentBleId = peripheral.id;
        // Subscribe for notifications when the temperature changes
        this.ble.startNotification(this.peripheral.id, this.service_uuid, this.characteristic_uuid).subscribe(data => this.onChange(data), () => alert('Unexpected Error, ' + 'Failed to subscribe for data changes'));
        // Read the current value of the temperature characteristic
        this.ble.read(this.peripheral.id, this.service_uuid, this.characteristic_uuid).then(data => this.onChange(data), () => alert('Unexpected Error, ' + 'Failed to get dat'));
    }
    onChange(buffer) {
        // Data is a 4 byte floating point value
        var data = new Uint8Array(buffer);
        //this.globalData = data;
        //alert("data received: " + this.globalData);
        this.ngZone.run(() => {
            this.globalData = data[0];
            alert("data received: " + this.globalData);
        });
    }
    onDisconnect() {
        alert('Disconnected');
    }
    writeIt() {
        var data = new Uint8Array(1);
        data[0] = 1;
        this.ble.write(this.currentBleId, this.service_uuid, this.characteristic_uuid, data.buffer);
    }
};
HomePage.ctorParameters = () => [
    { type: _ionic_native_ble_ngx__WEBPACK_IMPORTED_MODULE_2__["BLE"] },
    { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"] }
];
HomePage = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-home',
        template: __webpack_require__(/*! raw-loader!./home.page.html */ "./node_modules/raw-loader/index.js!./src/app/home/home.page.html"),
        styles: [__webpack_require__(/*! ./home.page.scss */ "./src/app/home/home.page.scss")]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ionic_native_ble_ngx__WEBPACK_IMPORTED_MODULE_2__["BLE"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"]])
], HomePage);



/***/ })

}]);
//# sourceMappingURL=home-home-module-es2015.js.map