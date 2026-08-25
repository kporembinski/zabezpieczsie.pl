export type AttackType = 'ransomware' | 'wyciek_danych';

export type AttackSource = 'ransomware.live' | 'bezpiecznedane.gov.pl' | 'haveibeenpwned.com';

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
  discovered?: string; // full ISO timestamp; ransomware.live only — when the group's leak listing was first observed
}
