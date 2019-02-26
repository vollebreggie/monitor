import { Configuration } from './Configuration';
import { EnumConfiguration } from './EnumConfiguration';
import { User } from './User';
import { System } from './System';

export class Setting {
    id: number;
    user: number;
    system: number;
    configuration: number;
    last_updated: Date;
  }