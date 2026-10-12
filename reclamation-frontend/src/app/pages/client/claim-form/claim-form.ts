import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClaimService } from '../../../services/claim';
import { Claim } from '../../../models/claim.model';

@Component({
  selector: 'app-client-claim-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './claim-form.html',
  styleUrls: ['./claim-form.scss']
})
export class ClientClaimFormComponent implements OnInit {
  claimForm: FormGroup;
  isEdit = false;
  claimId?: number;
  loading = false;

  priorites = ['FAIBLE', 'MOYENNE', 'HAUTE'];

  constructor(
    private fb: FormBuilder,
    private claimService: ClaimService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.claimForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priorite: ['MOYENNE', Validators.required]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.claimId = +params['id'];
        this.loadClaim(this.claimId);
      }
    });
  }

  loadClaim(id: number) {
    this.claimService.getClaimById(id).subscribe({
      next: (claim) => {
        this.claimForm.patchValue({
          titre: claim.titre,
          description: claim.description,
          priorite: claim.priorite
        });
      },
      error: (err) => {
        console.error('Erreur chargement', err);
        alert('Impossible de charger la réclamation');
        this.router.navigate(['/client/claims']);
      }
    });
  }

  onSubmit() {
    if (this.claimForm.invalid) return;

    this.loading = true;
    const claim: Claim = this.claimForm.value;

    if (this.isEdit && this.claimId) {
      this.claimService.updateClaim(this.claimId, claim).subscribe({
        next: () => {
          this.loading = false;
          alert('Réclamation modifiée avec succès !');
          this.router.navigate(['/client/claims']);
        },
        error: (err) => {
          this.loading = false;
          console.error('Erreur update', err);
          alert('Erreur lors de la modification');
        }
      });
    } else {
      this.claimService.createClaim(claim).subscribe({
        next: () => {
          this.loading = false;
          alert('Réclamation créée avec succès !');
          this.router.navigate(['/client/claims']);
        },
        error: (err) => {
          this.loading = false;
          console.error('Erreur création', err);
          alert('Erreur lors de la création');
        }
      });
    }
  }
}
