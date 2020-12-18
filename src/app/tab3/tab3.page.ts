import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CheckinService } from '../services/checkin.service';
import { UserService } from '../services/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  userEmail: string;
  userNIM: string;
  userID: string;
  userName: string;
  query=[];
  checkin:any;

  user: any;
  constructor(
    private authSrv: AuthService,
    private navCtrl: NavController,
    private userService: UserService,
    private checkinSrv: CheckinService
  ) {}

  ngOnInit() {
    this.authSrv.userDetails().subscribe(res => {
      // console.log(res);
      // console.log('uid: ', res.uid);
      if (res !== null){
        this.userEmail =  res.email;
        this.userID = res.uid;
        this.userService.getUser(this.userID).subscribe(profile => {
          this.user = profile;
          this.userName = profile['namadepan'] + ' ' + profile['namabelakang'];
          // console.log(profile);
        });
      }
      else {
        this.navCtrl.navigateBack('/login');
      }
    }, err => {
      console.log(err);
    });
  }

  ionViewWillEnter() {
    this.authSrv.userDetails().subscribe(res => {
      // console.log(res);
      // console.log('mulai uid: ', res.uid);
      if(res !== null){
        this.userEmail =  res.email;
        this.userID = res.uid;
        this.userService.getUser(this.userID).subscribe(profile => {
          this.user = profile;
          // console.log(profile);
        });

        this.checkinSrv.getAllCheckin(this.userID).snapshotChanges().pipe(
          map(changes =>
            changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
            )
        ).subscribe(data=>{
          this.checkin = data;
          // console.log(this.checkin);
        })
      }
    });
  }

  delete(id) {
    console.log(id);
    this.checkinSrv.delete(id, this.userID).then(res => {
      // console.log(res);
    })
  }

  logout() {
    this.authSrv.logoutUser()
      .then(res=> {
        // console.log(res);
        this.navCtrl.navigateBack('/login');
      })
      .catch(error => {
        // console.log(error);
      });
  }

}
