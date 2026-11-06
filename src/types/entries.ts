import {
  IconDroplet,
  IconRipple,
  IconScaleOutline,
  IconTestPipe2,
  IconToolsKitchen3,
  IconVaccineBottle,
  type Icon,
} from '@tabler/icons-vue';

export type EntryType = 'glucose' | 'insulin' | 'weight' | 'ketones' | 'water' | 'food';

export type NewEntry = {
  animal_id: string;
  measured_at: string;
  type: EntryType;
  value: string | null;
  notes?: string;
};

export type Entry = {
  id: string;
  user_id: string;
  type: EntryType;
  measured_at: string;
  value: number;
  notes?: string;
  animals: {
    id: string;
    name: string;
  };
};

export type EntryTypeDetails = {
  id: EntryType;
  name: string;
  unit: string;
  icon?: Icon;
};

export const ENTRY_TYPES: EntryTypeDetails[] = [
  {
    id: 'glucose',
    name: 'Glycémie',
    unit: 'mmol/L',
    icon: IconDroplet,
  },
  {
    id: 'insulin',
    name: 'Insuline',
    unit: 'unités',
    icon: IconVaccineBottle,
  },
  {
    id: 'weight',
    name: 'Poids',
    unit: 'kg',
    icon: IconScaleOutline,
  },
  {
    id: 'ketones',
    name: 'Cétonnes',
    unit: 'mmol/L',
    icon: IconTestPipe2,
  },
  {
    id: 'water',
    name: 'Eau',
    unit: 'mL',
    icon: IconRipple,
  },
  {
    id: 'food',
    name: 'Repas',
    unit: 'g',
    icon: IconToolsKitchen3,
  },
];
