import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Checkin } from './checkin';

@Injectable({
  providedIn: 'root'
})
export class CheckinService {
  private dbPath = "/checkin";
  checkinRef: AngularFireList<Checkin> = null;
  tmp:any;
  tmpCheckin2: any;
  tmpUserID: string;

  constructor(
    private db: AngularFireDatabase
  ) 
  {
    this.checkinRef = db.list(this.dbPath);  
  }

  getAll(): AngularFireList<Checkin> {
    return this.checkinRef;
  }

  getAllCheckin(userid: string): AngularFireList<Checkin> {
    this.tmpUserID = userid;
    this.tmpCheckin2 = this.db.list(this.dbPath, ref=>ref.child(this.tmpUserID)); 
    // console.log(this.tmpCheckin2);
    return this.tmpCheckin2;
  }

  create(lat, lng, position, userID, id, time): any {
    id = id + 1;
    this.tmp = "/location-" + id;
    return this.checkinRef.update(userID + '/' + this.tmp, {
      position: position,
      lat: lat,
      lng: lng,
      time: time,
      id: id
    });
  }

  delete(id: string, userID): Promise <void> {
    this.tmp = "/location-" + id;
    return this.checkinRef.remove(userID + '/' + this.tmp);
  }
}
