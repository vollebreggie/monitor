import { Log } from './Log';
import { System } from './System';

export class Message {
    id: number;
    system: System;
    log: Log;
    created: Date;
}