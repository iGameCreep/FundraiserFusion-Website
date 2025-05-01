import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {IApiResponse} from "../../models/api/IApiResponse";
import {StreamLabsService} from 'src/app/services/streamlabs.service';
import {ISocketToken} from "../../models/api/ISocketToken";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: false,
})
export class AuthComponent implements OnInit {
  socketData: ISocketToken | null = null;

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

      this.streamlabsService.getSocketTokenFromCode(code)
      .subscribe({
        next: (res: IApiResponse<ISocketToken>) => {
          if (!res.success) {
            this.toastr.error(res.error ?? res.message ?? "Unknown Error");
            return;
          }

          this.socketData = res.data;
        },
        error: (err: HttpErrorResponse) => {
          console.error(err.message);
          this.toastr.error(`Unable to generate token: ${err.statusText} (${err.status})`);
        }
      });
    });
  }

  copySocketToken(): void {
    if (this.socketData?.socket_token) {
      void navigator.clipboard.writeText(this.socketData.socket_token);
      this.toastr.success(
        `Successfully copied socket token to clipboard !`,
        'Success !'
      );
    } else {
      this.toastr.error(`Unable to copy socket token to clipboard.`, 'Error');
    }
  }

  protected generateSecretsFile(): void {
    const blob = new Blob([JSON.stringify(this.socketData)], { type: 'text/plain' });
    const url: string = window.URL.createObjectURL(blob);

    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = 'secrets.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
