export type AttackType = 'ransomware' | 'wyciek_danych';

export type AttackSource = 'ransomware.live' | 'bezpiecznedane.gov.pl';

export interface Attack {
  company: string;
  date: string; // YYYY-MM-DD, or YYYY-MM when the source has no day-level precision
  type: AttackType;
  source: AttackSource;
  sourceUrl: string;
  sector?: string;
  group?: string;
  description?: string;
  verified: boolean;
}
