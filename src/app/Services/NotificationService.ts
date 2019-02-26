import { EnumPriority } from './../Models/EnumPriority';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WebsocketService } from './SocketService';
import { map } from 'rxjs/operators';
import { NotificationMessage } from '../Models/NotificationMessage';

//const CHAT_URL = "ws://127.0.0.1:8080/user/1";
const CHAT_URL = "ws://127.0.0.1:8881";

@Injectable({ providedIn: 'root' })
export class NotificationService {
    public messages: Subject<number>;

    constructor(wsService: WebsocketService) {
        this.messages = <Subject<number>>wsService
            .connect(CHAT_URL)
            .pipe(
                map((response: MessageEvent): number => {
                    return Number(response.data);
                })
            );
    }

    //default, info, success, warning, error
    public getnotificationColorByPriority(priority: EnumPriority): string {
        let color = "";
        switch (priority) {
            case 1:
                color = "info";
                break;
            case 2:
                color = "default";
                break;
            case 3:
                color = "warning";
                break;
            case 4:
                color = "error";
                break;
            default:
                color = "info";
        }
        return color;
    }
}