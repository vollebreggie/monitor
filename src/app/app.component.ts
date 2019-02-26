import { AuthenticationService } from './Services/AuthenticationService';
import { LoggerService, EnumPriority } from './Services/logger.service';
import { Component } from '@angular/core';
import { User } from './Models/User';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NotificationService } from './Services/NotificationService';
import { NotificationMessage } from './Models/NotificationMessage';
import { MessageService } from './Services/MessageService';
import { NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title;

  public currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private messageService: MessageService,
    private notifierService: NotifierService
  ) {
    this.authenticationService.currentUser.subscribe(userdata => {
      this.currentUser = userdata;
      if (userdata != null) {
        this.title = userdata.firstname;
      }
    });

    this.notificationService.messages.subscribe(msg => {
      this.messageService.getMessage(msg).subscribe(message => {
        this.notifierService.notify(notificationService.getnotificationColorByPriority(message.log.priority), "System: "+message.system.name +" - Version: "+ message.system.version +" - Message: "+ message.log.shortmessage);
      })
    });

    //default, info, success, warning, error
    //this.notifierService.notify('success', 'You are awesome! I mean it!' );

  }

  sendMsg() {
    let notification = new NotificationMessage();
		this.notificationService.messages.next(1);
		
	}

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
