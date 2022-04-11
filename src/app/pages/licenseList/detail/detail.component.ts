import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

import { QueryService } from '../../../../apis/license/target/generated-sources/swagger/api/query.service';
import { DownloadService } from '../../../../apis/license/target/generated-sources/swagger/api/download.service';
import { License } from '../../../../apis/license/target/generated-sources/swagger/model/license';
import { LicenseStatus, LicensePurpose, NetworkLimit, SessionLimit } from '../../../common/constant';
import { blobDownload, getCookie } from '../../../common/utils';


@Component({
  selector: 'app-license-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class LicenseDetailComponent implements OnInit {
  licenseDetails: License = {};
  LicensePurpose = LicensePurpose;
  LicenseStatus = LicenseStatus;
  NetworkLimit = NetworkLimit;
  SessionLimit = SessionLimit;
  isVisible: boolean = false;
  approvalParams: License = {};
  isManager: string = 'false';

  constructor(
    private routeInfo: ActivatedRoute,
    private router: Router,
    private QueryService: QueryService,
    private DownloadService: DownloadService,
    private message: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.isManager = getCookie('isManager');
    this.getDetails();
  }

  getDetails = (): void => {
    this.routeInfo.params.subscribe((params) => {
      const { id } = params;
      this.QueryService.getLicenseById(id).subscribe(
      data => {
        this.approvalParams = data;
        const newData = this.changeServiceData(data);
        this.licenseDetails = newData;
      },
      failed => {
        const mess = failed && failed.error && failed.error.message;
        this.message.create('error', `${mess}`);
      })
    });
    
  }

  onReturn() {
    this.router.navigate(['/license/list']);
  }

  handleApproval(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
    this.getDetails();
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleDownload() {
    const licenseInfo = this.approvalParams;
    this.DownloadService.downloadLicense(licenseInfo).subscribe(
      resp => {
        const filename = `Permission-${licenseInfo.subject}-${licenseInfo.use}-${licenseInfo.holder}.zip`;
        blobDownload(resp, filename);
      },
    )
  }

  changeServiceData(data) {
    const { ip = null, mac = null } = data.extra;
    let networkInfo = [];
    if (ip && mac && (ip.length === mac.length)) {
      ip.forEach((item, i) => {
        networkInfo.push({ ip: item, mac: mac[i] })
      });
    }

    return { ...data, extra: networkInfo };
  }

}
