import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { SafariViewController } from '@ionic-native/safari-view-controller';
import { Http, Headers } from '@angular/http';//, Response, RequestOptions
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  bro_open = "";
  bro_loaded = "";
  bro_close = "";
  payURL='http://154.16.249.162/instamojo/app.php';
  constructor(public navCtrl: NavController, private safariViewController: SafariViewController,private http: Http, private platform: Platform) { }
  check_payment_status(pay_id)
  {
    let payment_status_url = this.payURL+"?request=app&pay_id="+pay_id;
    //alert("check finel status"+pay_id);
    this.get_http(payment_status_url).subscribe(
      data=>
      {
        if(data.payment_status == "success")
          {
            alert("your payment is successful");
          }
          else
            {
              alert("your payment is failed");
            }
      },
      err =>
      {
        alert("Service calling failed");
      }
    );
  }
  call_browser_for_payment(pay_id: String)
  {
    this.safariViewController.isAvailable()
    .then((available: boolean) => {
        if (available) {
  
          this.safariViewController.show({
            url: this.payURL+"?request=app&"+pay_id,
            hidden: false,
            animated: false,
            transition: 'curl',
            enterReaderModeIfAvailable: true,
            tintColor: '#ff0000'
          })
          .subscribe((result: any) => {
              if(result.event === 'opened') 
                {
                  console.log('Opened');
                  this.bro_open = "Browser open";
                }
              else if(result.event === 'loaded')
                {
                  console.log('Loaded');
                  this.bro_loaded = "Browser Loadd";
                } 
              else if(result.event === 'closed')
                {
                  console.log('Closed');
                  this.bro_close = "browser close";
                  this.check_payment_status(pay_id);
                }
            },
            (error: any) => console.error(error)
          );       
        } else {
          // use fallback browser, example InAppBrowser
        }
      }
    );
  }
  get_http(url)
  {
    return this.http.get(url)
    .map(res => res.json())
  }
  openweb(amount, name, email, phone)
  {
    if(amount != "" && name != "" && email != "" && phone != "")
      {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin','*');
        let payment_url: any = this.payURL+"?request=app&amount="+amount+"&buyer_name="+name+"&email="+email+"&phone="+phone;
        this.get_http(payment_url).subscribe(
          data =>
          {
            //this.call_browser_for_payment("test");
            //alert("Service read status"+data.status);
            if(this.platform.is('core') || this.platform.is('mobileweb')) {
              alert("Payment not allowed in browser");
            } else {
              if(data.status == "success")
                {
                  this.call_browser_for_payment(data.payment_request_id);
                }
              else
                {
                    alert("Payment is not initialized here - "+data.data);
                }
            }
          }, 
          err => 
          {
            console.log("data sending failed");
          }
        );  
      }
      else
        {
          alert("all field required");
        }
    }
  }

  /*
req url - http://154.16.249.162/instamojo/app.php?request=app&amount=10&buyer_name=Srajit sadhukhan&email=surajit1992@live.com&phone=9007614040
payment url - http://154.16.249.162/instamojo/app.php?request=app&payment_request_id=<id>
status_url - http://154.16.249.162/instamojo/app.php?request=app&pay_id=55a2bbd8e3ce442ab392b8e199369c7e
  */