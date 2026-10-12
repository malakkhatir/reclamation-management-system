import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ClaimService } from '../../../services/claim';
import { Claim } from '../../../models/claim.model';

@Component({
  selector: 'app-client-claim-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatCardModule, MatSelectModule, MatFormFieldModule
  ],
  templateUrl: './claim-list.html',
  styleUrls: ['./claim-list.scss']
})
export class ClientClaimListComponent implements OnInit {
  claims: Claim[] = [];
  filteredClaims: Claim[] = [];
  displayedColumns: string[] = ['id', 'titre', 'statut', 'priorite', 'dateCreation', 'actions'];

  // Filtres
  filterStatut: string = '';
  filterPriorite: string = '';

  constructor(private claimService: ClaimService) {}

  ngOnInit() {
    this.loadClaims();
  }

  loadClaims() {
    this.claimService.getClaims().subscribe({
      next: (data) => {
        this.claims = data;
        this.applyFilters();
      },
      error: (err) => console.error('Erreur chargement', err)
    });
  }

  applyFilters() {
    this.filteredClaims = this.claims.filter(claim => {
      const matchStatut = this.filterStatut ? claim.statut === this.filterStatut : true;
      const matchPriorite = this.filterPriorite ? claim.priorite === this.filterPriorite : true;
      return matchStatut && matchPriorite;
    });
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
