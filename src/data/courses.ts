export type CoursePlatform =
  | 'Coursera'
  | 'Udemy'
  | 'Platzi'
  | 'edX'
  | 'LinkedIn Learning'
  | 'Cibertec'
  | 'Británico'
  | 'PMI'
  | 'Scrum.org'
  | 'AWS Skill Builder'
  | 'Microsoft Learn'
  | 'Google Cloud Skills';

export type CourseLevel = 'Básico' | 'Intermedio' | 'Avanzado';

export interface Course {
  id: string;
  name: string;
  platform: CoursePlatform;
  skill: string;
  level: CourseLevel;
  url: string;
  duration: string;
  rating?: number;
  isFree?: boolean;
  isCertification?: boolean;
}

export const COURSES: Course[] = [
  // ─── Tech: frontend ───
  {
    id: 'react-platzi',
    name: 'Curso de React.js',
    platform: 'Platzi',
    skill: 'React',
    level: 'Intermedio',
    url: 'https://platzi.com/cursos/react/',
    duration: '12 horas',
    rating: 4.8,
  },
  {
    id: 'typescript-platzi',
    name: 'Curso de TypeScript',
    platform: 'Platzi',
    skill: 'TypeScript',
    level: 'Intermedio',
    url: 'https://platzi.com/cursos/typescript/',
    duration: '10 horas',
    rating: 4.7,
  },
  {
    id: 'css-coursera',
    name: 'HTML, CSS, and Javascript for Web Developers',
    platform: 'Coursera',
    skill: 'CSS',
    level: 'Básico',
    url: 'https://www.coursera.org/learn/html-css-javascript-for-web-developers',
    duration: '40 horas',
    rating: 4.7,
    isFree: true,
  },

  // ─── Tech: backend ───
  {
    id: 'node-platzi',
    name: 'Curso de Node.js',
    platform: 'Platzi',
    skill: 'Node.js',
    level: 'Intermedio',
    url: 'https://platzi.com/cursos/nodejs/',
    duration: '15 horas',
    rating: 4.8,
  },
  {
    id: 'express-udemy',
    name: 'Node.js, Express y REST APIs',
    platform: 'Udemy',
    skill: 'Express',
    level: 'Intermedio',
    url: 'https://www.udemy.com/topic/express-js/',
    duration: '18 horas',
    rating: 4.6,
  },
  {
    id: 'rest-platzi',
    name: 'Curso Profesional de REST APIs',
    platform: 'Platzi',
    skill: 'REST APIs',
    level: 'Intermedio',
    url: 'https://platzi.com/cursos/rest-api/',
    duration: '8 horas',
    rating: 4.7,
  },
  {
    id: 'python-coursera',
    name: 'Python for Everybody Specialization',
    platform: 'Coursera',
    skill: 'Python',
    level: 'Básico',
    url: 'https://www.coursera.org/specializations/python',
    duration: '80 horas',
    rating: 4.8,
  },
  {
    id: 'postgresql-platzi',
    name: 'Curso de Fundamentos de Bases de Datos',
    platform: 'Platzi',
    skill: 'PostgreSQL',
    level: 'Básico',
    url: 'https://platzi.com/cursos/postgresql/',
    duration: '10 horas',
    rating: 4.7,
  },

  // ─── DevOps / Cloud ───
  {
    id: 'docker-platzi',
    name: 'Curso de Docker desde cero',
    platform: 'Platzi',
    skill: 'Docker',
    level: 'Básico',
    url: 'https://platzi.com/cursos/docker/',
    duration: '12 horas',
    rating: 4.8,
  },
  {
    id: 'kubernetes-udemy',
    name: 'Kubernetes for the Absolute Beginners',
    platform: 'Udemy',
    skill: 'Kubernetes',
    level: 'Intermedio',
    url: 'https://www.udemy.com/topic/kubernetes/',
    duration: '20 horas',
    rating: 4.7,
  },
  {
    id: 'aws-skillbuilder',
    name: 'AWS Certified Cloud Practitioner Essentials',
    platform: 'AWS Skill Builder',
    skill: 'AWS',
    level: 'Básico',
    url: 'https://skillbuilder.aws/',
    duration: '30 horas',
    rating: 4.6,
    isFree: true,
    isCertification: true,
  },
  {
    id: 'terraform-platzi',
    name: 'Curso de Terraform',
    platform: 'Platzi',
    skill: 'Terraform',
    level: 'Intermedio',
    url: 'https://platzi.com/cursos/terraform/',
    duration: '14 horas',
    rating: 4.7,
  },
  {
    id: 'cicd-coursera',
    name: 'Continuous Integration and Continuous Delivery (CI/CD)',
    platform: 'Coursera',
    skill: 'CI/CD',
    level: 'Intermedio',
    url: 'https://www.coursera.org/learn/continuous-integration',
    duration: '25 horas',
    rating: 4.6,
  },

  // ─── Tooling general ───
  {
    id: 'git-platzi',
    name: 'Curso Profesional de Git y GitHub',
    platform: 'Platzi',
    skill: 'Git',
    level: 'Básico',
    url: 'https://platzi.com/cursos/git-github/',
    duration: '8 horas',
    rating: 4.9,
    isFree: true,
  },

  // ─── QA / Testing ───
  {
    id: 'selenium-udemy',
    name: 'Selenium WebDriver con Java',
    platform: 'Udemy',
    skill: 'Selenium',
    level: 'Intermedio',
    url: 'https://www.udemy.com/topic/selenium-webdriver/',
    duration: '22 horas',
    rating: 4.6,
  },
  {
    id: 'cypress-platzi',
    name: 'Curso de Cypress',
    platform: 'Platzi',
    skill: 'Cypress',
    level: 'Intermedio',
    url: 'https://platzi.com/cursos/cypress/',
    duration: '7 horas',
    rating: 4.7,
  },

  // ─── Datos / BI ───
  {
    id: 'powerbi-cibertec',
    name: 'Power BI desde cero',
    platform: 'Cibertec',
    skill: 'Power BI',
    level: 'Básico',
    url: 'https://www.cibertec.edu.pe/extension-profesional/cursos-cortos/power-bi/',
    duration: '15 horas',
    rating: 4.6,
  },
  {
    id: 'tableau-coursera',
    name: 'Data Visualization with Tableau',
    platform: 'Coursera',
    skill: 'Tableau',
    level: 'Intermedio',
    url: 'https://www.coursera.org/specializations/data-visualization',
    duration: '40 horas',
    rating: 4.7,
  },
  {
    id: 'sql-platzi',
    name: 'Curso de SQL y MySQL',
    platform: 'Platzi',
    skill: 'SQL',
    level: 'Básico',
    url: 'https://platzi.com/cursos/sql-mysql/',
    duration: '12 horas',
    rating: 4.8,
  },

  // ─── Gestión y certificaciones ───
  {
    id: 'psm-scrumorg',
    name: 'Professional Scrum Master I (PSM I)',
    platform: 'Scrum.org',
    skill: 'PSM I/II',
    level: 'Intermedio',
    url: 'https://www.scrum.org/professional-scrum-master-i-certification',
    duration: '20 horas',
    rating: 4.9,
    isCertification: true,
  },
  {
    id: 'pmp-pmi',
    name: 'Project Management Professional (PMP)® Exam Prep',
    platform: 'PMI',
    skill: 'PMP',
    level: 'Avanzado',
    url: 'https://www.pmi.org/certifications/project-management-pmp',
    duration: '60 horas',
    rating: 4.8,
    isCertification: true,
  },
  {
    id: 'safe-coursera',
    name: 'SAFe® 6 Practitioner Fundamentals',
    platform: 'Coursera',
    skill: 'SAFe',
    level: 'Avanzado',
    url: 'https://www.coursera.org/learn/safe-agilist',
    duration: '30 horas',
    rating: 4.6,
    isCertification: true,
  },
  {
    id: 'pmi-fundamentos',
    name: 'Foundations of Project Management',
    platform: 'Coursera',
    skill: 'PMI',
    level: 'Básico',
    url: 'https://www.coursera.org/learn/project-management-foundations',
    duration: '14 horas',
    rating: 4.8,
  },
  {
    id: 'lean-edx',
    name: 'Lean Production',
    platform: 'edX',
    skill: 'Lean Manufacturing',
    level: 'Intermedio',
    url: 'https://www.edx.org/learn/lean-manufacturing',
    duration: '30 horas',
    rating: 4.7,
  },
  {
    id: 'sixsigma-coursera',
    name: 'Six Sigma Yellow Belt Specialization',
    platform: 'Coursera',
    skill: 'Six Sigma',
    level: 'Intermedio',
    url: 'https://www.coursera.org/specializations/six-sigma-yellow-belt',
    duration: '50 horas',
    rating: 4.6,
    isCertification: true,
  },

  // ─── Idiomas / blandas ───
  {
    id: 'ingles-britanico',
    name: 'Inglés para Profesionales',
    platform: 'Británico',
    skill: 'Inglés avanzado',
    level: 'Avanzado',
    url: 'https://www.britanico.edu.pe/cursos/ingles/adultos/',
    duration: '40 horas',
    rating: 4.7,
  },
  {
    id: 'ingles-coursera',
    name: 'Business English Communication Skills',
    platform: 'Coursera',
    skill: 'Inglés avanzado',
    level: 'Intermedio',
    url: 'https://www.coursera.org/specializations/business-english',
    duration: '60 horas',
    rating: 4.7,
  },

  // ─── Diseño ───
  {
    id: 'figma-platzi',
    name: 'Curso de Diseño UX con Figma',
    platform: 'Platzi',
    skill: 'Figma',
    level: 'Básico',
    url: 'https://platzi.com/cursos/figma/',
    duration: '10 horas',
    rating: 4.8,
  },
  {
    id: 'designsystems-coursera',
    name: 'Design Systems Fundamentals',
    platform: 'Coursera',
    skill: 'Design Systems',
    level: 'Intermedio',
    url: 'https://www.coursera.org/learn/design-systems',
    duration: '20 horas',
    rating: 4.6,
  },

  // ─── Marketing / negocio ───
  {
    id: 'googleads-skillshop',
    name: 'Certificación de Google Ads – Búsqueda',
    platform: 'Google Cloud Skills',
    skill: 'Google Ads',
    level: 'Intermedio',
    url: 'https://skillshop.exceedlms.com/student/path/18128',
    duration: '8 horas',
    rating: 4.7,
    isFree: true,
    isCertification: true,
  },
  {
    id: 'metaads-platzi',
    name: 'Curso de Meta Ads',
    platform: 'Platzi',
    skill: 'Meta Ads',
    level: 'Intermedio',
    url: 'https://platzi.com/cursos/meta-ads/',
    duration: '6 horas',
    rating: 4.6,
  },
  {
    id: 'seo-coursera',
    name: 'Search Engine Optimization (SEO) Specialization',
    platform: 'Coursera',
    skill: 'SEO',
    level: 'Intermedio',
    url: 'https://www.coursera.org/specializations/seo',
    duration: '50 horas',
    rating: 4.6,
  },

  // ─── Soporte / Redes ───
  {
    id: 'ccna-ciscou',
    name: 'CCNA: Introduction to Networks',
    platform: 'edX',
    skill: 'CCNA',
    level: 'Intermedio',
    url: 'https://www.edx.org/learn/networking',
    duration: '70 horas',
    rating: 4.7,
    isCertification: true,
  },
  {
    id: 'itil-coursera',
    name: 'ITIL 4 Foundation',
    platform: 'Coursera',
    skill: 'ITIL',
    level: 'Básico',
    url: 'https://www.coursera.org/learn/itil-4-foundation',
    duration: '20 horas',
    rating: 4.6,
    isCertification: true,
  },
];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface CourseRecommendation {
  course: Course;
  matchedSkill: string;
  demandCount: number;
  reason: string;
}

export function findCoursesForSkill(skill: string): Course[] {
  const key = normalize(skill);
  return COURSES.filter((c) => normalize(c.skill) === key);
}

export function recommendCoursesForGaps(
  gaps: { skill: string; demandCount: number }[],
): CourseRecommendation[] {
  const recs: CourseRecommendation[] = [];
  const seen = new Set<string>();
  for (const gap of gaps) {
    const matches = findCoursesForSkill(gap.skill);
    for (const c of matches) {
      if (seen.has(c.id)) continue;
      seen.add(c.id);
      recs.push({
        course: c,
        matchedSkill: gap.skill,
        demandCount: gap.demandCount,
        reason: `Para cubrir ${gap.skill} (pedida en ${gap.demandCount} vacante${
          gap.demandCount === 1 ? '' : 's'
        })`,
      });
    }
  }
  return recs.sort((a, b) => b.demandCount - a.demandCount);
}

export function getUniquePlatforms(): CoursePlatform[] {
  return Array.from(new Set(COURSES.map((c) => c.platform))) as CoursePlatform[];
}
