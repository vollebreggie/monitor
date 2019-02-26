import { SystemService } from './../../Services/SystemService';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap, map, tap
} from 'rxjs/operators';
import { System } from 'src/app/Models/System';
import { NotifierService } from 'angular-notifier';
import { WebsocketService } from 'src/app/Services/SocketService';
import { NotificationService } from 'src/app/Services/NotificationService';
import { MessageService } from 'src/app/Services/MessageService';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  private systems: System[];
  
  constructor(
    private systemService: SystemService,
    private notificationService: NotificationService,
    private messageService: MessageService,
    ) { }

  ngOnInit() {
    this.notificationService.messages.subscribe(msg => {
      this.messageService.getMessage(msg).subscribe(message => {
        //A new message has arrived, update the systems
        //TODO:: in the future this has to be for the specific system and give focus to that diagram or data
        this.systemService.getSystemsByUserId().subscribe(systems => this.systems = systems);
      })
    });
    
    this.systemService.getSystemsByUserId().subscribe(systems => this.systems = systems);
  } 

}