import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder } from '@angular/forms';

import { License } from '../../../apis/license/target/generated-sources/swagger/model/license';
import { QueryService } from '../../../apis/license/target/generated-sources/swagger/api/query.service';
import { UpdateService } from '../../../apis/license/target/generated-sources/swagger/api/update.service';
import { DownloadService } from '../../../apis/license/target/generated-sources/swagger/api/download.service';
import { LicenseStatus, LicensePurpose, NetworkLimit, SessionLimit } from '../../common/constant';
import { blobDownload } from '../../common/utils';


@Component({
  selector: 'app-license-list',
  templateUrl: './licenseList.component.html',
  styleUrls: ['./licenseList.component.less'],
})
export class LicenseListComponent implements OnInit {
  listOfData: License[] = [];
  loading = false;
  total = 0;
  pageSize = 20;
  pageIndex = 1;
  searchParams = {};
  // tableScroll: any = { y: '200px' };
  LicenseStatus = LicenseStatus;
  LicensePurpose = LicensePurpose;
  NetworkLimit = NetworkLimit;
  SessionLimit = SessionLimit;
  isVisible: boolean = false;
  isManager: boolean = false;
  approvalParams: License = {};

  constructor(
    private fb: FormBuilder,
    public QueryService: QueryService,
    public UpdateService: UpdateService,
    public DownloadService: DownloadService,
    private message: NzMessageService,
  ) { }

  ngOnInit(): void {
    // this.tableScroll.y = window.innerHeight - 530 + 'px';
    this.loadDataFromServer();
  }

  loadDataFromServer(): void {
    this.loading = true;
    // 判断searchParams是否有查询字段
    if (JSON.stringify(this.searchParams) !== "{}") {
      this.QueryService.getLicensesByFilter(this.searchParams, this.pageIndex, this.pageSize).subscribe(
        data => this.success(data),
        failed => this.fail(failed)
      );
    } else {
      this.QueryService.getLicenses(this.pageIndex, this.pageSize).subscribe(
        data => this.success(data),
        failed => this.fail(failed)
      );
    }
  }

  success(data) {
    this.loading = false;
    this.total = data.totalSize;
    this.listOfData = data.data;
    this.isManager = data.isManager;
  }

  fail(failed) {
    this.loading = false;
    const mess = failed && failed.error && failed.error.message;
    this.message.create('error', `${mess}`);
  }

  onPageIndexChange() {
    this.loadDataFromServer();
  }

  onPageSizeChange() {
    this.loadDataFromServer();
  }

  onSearch(val: any): void {
    this.searchParams = val;
    this.pageIndex = 1;
    this.loadDataFromServer();
  }

  handleApproval(data): void {
    this.isVisible = true;
    this.approvalParams = { ...data };
  }

  handleOk(): void {
    this.isVisible = false;
    this.loadDataFromServer();
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleDownload(data): void {
    this.DownloadService.downloadLicense(data).subscribe(
      resp => {
        const filename = `Permission-${data.subject}-${data.use}-${data.holder}.zip`;
        blobDownload(resp, filename);
      },
    )
  }

}
