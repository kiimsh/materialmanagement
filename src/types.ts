/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PartClass = 'A' | 'B' | 'C';
export type InventoryStatus = 'Red' | 'Yellow' | 'Green';

export interface Part {
  id: string;
  partNumber: string;
  name: string;
  class: PartClass;
  currentStock: number;
  safetyStock: number;
  leadTimeDays: number;
  unitPrice: number;
  status: InventoryStatus;
  burnRate: number; // monthly consumption
}

export interface ExportLicense {
  id: string;
  partId: string;
  country: string;
  expirationDate: string;
  reviewPeriodDays: number;
  bufferDays: number;
  status: 'Normal' | 'Expiring' | 'Expired';
}

export interface ForecastData {
  month: string;
  actual: number | null;
  predicted: number | null;
  safetyStock: number;
}

export type ViewType = 'dashboard' | 'el' | 'forecast' | 'data';
