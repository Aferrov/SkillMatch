import type { Modalidad } from './vacancies';

export interface UserProfile {
  name: string;
  headline: string;
  location: string;
  yearsExperience: number;
  technicalSkills: string[];
  softSkills: string[];
  interests: string[];
  preferredModalidades: Modalidad[];
  preferredLocations: string[];
}

export const MOCK_USER_PROFILE: UserProfile = {
  name: 'María González',
  headline: 'Coordinadora de Proyectos · Tecnología & Operaciones',
  location: 'Arequipa, Perú',
  yearsExperience: 5,
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
