import { AlertService } from './../../Services/AlertService';
import { AuthenticationService } from './../../Services/AuthenticationService';
import { Setting } from './../../Models/Setting';
import { Configuration } from './../../Models/Configuration';
import { ConfigurationService } from './../../Services/ConfigurationService';
import { LineChartData } from './../../Models/LineChartData';
import { Log } from './../../Models/Log';
import { LogService } from './../../Services/LogService';
import { Component, OnInit, ChangeDetectionStrategy, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { System } from 'src/app/Models/System';
import { EnumPriority } from 'src/app/Services/logger.service';
import { SystemService } from 'src/app/Services/SystemService';
import { SettingService } from 'src/app/Services/SettingsService';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'configure-system',
    templateUrl: './configure-system.component.html',
    styleUrls: ['./configure-system.component.css']
})
export class ConfigureSystemComponent implements OnInit {
    private systems: System[];
    private configurations: Configuration[];
    private selectedSystem: System;
    private selectedConfiguration: Configuration;
    private loading = false;
    private systemControl: FormControl;
    private configurationControl: FormControl;

    constructor(
        private systemService: SystemService,
        private configurationService: ConfigurationService,
        private authenticationService: AuthenticationService,
        private settingService: SettingService,
        private router: Router,
        private alertService: AlertService,
    ) {
        this.systemControl = new FormControl('', Validators.required);
        this.configurationControl = new FormControl('', Validators.required);
    }

    ngOnInit() {
        this.systemService.getSystems().subscribe(systems => this.systems = systems);
        this.configurationService.getConfigurations().subscribe(configurations => this.configurations = configurations)
    }

    ngOnChanges(changes: SimpleChanges) {

    }

    addConfiguration() {
        if (this.systemControl.errors == null && this.configurationControl.errors == null) {
            //start loading
            this.loading = true;

            //create settings object
            //TODO:: refactor to a setting constructor, is neater
            let setting = new Setting();
            setting.configuration = this.selectedConfiguration.id;
            setting.system = this.selectedSystem.id;
            setting.user = this.authenticationService.currentUserValue.id;
            setting.last_updated = new Date();
            //send call to the server with settings objects and wait for an response
            this.settingService.addSetting(setting).subscribe(
                data => {
                    this.router.navigate(['/dashboard']);
                },
                error => {
                    this.alertService.error(error.message);
                    this.loading = false;
                });
        } else {
            let message = "";

            for ( let error of Object.keys(this.systemControl.errors)){
                message += "| System: " + error + " | ";
            }
       
            for ( let error of Object.keys(this.systemControl.errors)){
                message += "Configuration: " + error + " | ";   
            }
            
            this.alertService.error(message);
        }
    }


}