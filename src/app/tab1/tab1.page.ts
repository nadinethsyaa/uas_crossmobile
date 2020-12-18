import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FriendsService } from '../services/friends.service';
import { UserService } from '../services/user.service';
import { FormControl } from '@angular/forms';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  friend: any;
  resetFriend: any;
  userEmail: string;
  itemID: string;
  userID: string;
  user: any;
  searchControl : FormControl;

  constructor(
    private authSrv: AuthService,
    private navCtrl: NavController,
    private friendService: FriendsService,
    private userService: UserService
  ) { this.searchControl = new FormControl(); }

  ngOninit() {

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

        this.friendService.getAllFriend(this.userID).snapshotChanges().pipe(
          map(changes =>
            changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
            )
        ).subscribe(data=>{
          this.friend = data;
          this.resetFriend = data;
          // console.log(this.friend);

          this.setFilteredItems("");
          this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {
            this.setFilteredItems(search);
          });
        })
      }
    });
  }

  delete(id) {
    // console.log(id);
    this.friendService.delete(id, this.userID).then(res => {
      // console.log(res);
    })
  }

  setFilteredItems(searchTerm) {
    this.friend = this.resetFriend;
    this.friend = this.friend.filter(item => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    })
  }
}
