import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CheckinService } from '../services/checkin.service';
import { UserService } from '../services/user.service';
import { map } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';

declare var google: any;
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  map: any;
  infoWindow: any = new google.maps.InfoWindow();
  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;
  getLoc: any;
  userId: string;
  length:any;
  hours: any;
  minutes: any;
  seconds: any;
  time: any;
  constructor(
    private db: AngularFireDatabase,
    private authSrv: AuthService,
    private userSrv: UserService,
    private checkinSrv: CheckinService,
    private toastController: ToastController
  ) {}

  ionViewDidEnter(){
    this.authSrv.userDetails().subscribe(res => {
      if(res != null){
        this.userId = res.uid;
      }
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const posUser = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.userSrv.upLatLng(posUser.lat, posUser.lng, this.userId);
          const location = new google.maps.LatLng(posUser.lat, posUser.lng);
          const options = {
            center: location,
            zoom: 13,
            disableDefaultUI: true
          };

          this.checkinSrv.getAllCheckin(this.userId).snapshotChanges().pipe(
            map(changes =>
              changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
              )
          ).subscribe(data=>{
            this.length = data.length;
            // console.log(this.length);
          })
  
          this.map = new google.maps.Map(this.mapRef.nativeElement, options);
          // console.log(posUser);
          this.map.setCenter(posUser);
  
          const marker = new google.maps.Marker({
            position: posUser,
            map: this.map,
          });
        });
      }
    });
  }

  showCurrentLocation(){
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.map.setCenter(pos);
      });
    }
  }

  onSubmit(f: NgForm) {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        let date = new Date();
        this.hours = date.getHours();
        this.minutes = date.getMinutes();
        this.seconds = date.getSeconds();
        if(this.hours < 10)
        {
          this.hours = '0' + this.hours;
        } 
        if(this.minutes < 10)
        {
          this.minutes = '0' + this.minutes;
        } 
        if(this.seconds < 10)
        {
          this.seconds = '0' + this.seconds;
        }
        this.time = this.hours + ':' + this.minutes + ':' + this.seconds;

        this.userSrv.upLatLng(pos.lat, pos.lng, this.userId);

        this.checkinSrv.create(pos.lat, pos.lng, f.value.checkin, this.userId, this.length, this.time)
        this.presentToast(f.value.checkin);

        f.reset();
      });
    }
  }

  async presentToast(location) {
    const toast = await this.toastController.create({
      message: 'Check-in at ' + location + ' success!',
      duration: 1500,
      color: "success",
      position: "top"
    });
    toast.present();
  }
}
