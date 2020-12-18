import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Friend } from './friend';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  private dbPath = "/friend";
  private tmpFriend = "/friend";
  friendRef: AngularFireList<Friend> = null;
  tmp:any;
  tmpFriend2: any;
  tmpUserID: string;

  constructor(
    private db: AngularFireDatabase
  ) 
  {
    this.friendRef = db.list(this.dbPath);  
  }

  getAll(): AngularFireList<Friend> {
    return this.friendRef;
  }

  getAllFriend(userid: string): AngularFireList<Friend> {
    // this.tmpFriend = this.dbPath + userid;
    this.tmpUserID = userid;
    this.tmpFriend2 = this.db.list(this.dbPath, ref=>ref.child(this.tmpUserID)); 
    // console.log(this.tmpFriend2);
    // return this.db.list(this.tmpFriend);
    return this.tmpFriend2;
  }

  create(friend: Friend, userID, id): any {
    id = id + 1;
    this.tmp = "/friend-" + id;
    return this.friendRef.update(userID + '/' + this.tmp, {
      id: id,
      name: friend.name,
      image: friend.image
    });
  }

  delete(id: string, userID): Promise <void> {
    this.tmp = "/friend-" + id;
    return this.friendRef.remove(userID + '/' + this.tmp);
  }
}
