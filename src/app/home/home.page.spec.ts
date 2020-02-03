import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { BleService } from '../../services/ble/ble';
import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let bleServiceSpy;

  beforeEach(async(() => {
    bleServiceSpy = jasmine.createSpyObj('bleService', {connect: null})
    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      providers:[
        {provide: BleService, useValue:bleServiceSpy}
      ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
