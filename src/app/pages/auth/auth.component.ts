import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {IApiResponse} from "../../models/api/IApiResponse";
import {ITokenData} from 'src/app/models/api/ITokenData';
import {StreamLabsService} from 'src/app/services/streamlabs.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  data: ITokenData | null = null;
  expiresOn!: Date;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly streamlabsService: StreamLabsService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const code: string = params['code'];
      if (!code) {
        void this.router.navigateByUrl('');
        return;
      }

      this.streamlabsService.getTokenFromCode(code)
      .subscribe({
        next: (res: IApiResponse<ITokenData>) => {
          if (!res.success) {
            this.toastr.error(res.error ?? res.message ?? "Unknown Error");
            return;
          }

          const data: ITokenData = res.data;
          this.data = res.data;
          this.expiresOn = new Date(Date.now() + data.expires_in);
        },
        error: (err: HttpErrorResponse) => {
          console.error(err.message);
          this.toastr.error(`Unable to generate token: ${err.statusText} (${err.status})`);
        }
      });
    });
  }

  copyAccessToken(): void {
    if (this.data?.access_token) {
      void navigator.clipboard.writeText(this.data.access_token);
      this.clipboardSuccess('access');
    } else {
      this.clipboardError('access');
    }
  }

  copyRefreshToken(): void {
    if (this.data?.refresh_token) {
      void navigator.clipboard.writeText(this.data.refresh_token);
      this.clipboardSuccess('refresh');
    } else {
      this.clipboardError('refresh');
    }
  }

  private clipboardSuccess(type: 'access' | 'refresh') {
    this.toastr.success(
      `Successfully copied ${type} token to clipboard !`,
      'Success !'
    );
  }

  private clipboardError(type: 'access' | 'refresh') {
    this.toastr.error(`Unable to copy ${type} token to clipboard.`, 'Error');
  }

  protected generateSecretsFile(): void {
    const newData = {
      ...this.data,
      expires_on: this.expiresOn,
    }

    const blob = new Blob([JSON.stringify(newData)], { type: 'text/plain' });
    const url: string = window.URL.createObjectURL(blob);

    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = 'secrets.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
