import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserDetails } from '../authentication.service';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.css']
})
export class PhoneComponent implements OnInit {
  details: UserDetails;

  constructor(private auth: AuthenticationService) {}

  ngOnInit() {
    this.auth.phone().subscribe(
      user => {
        this.details = user;
      },
      err => {
        console.error(err);
      }
    );
  }
}
