
import { ExamType, ClinicalTest, ClinicalCase } from './types';

export const CLINICAL_TESTS: ClinicalTest[] = [
  // ESTADO MENTAL Y FUNCIONES SUPERIORES
  { id: 'mental-orientation', name: 'Orientación y Atención', type: ExamType.MentalState, region: 'head', description: 'Evaluación de corteza prefrontal y sistema activador reticular.' },
  { id: 'mental-language', name: 'Lenguaje (Fluidez/Comprensión)', type: ExamType.MentalState, region: 'head', description: 'Evaluación de áreas de Broca (44, 45) y Wernicke (22).' },
  { id: 'mental-memory', name: 'Memoria Reciente', type: ExamType.MentalState, region: 'head', description: 'Integridad del circuito de Papez e hipocampo.' },

  // PARES CRANEALES (I - XII)
  { id: 'cn1-olfactory', name: 'CN I: Olfatorio', type: ExamType.CranialNerves, region: 'head', description: 'Prueba de sustancias no irritantes por narina.' },
  { id: 'cn2-optic', name: 'CN II: Agudeza y Campos', type: ExamType.CranialNerves, region: 'head', description: 'Campos por confrontación y fondo de ojo.' },
  { id: 'cn3-4-6-ocular', name: 'CN III, IV, VI: Motilidad Ocular', type: ExamType.CranialNerves, region: 'head', description: 'Seguimiento en H y reflejos pupilares.' },
  { id: 'cn5-trigeminal', name: 'CN V: Sensibilidad y Masticación', type: ExamType.CranialNerves, region: 'head', description: 'V1, V2, V3 y músculos temporal/masetero.' },
  { id: 'cn7-facial', name: 'CN VII: Mímica Facial', type: ExamType.CranialNerves, region: 'head', description: 'Simetría al sonreír, cerrar ojos y arrugar frente.' },
  { id: 'cn8-vestibulocochlear', name: 'CN VIII: Audición y Vestibular', type: ExamType.CranialNerves, region: 'head', description: 'Prueba de susurro, Weber/Rinne y maniobra de Dix-Hallpike.' },
  { id: 'cn9-10-vagus', name: 'CN IX, X: Paladar y Fonación', type: ExamType.CranialNerves, region: 'head', description: 'Elevación de la úvula y reflejo nauseoso.' },
  { id: 'cn11-accessory', name: 'CN XI: Espinal Accesorio', type: ExamType.CranialNerves, region: 'head', description: 'Encogimiento de hombros (Trapecio) y rotación de cuello (ECM).' },
  { id: 'cn12-hypoglossal', name: 'CN XII: Hipogloso', type: ExamType.CranialNerves, region: 'head', description: 'Protrusión de la lengua y búsqueda de atrofia/fasciculaciones.' },

  // EXAMEN MOTOR Y REFLEJOS
  { id: 'motor-bulk-tone', name: 'Inspección y Tono', type: ExamType.MotorExam, region: 'arm', description: 'Búsqueda de atrofia, fasciculaciones y rigidez/espasticidad.' },
  { id: 'motor-power-upper', name: 'Fuerza Segmentaria MS', type: ExamType.MotorExam, region: 'arm', description: 'Evaluación de deltoides (C5), bíceps (C5-6), tríceps (C7), interóseos (T1).' },
  { id: 'reflex-dtr-upper', name: 'DTR Miembros Superiores', type: ExamType.Reflexes, region: 'arm', description: 'Bicipital (C5), Estilorradial (C6), Tricipital (C7).' },
  
  // SENSIBILIDAD
  { id: 'sensory-modalities', name: 'Modalidades Primarias', type: ExamType.SensoryExam, region: 'torso', description: 'Dolor (vía anterolateral) vs Vibración/Posición (Columnas posteriores).' },
  { id: 'sensory-cortical', name: 'Sensibilidad Cortical', type: ExamType.SensoryExam, region: 'arm', description: 'Estereognosia, grafestesia y extinción sensorial.' },

  // COORDINACIÓN Y MARCHA
  { id: 'coord-appendicular', name: 'Pruebas Cerebelosas', type: ExamType.CoordinationGait, region: 'leg', description: 'Dedo-nariz, talón-rodilla y movimientos alternantes rápidos.' },
  { id: 'gait-analysis', name: 'Análisis de la Marcha', type: ExamType.CoordinationGait, region: 'foot', description: 'Base de sustentación, balanceo de brazos, tándem y marcha en talones/puntas.' }
];

export const CLINICAL_CASES: ClinicalCase[] = [
  {
    id: 'case-uncal',
    title: 'Herniación Uncal Inminente',
    patientProfile: 'Paciente con trauma craneal, disminución de alerta y midriasis derecha.',
    findings: 'Pupila derecha dilatada y no reactiva a la luz.',
    targetRegion: 'head',
    correctTestId: 'cn3-4-6-ocular'
  },
  {
    id: 'case-weber',
    title: 'Síndrome de Weber (Mesencéfalo)',
    patientProfile: 'Varón con hemiparesia izquierda y ptosis palpebral derecha con ojo "fuera y abajo".',
    findings: 'Lesión ipsilateral del III par con debilidad contralateral.',
    targetRegion: 'head',
    correctTestId: 'cn3-4-6-ocular'
  },
  {
    id: 'case-bell',
    title: 'Parálisis de Bell vs ACV',
    patientProfile: 'Paciente no puede cerrar el ojo ni arrugar la frente del lado izquierdo.',
    findings: 'Afectación de toda la hemicara izquierda (lesión periférica del VII).',
    targetRegion: 'head',
    correctTestId: 'cn7-facial'
  },
  {
    id: 'case-bulbar',
    title: 'Síndrome Bulbar Lateral (Wallenberg)',
    patientProfile: 'Mujer con vértigo, disfagia y pérdida de sensibilidad cruzada.',
    findings: 'Desviación de la úvula y pérdida de reflejo nauseoso.',
    targetRegion: 'head',
    correctTestId: 'cn9-10-vagus'
  }
];
