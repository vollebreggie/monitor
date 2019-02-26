
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorComponent implements OnInit {

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit(): void {
  }

}