import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FriendsService } from 'src/app/services/friends.service';
import { UserService } from 'src/app/services/user.service';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  userEmail: string;
  itemID: string;
  userID: string;
  user: any;
  length:any;

  constructor(
    // private toastController: ToastController,
    // private contactsService: ContactsService,
    // private router: Router
    private router: Router,
    private authSrv: AuthService,
    private userService: UserService,
    private friendService: FriendsService
  ) { }

  ngOnInit() {
    this.authSrv.userDetails().subscribe(res => {
      console.log(res);
      console.log('mulai uid: ', res.uid);
      if(res !== null){
        this.userEmail =  res.email;
        this.userID = res.uid;
        this.userService.getUser(this.userID).subscribe(profile => {
          this.user = profile;
          console.log(profile);
        });

        this.friendService.getAllFriend(this.userID).snapshotChanges().pipe(
          map(changes =>
            changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
            )
        ).subscribe(data=>{
          this.length = data.length;
          console.log(this.length);
        })
      }
    });


  }

  onSubmit(f: NgForm) {
    console.log(f);
    this.friendService.create(f.value, this.userID, this.length).then(res => {
      console.log(res);
      this.router.navigateByUrl('/tabs/tab1');
    }).catch(error => console.log(error));

    f.reset();
    this.router.navigateByUrl('/tabs/tab1');
  }

}
