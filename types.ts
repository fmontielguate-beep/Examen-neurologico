
export enum ExamType {
  MentalState = 'Estado Mental',
  CranialNerves = 'Nervios Craneales',
  MotorExam = 'Examen Motor',
  Reflexes = 'Reflejos',
  CoordinationGait = 'Coordinación y Marcha',
  SensoryExam = 'Examen Sensorial'
}

export enum AnatomicalLayer {
  Skin = 'Piel',
  Muscle = 'Músculos',
  Nerve = 'Nervios',
  Tracts = 'Vías de Tractos Largos'
}

export interface ClinicalTest {
  id: string;
  name: string;
  type: ExamType;
  region: string;
  description: string;
}

export interface ClinicalCase {
  id: string;
  title: string;
  patientProfile: string;
  findings: string;
  targetRegion: string;
  correctTestId: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalysisResponse {
  content: string;
  sources: GroundingSource[];
}

export interface StructureInfo {
  name: string;
  embryology: string;
  localization: string;
  function: string;
}
