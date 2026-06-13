import type { Modalidad } from './vacancies';

export type AcademicStatus = 'En curso' | 'Egresado' | 'Titulado';
export type SubscriptionPlan = 'Free' | 'Premium';

export interface EducationItem {
  university: string;
  career: string;
  status: AcademicStatus;
  cycle?: number;
  graduationYear?: number;
}

export interface CVFile {
  name: string;
  sizeKB: number;
  uploadedAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  headline: string;
  location: string;
  yearsExperience: number;
  education: EducationItem;
  cvFile?: CVFile;
  technicalSkills: string[];
  softSkills: string[];
  interests: string[];
  preferredModalidades: Modalidad[];
  preferredLocations: string[];
  plan: SubscriptionPlan;
}

export const MOCK_USER_PROFILE: UserProfile = {
  name: 'María González',
  email: 'maria.gonzalez@gmail.com',
  headline: 'Coordinadora de Proyectos · Tecnología & Operaciones',
  location: 'Arequipa, Perú',
  yearsExperience: 5,
  education: {
    university: 'Universidad Nacional de San Agustín (UNSA)',
    career: 'Ingeniería Industrial',
    status: 'Egresado',
    graduationYear: 2020,
  },
  cvFile: {
    name: 'Maria_Gonzalez_CV_2026.pdf',
    sizeKB: 412,
    uploadedAt: '2026-06-10',
  },
  plan: 'Premium',
  technicalSkills: [
    'Microsoft Project',
    'JIRA',
    'Power BI',
    'Excel avanzado',
    'SQL',
    'Scrum',
    'Kanban',
    'Gestión de equipos',
    'Planificación',
    'Reportes',
    'KPIs',
    'Análisis funcional',
    'Inglés intermedio',
  ],
  softSkills: [
    'Liderazgo',
    'Comunicación',
    'Comunicación efectiva',
    'Negociación',
    'Resolución de problemas',
    'Trabajo en equipo',
    'Pensamiento analítico',
  ],
  interests: [
    'Gestión de Proyectos TI',
    'Consultoría',
    'Operaciones',
    'Transformación digital',
  ],
  preferredModalidades: ['Híbrido', 'Remoto'],
  preferredLocations: ['Arequipa, Perú'],
};
