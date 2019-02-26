import { Log } from './../../Models/Log';
import { Component, Input, SimpleChanges } from '@angular/core';
import { LineChartData } from 'src/app/Models/LineChartData';

@Component({
  selector: 'line-chart-demo',
  templateUrl: './chart.component.html'
})
export class LineChartComponent {
  @Input() lineChartDataRaw: LineChartData;
  // lineChart
  private init = false;
  public lineChartData:Array<any>;
  public lineChartLabels: Array<number>;
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [

    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];

  public lineChartLegend: boolean = false;
  public lineChartType: string = 'line';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.lineChartDataRaw != null) { 
      if(this.lineChartDataRaw.amount.length != 0) {
        this.init = true;
        this.lineChartData = [{ data: this.lineChartDataRaw.amount, label: '' }];
        this.lineChartLabels = this.lineChartDataRaw.days;
      }   
    }
  }
}