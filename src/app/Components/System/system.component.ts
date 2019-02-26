import { LineChartData } from './../../Models/LineChartData';
import { Log } from './../../Models/Log';
import { LogService } from './../../Services/LogService';
import { Component, OnInit, ChangeDetectionStrategy, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { System } from 'src/app/Models/System';
import { EnumPriority } from 'src/app/Services/logger.service';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})
export class SystemComponent implements OnInit {
  @Input() system: System;
  private trivialLineChartData: LineChartData;
  private majorLineChartData: LineChartData;
  private CriticalLineChartData: LineChartData;
  private blockerLineChartData: LineChartData;
 
  constructor(private logService: LogService) {

  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.system != null) {
      this.logService.getLineChartData(this.system.id, EnumPriority.Trivial).subscribe(logs => this.trivialLineChartData = logs);
      this.logService.getLineChartData(this.system.id, EnumPriority.Major).subscribe(logs => this.majorLineChartData = logs);
      this.logService.getLineChartData(this.system.id, EnumPriority.Critical).subscribe(logs => this.CriticalLineChartData = logs);
      this.logService.getLineChartData(this.system.id, EnumPriority.Blocker).subscribe(logs => this.blockerLineChartData = logs);
    }
  }

  // fetchLogData(lineChartData: LineChartData) {
  //     this.trivialLineChartData = lineChartData;
  // }
}