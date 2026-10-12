import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { ClaimService } from '../../../services/claim';
import { Claim } from '../../../models/claim.model';

@Component({
  selector: 'app-agent-claim-detail',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatSelectModule, MatFormFieldModule, MatProgressSpinnerModule
  ],
  templateUrl: './claim-detail.html',
  styleUrls: ['./claim-detail.scss']
})
export class AgentClaimDetailComponent implements OnInit {
  claim?: Claim;
  loading = true;
  selectedStatus: string = '';

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
          this.selectedStatus = data.statut || '';
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur', err);
          alert('Réclamation introuvable');
          this.router.navigate(['/agent/claims']);
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

  updateStatus() {
    if (!this.claim || !this.selectedStatus || this.selectedStatus === this.claim.statut) return;

    if (!confirm(`Changer le statut en "${this.selectedStatus}" ?`)) return;

    this.claimService.changeStatus(this.claim.id!, this.selectedStatus).subscribe({
      next: () => {
        alert('Statut mis à jour !');
        this.ngOnInit(); // Recharger
      },
      error: (err) => {
        console.error('Erreur', err);
        alert('Erreur lors du changement de statut');
      }
    });
  }

  assignClaim() {
    if (!this.claim || this.claim.agentNom) return;

    this.claimService.assignClaim(this.claim.id!).subscribe({
      next: (updated) => {
        this.claim = updated;
        alert('Réclamation prise en charge avec succès !');
      },
      error: (err) => {
        console.error('Erreur assignation', err);
        alert('Erreur lors de la prise en charge');
      }
    });
  }

  goBack() {
    this.router.navigate(['/agent/claims']);
  }
}
