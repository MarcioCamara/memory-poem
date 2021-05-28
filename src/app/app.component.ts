import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  ip: number = -1;
  existingIps: any = undefined;
  doesCurrentIpExist = false;
  isLoading = true;

  constructor(
    private http: HttpClient,
  ) { }

  checkExistingIp() {
    this.http.get('https://api.ipfind.com/me?auth=932f5ed8-bb64-4ddd-87cf-19b474195a82').subscribe((response: any): void => {
      this.ip = response.ip_address;

      this.existingIps = Object.values(this.existingIps);
      this.doesCurrentIpExist = (this.existingIps.filter((ip: any) => ip.address === this.ip)).length > 0;

      this.isLoading = false;

      if (this.doesCurrentIpExist) {
        return;
      } else {
        this.saveClientIp();
      }
    });
  }

  ngOnInit() {
    this.http.get('https://memory-poem-default-rtdb.firebaseio.com/ips.json').subscribe((response: any): void => {
      this.existingIps = response;

      this.checkExistingIp();
    });
  }

  saveClientIp() {
    const ip = {
      address: this.ip,
    };

    this.http.post('https://memory-poem-default-rtdb.firebaseio.com/ips.json', ip).subscribe((response: any): void => {
      console.log(response);
    });
  }
}
