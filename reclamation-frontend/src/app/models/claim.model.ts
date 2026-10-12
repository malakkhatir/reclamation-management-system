export interface Claim {
  id?: number;
  titre: string;
  description: string;
  statut: 'NOUVEAU' | 'EN_COURS' | 'RESOLU';
  priorite: 'FAIBLE' | 'MOYENNE' | 'HAUTE';
  dateCreation?: Date;
  dateModification?: Date;
  clientNom?: string;
  agentNom?: string;
}

export interface DashboardStats {
  total: number;
  nouveau: number;
  enCours: number;
  resolue: number;
  prioriteHaute: number;
  prioriteMoyenne: number;
  prioriteFaible: number;
}
