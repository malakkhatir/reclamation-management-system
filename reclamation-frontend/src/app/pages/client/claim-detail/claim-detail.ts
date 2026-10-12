import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClaimService } from '../../../services/claim';
import { Claim } from '../../../models/claim.model';

@Component({
  selector: 'app-client-claim-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './claim-detail.html',
  styleUrls: ['./claim-detail.scss']
})
export class ClientClaimDetailComponent implements OnInit {
  claim?: Claim;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private claimService: ClaimService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.claimService.getClaimById(+id).subscribe({
        next: (data) => {
          this.claim = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur', err);
          alert('Réclamation introuvable');
          this.router.navigate(['/client/claims']);
        }
      });
    }
  }

  getStatusClass(statut: string): string {
    const classes = {
      'NOUVEAU': 'bg-red-100 text-red-800',
      'EN_COURS': 'bg-orange-100 text-orange-800',
      'RESOLU': 'bg-green-100 text-green-800'
    };
    return classes[statut as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getPriorityClass(priorite: string): string {
    const classes = {
      'HAUTE': 'bg-red-100 text-red-800',
      'MOYENNE': 'bg-orange-100 text-orange-800',
      'FAIBLE': 'bg-blue-100 text-blue-800'
    };
    return classes[priorite as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  goBack() {
    this.router.navigate(['/client/claims']);
  }

  canEdit(): boolean {
    return this.claim?.statut !== 'RESOLU';
  }
}
