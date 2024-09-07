import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  private redirectUrl: string | null = null;

  constructor(private router: Router) {}

  setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  getRedirectUrl(): string | null {
    return this.redirectUrl;
  }

  clearRedirectUrl() {
    this.redirectUrl = null;
  }

  redirectToStoredUrl() {
    if (this.redirectUrl) {
      this.router.navigate([this.redirectUrl]);
      this.clearRedirectUrl();
    } else {
      this.router.navigate(['/user-account']);
    }
  }
}