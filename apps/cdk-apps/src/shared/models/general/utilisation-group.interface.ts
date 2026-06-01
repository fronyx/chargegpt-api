import { IGrid } from './grid.interface';

export interface UtilisationGroup {
  grid: IGrid;
  totalLocationCount: number;
  utilisedLocationCount: number;
  utilisationPercentage: number;
  locationIds: string[];
  isUtilised: boolean;
  lastUpdated: string;
}
