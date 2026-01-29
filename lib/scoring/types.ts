export type TrackKey =
  | "insulin_resistance"
  | "type2_diabetes"
  | "metabolic_syndrome"
  | "fatty_liver"
  | "pcos"
  | "hypothyroid_support"
  | "cortisol_sleep"
  | "adrenal_insufficiency"
  | "cushings_support"
  | "cah_support";

export type Protocol = "keto" | "paleo" | "vegan" | "carnivore" | "flexible";

export type NetCarbBucket = "very_low" | "low" | "moderate";
export type Level = "low" | "medium" | "high";

export type QuizInput = {
  goals: string[];
  diagnoses: string[];
  symptoms: string[];
  labs: Record<string, any>;
  protocol: Protocol;
  exclusions: string[];
  mealsPerDay: number;
  snacks: boolean;
  fasting: boolean;
};

export type Recipe = {
  id: string;
  title: string;
  protocols: Protocol[];         // compatible protocols
  exclusions: string[];          // contains allergens (e.g. "eggs","dairy")
  netCarbBucket: NetCarbBucket;
  proteinLevel: Level;
  fiberLevel: Level;
  sodiumLevel: Level;
  trackWeights: Partial<Record<TrackKey, number>>; // 0..5
  tags?: string[];
};
