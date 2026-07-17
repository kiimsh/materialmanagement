import { Part, ExportLicense, ForecastData } from '../types';
import { addDays, format, subMonths, addMonths } from 'date-fns';

export const mockParts: Part[] = [
  {
    id: '1',
    partNumber: 'K9-ENG-001',
    name: 'MTU 881 Ka-500 Engine',
    class: 'A',
    currentStock: 12,
    safetyStock: 15,
    leadTimeDays: 180,
    unitPrice: 450000,
    status: 'Red',
    burnRate: 2.5,
  },
  {
    id: '2',
    partNumber: 'K9-TRN-052',
    name: 'Allison X1100-5A3 Transmission',
    class: 'A',
    currentStock: 18,
    safetyStock: 15,
    leadTimeDays: 150,
    unitPrice: 280000,
    status: 'Green',
    burnRate: 2.2,
  },
  {
    id: '3',
    partNumber: 'K9-GUN-155',
    name: '155mm/52-cal Gun Barrel',
    class: 'A',
    currentStock: 25,
    safetyStock: 30,
    leadTimeDays: 120,
    unitPrice: 150000,
    status: 'Yellow',
    burnRate: 4.0,
  },
  {
    id: '4',
    partNumber: 'K9-SENS-007',
    name: 'Fire Control Processor Unit',
    class: 'B',
    currentStock: 45,
    safetyStock: 40,
    leadTimeDays: 90,
    unitPrice: 15000,
    status: 'Green',
    burnRate: 5.5,
  },
  {
    id: '5',
    partNumber: 'K9-HYD-112',
    name: 'Hydraulic Actuator Assembly',
    class: 'B',
    currentStock: 35,
    safetyStock: 50,
    leadTimeDays: 60,
    unitPrice: 8500,
    status: 'Red',
    burnRate: 8.0,
  },
  {
    id: '6',
    partNumber: 'K9-BOLT-M12',
    name: 'High-Tensile Bolt M12',
    class: 'C',
    currentStock: 1200,
    safetyStock: 1000,
    leadTimeDays: 14,
    unitPrice: 12,
    status: 'Green',
    burnRate: 200,
  },
];

const today = new Date();

export const mockELs: ExportLicense[] = [
  {
    id: 'el-1',
    partId: '1',
    country: 'Germany',
    expirationDate: format(addDays(today, 45), 'yyyy-MM-dd'),
    reviewPeriodDays: 90,
    bufferDays: 30,
    status: 'Expiring',
  },
  {
    id: 'el-2',
    partId: '2',
    country: 'USA',
    expirationDate: format(addDays(today, 200), 'yyyy-MM-dd'),
    reviewPeriodDays: 60,
    bufferDays: 15,
    status: 'Normal',
  },
  {
    id: 'el-3',
    partId: '3',
    country: 'Domestic (KR)',
    expirationDate: format(addDays(today, 365), 'yyyy-MM-dd'),
    reviewPeriodDays: 30,
    bufferDays: 10,
    status: 'Normal',
  },
  {
    id: 'el-4',
    partId: '5',
    country: 'USA',
    expirationDate: format(addDays(today, 15), 'yyyy-MM-dd'),
    reviewPeriodDays: 60,
    bufferDays: 20,
    status: 'Expired',
  },
];

export const generateForecast = (partId: string): ForecastData[] => {
  const part = mockParts.find(p => p.id === partId);
  if (!part) return [];

  const data: ForecastData[] = [];
  for (let i = 6; i >= 1; i--) {
    const date = subMonths(today, i);
    data.push({
      month: format(date, 'MMM'),
      actual: part.burnRate * (0.8 + Math.random() * 0.4),
      predicted: null,
      safetyStock: part.safetyStock / 6, // monthly safety
    });
  }

  for (let i = 0; i < 6; i++) {
    const date = addMonths(today, i);
    data.push({
      month: format(date, 'MMM'),
      actual: i === 0 ? part.burnRate : null,
      predicted: part.burnRate * (0.9 + Math.random() * 0.3),
      safetyStock: part.safetyStock / 6,
    });
  }

  return data;
};
