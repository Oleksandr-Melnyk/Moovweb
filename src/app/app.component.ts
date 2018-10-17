import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpCallService } from './services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  zipForm: FormGroup;
  responseData: Array<any> = [];
  storedPlaces: Array<any> = [];
  preValue: number;
  activeZip: number;
  constructor(
    private fb: FormBuilder,
    private callService: HttpCallService,
    ) {}

  ngOnInit() {
    this.zipForm = this.fb.group({
      zip: [null, [Validators.required]]
    });
  }

  onSubmit() {
    const zipcode = this.zipForm.value.zip;
    if (this.preValue !== zipcode) {
      this.responseData = [];
      if (this.checkPostCodeNotIncluded(zipcode)) {
        this.callService.call('GET', zipcode).subscribe(data => {
          this.responseData.push(data);
          this.preValue = zipcode;
          this.zipForm.reset();
        });
      }
    }
  }

  saveToStorage(storedPlace) {
    if (this.checkPostCodeNotIncluded(storedPlace['post code'])) {
      this.storedPlaces.push(storedPlace);
    }
  }

  checkPostCodeNotIncluded(postCode: number) {
    return this.storedPlaces.findIndex(place => place['post code'] === postCode) === -1;
  }

  toggleZip(storedPlace) {
    if (storedPlace['post code'] !== this.activeZip) {
      this.activeZip = storedPlace['post code'];
      this.zipForm.get('zip').setValue(storedPlace['post code']);
    } else {
      this.activeZip = null;
      this.zipForm.get('zip').setValue(null);
    }
  }
}
