import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ClaimService } from '../../../services/claim';
import { DashboardStats, Claim } from '../../../models/claim.model';
import { forkJoin, Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule, MatChipsModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class AgentDashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats = { total: 0, nouveau: 0, enCours: 0, resolue: 0, prioriteHaute: 0, prioriteMoyenne: 0, prioriteFaible: 0 };
  recentClaims: Claim[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(private claimService: ClaimService) {}

  ngOnInit() {
    timer(0, 10000).pipe(
      switchMap(() => forkJoin({
        stats: this.claimService.getDashboardStats(),
        claims: this.claimService.getClaims()
      })),
      takeUntil(this.destroy$)
    ).subscribe({
      next: ({ stats, claims }) => { this.stats = stats; this.recentClaims = claims.slice(0, 5); },
      error: (err) => {
        if (err.status !== 401 && err.status !== 403) {
          console.error('Erreur dashboard agent', err);
        }
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getStatusClass(statut: string): string {
    const classes = {
      'NOUVEAU': 'bg-red-100 text-red-800',
      'EN_COURS': 'bg-orange-100 text-orange-800',
      'RESOLU': 'bg-green-100 text-green-800'
    };
    return classes[statut as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }
}
