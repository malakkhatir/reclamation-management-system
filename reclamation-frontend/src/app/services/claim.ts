import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Claim, DashboardStats } from '../models/claim.model';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private readonly apiUrl = 'http://localhost:8080/api/reclamations';
  private readonly dashboardUrl = 'http://localhost:8080/api/dashboard';

  constructor(private http: HttpClient) { }

  createClaim(claim: Claim): Observable<Claim> {
    return this.http.post<Claim>(this.apiUrl, claim);
  }

  getClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(this.apiUrl);
  }

  getClaimById(id: number): Observable<Claim> {
    return this.http.get<Claim>(`${this.apiUrl}/${id}`);
  }

  updateClaim(id: number, claim: Claim): Observable<Claim> {
    return this.http.put<Claim>(`${this.apiUrl}/${id}`, claim);
  }

  changeStatus(id: number, statut: string): Observable<Claim> {
    return this.http.put<Claim>(`${this.apiUrl}/${id}/statut?statut=${statut}`, {});
  }

  assignClaim(id: number): Observable<Claim> {
    return this.http.put<Claim>(`${this.apiUrl}/${id}/assign`, {});
  }

  filterClaims(statut?: string, priorite?: string): Observable<Claim[]> {
    let params = new HttpParams();
    if (statut) params = params.set('statut', statut);
    if (priorite) params = params.set('priorite', priorite);
    return this.http.get<Claim[]>(`${this.apiUrl}/filter`, { params });
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.dashboardUrl}/stats`);
  }
}
