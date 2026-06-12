export type Modalidad = 'Presencial' | 'Remoto' | 'Híbrido';

export type NivelExperiencia =
  | 'Sin experiencia'
  | 'Junior'
  | 'Semi-senior'
  | 'Senior'
  | 'Líder';

export type TipoContrato =
  | 'Tiempo completo'
  | 'Tiempo parcial'
  | 'Prácticas'
  | 'Freelance';

export type Moneda = 'PEN' | 'USD';

export interface RangoSalarial {
  min: number;
  max: number;
  moneda: Moneda;
}

export interface Vacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  modalidad: Modalidad;
  salary?: RangoSalarial;
  contractType: TipoContrato;
  requiredSkills: string[];
  niceToHaveSkills?: string[];
  experienciaMinimaAnios: number;
  experienciaNivel: NivelExperiencia;
  description: string;
  responsibilities: string[];
  industry: string;
  postedAt: string;
}

export const VACANCIES: Vacancy[] = [
  {
    id: 'pm-ti-interbank',
    title: 'Project Manager TI',
    company: 'Interbank',
    location: 'Lima, Perú',
    modalidad: 'Híbrido',
    salary: { min: 6500, max: 9000, moneda: 'PEN' },
    contractType: 'Tiempo completo',
    requiredSkills: ['Scrum', 'Gestión de equipos', 'Agile', 'JIRA', 'Comunicación'],
    niceToHaveSkills: ['PMP', 'Inglés intermedio', 'SAFe'],
    experienciaMinimaAnios: 4,
    experienciaNivel: 'Semi-senior',
    description:
      'Lidera proyectos de transformación digital del área de banca digital, asegurando entregas a tiempo y alineadas con los objetivos del negocio.',
    responsibilities: [
      'Planificar sprints y coordinar ceremonias ágiles',
      'Gestionar el roadmap y dependencias entre squads',
      'Reportar avances y riesgos a stakeholders ejecutivos',
      'Identificar oportunidades de mejora continua',
    ],
    industry: 'Banca y finanzas',
    postedAt: '2026-06-05',
  },
  {
    id: 'coord-proyectos-yura',
    title: 'Coordinador de Proyectos',
    company: 'Yura S.A.',
    location: 'Arequipa, Perú',
    modalidad: 'Presencial',
    salary: { min: 4000, max: 6000, moneda: 'PEN' },
    contractType: 'Tiempo completo',
    requiredSkills: [
      'Liderazgo',
      'Planificación',
      'Reportes',
      'Microsoft Project',
      'Negociación',
    ],
    niceToHaveSkills: ['Excel avanzado', 'Lean', 'Six Sigma'],
    experienciaMinimaAnios: 3,
    experienciaNivel: 'Semi-senior',
    description:
      'Coordina proyectos de mejora operativa en planta industrial, articulando equipos multidisciplinarios y cumpliendo KPIs de producción.',
    responsibilities: [
      'Elaborar cronogramas y planes de trabajo',
      'Supervisar avances en campo y reportar KPIs',
      'Coordinar con proveedores y contratistas',
      'Asegurar cumplimiento de estándares de calidad',
    ],
    industry: 'Industrial / Cemento',
    postedAt: '2026-06-08',
  },
  {
    id: 'jefe-proyectos-credicorp',
    title: 'Jefe de Proyectos TI',
    company: 'Credicorp',
    location: 'Lima, Perú',
    modalidad: 'Híbrido',
    salary: { min: 8000, max: 11000, moneda: 'PEN' },
    contractType: 'Tiempo completo',
    requiredSkills: [
      'Metodologías ágiles',
      'Gestión',
      'Innovación',
      'Liderazgo',
      'PMI',
    ],
    niceToHaveSkills: ['Inglés avanzado', 'MBA', 'Cloud (AWS/Azure)'],
    experienciaMinimaAnios: 5,
    experienciaNivel: 'Senior',
    description:
      'Conduce iniciativas estratégicas del portafolio TI corporativo, liderando equipos de hasta 30 personas y articulando con la alta dirección.',
    responsibilities: [
      'Definir la estrategia y roadmap del portafolio',
      'Gestionar presupuesto y proveedores',
      'Liderar equipos cross-funcionales',
      'Reportar a comité ejecutivo',
    ],
    industry: 'Banca y finanzas',
    postedAt: '2026-05-30',
  },
  {
    id: 'analista-proyectos-backus',
    title: 'Analista de Proyectos',
    company: 'Backus',
    location: 'Arequipa, Perú',
    modalidad: 'Presencial',
    salary: { min: 3500, max: 5500, moneda: 'PEN' },
    contractType: 'Tiempo completo',
    requiredSkills: ['Scrum', 'Reportes', 'KPIs', 'Excel avanzado', 'Power BI'],
    niceToHaveSkills: ['SAP', 'Inglés intermedio'],
    experienciaMinimaAnios: 2,
    experienciaNivel: 'Semi-senior',
    description:
      'Apoya la gestión del portafolio de proyectos de la planta de Arequipa, midiendo desempeño y proponiendo mejoras basadas en datos.',
    responsibilities: [
      'Construir dashboards de seguimiento',
      'Analizar desviaciones del plan',
      'Documentar procesos y lecciones aprendidas',
      'Coordinar con áreas operativas',
    ],
    industry: 'Bebidas y consumo masivo',
    postedAt: '2026-06-02',
  },
  {
    id: 'frontend-rappi',
    title: 'Desarrollador Frontend React',
    company: 'Rappi',
    location: 'Lima, Perú',
    modalidad: 'Remoto',
    salary: { min: 5500, max: 8000, moneda: 'PEN' },
    contractType: 'Tiempo completo',
    requiredSkills: ['React', 'TypeScript', 'CSS', 'Git', 'REST APIs'],
    niceToHaveSkills: ['Next.js', 'Testing (Jest/RTL)', 'Inglés intermedio'],
    experienciaMinimaAnios: 2,
    experienciaNivel: 'Semi-senior',
    description:
      'Desarrolla interfaces de alto rendimiento para la app de delivery, colaborando con producto y diseño en un ambiente ágil.',
    responsibilities: [
      'Implementar nuevas features en React + TypeScript',
      'Optimizar tiempos de carga y experiencia mobile',
      'Realizar code reviews',
      'Participar en ceremonias del squad',
    ],
    industry: 'Tecnología / Delivery',
    postedAt: '2026-06-09',
  },
  {
    id: 'backend-belatrix',
    title: 'Desarrollador Backend Node.js',
    company: 'Belatrix Software',
    location: 'Arequipa, Perú',
    modalidad: 'Híbrido',
    salary: { min: 5000, max: 7500, moneda: 'PEN' },
    contractType: 'Tiempo completo',
    requiredSkills: ['Node.js', 'Express', 'PostgreSQL', 'Git', 'REST APIs'],
    niceToHaveSkills: ['Docker', 'AWS', 'TypeScript'],
    experienciaMinimaAnios: 2,
    experienciaNivel: 'Semi-senior',
    description:
      'Diseña y desarrolla microservicios para clientes internacionales del sector fintech, aplicando buenas prácticas de arquitectura.',
    responsibilities: [
      'Construir APIs REST y endpoints seguros',
      'Diseñar modelos de datos relacionales',
      'Escribir pruebas unitarias e integración',
      'Colaborar con equipos remotos en inglés',
    ],
    industry: 'Tecnología / Software',
    postedAt: '2026-06-07',
  },
  {
    id: 'data-analyst-cerro-verde',
    title: 'Data Analyst',
    company: 'Sociedad Minera Cerro Verde',
    location: 'Arequipa, Perú',
    modalidad: 'Presencial',
    salary: { min: 4500, max: 6500, moneda: 'PEN' },
    contractType: 'Tiempo completo',
    requiredSkills: ['SQL', 'Power BI', 'Excel avanzado', 'Python', 'Estadística'],
    niceToHaveSkills: ['Tableau', 'Inglés intermedio', 'R'],
    experienciaMinimaAnios: 2,
    experienciaNivel: 'Semi-senior',
    description:
      'Analiza datos operativos de mina y planta para apoyar la toma de decisiones del área de operaciones.',
    responsibilities: [
      'Construir reportes y tableros en Power BI',
      'Modelar datos y limpiar fuentes',
      'Apoyar análisis de productividad',
      'Documentar metodologías y supuestos',
    ],
    industry: 'Minería',
    postedAt: '2026-06-04',
  },
  {
    id: 'qa-automation-bcp',
    title: 'QA Automation Engineer',
    company: 'BCP',
    location: 'Lima, Perú',
    modalidad: 'Remoto',
    salary: { min: 5000, max: 7000, moneda: 'PEN' },
    contractType: 'Tiempo completo',
    requiredSkills: ['Selenium', 'Cypress', 'JavaScript', 'JIRA', 'Testing'],
    niceToHaveSkills: ['Postman', 'CI/CD', 'Performance testing'],
    experienciaMinimaAnios: 3,
    experienciaNivel: 'Semi-senior',
    description:
      'Automatiza pruebas funcionales y de regresión para los canales digitales del banco, asegurando releases sin defectos.',
    responsibilities: [
      'Diseñar suites de pruebas automatizadas',
      'Mantener frameworks de testing existentes',
      'Reportar y dar seguimiento a bugs',
      'Integrar pruebas en pipelines CI/CD',
    ],
    industry: 'Banca y finanzas',
    postedAt: '2026-06-06',
  },
  {
    id: 'devops-globant',
    title: 'DevOps Engineer',
    company: 'Globant',
    location: 'Arequipa, Perú',
    modalidad: 'Híbrido',
    salary: { min: 7000, max: 10000, moneda: 'PEN' },
    contractType: 'Tiempo completo',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    niceToHaveSkills: ['Azure', 'GCP', 'Inglés avanzado'],
    experienciaMinimaAnios: 4,
    experienciaNivel: 'Senior',
    description:
      'Implementa y mantiene infraestructura cloud para clientes internacionales, asegurando alta disponibilidad y costos optimizados.',
    responsibilities: [
      'Diseñar pipelines de despliegue continuo',
      'Provisionar infraestructura como código',
      'Monitorear y responder a incidentes',
      'Asesorar a equipos de desarrollo en buenas prácticas',
    ],
    industry: 'Tecnología / Software',
    postedAt: '2026-06-01',
  },
  {
    id: 'ux-ui-falabella',
    title: 'UX/UI Designer',
    company: 'Falabella',
    location: 'Lima, Perú',
    modalidad: 'Remoto',
    salary: { min: 4500, max: 7000, moneda: 'PEN' },
    contractType: 'Tiempo completo',
    requiredSkills: ['Figma', 'Design Systems', 'Investigación de usuario', 'Prototipado', 'UX writing'],
    niceToHaveSkills: ['HTML/CSS básico', 'Inglés intermedio', 'Motion design'],
    experienciaMinimaAnios: 2,
    experienciaNivel: 'Semi-senior',
    description:
      'Diseña experiencias de e-commerce centradas en el usuario, colaborando con producto y desarrollo para llevar ideas a producción.',
    responsibilities: [
      'Realizar entrevistas y pruebas de usabilidad',
      'Diseñar wireframes, mockups y prototipos',
      'Mantener el design system corporativo',
      'Validar implementaciones con devs',
    ],
    industry: 'Retail / E-commerce',
    postedAt: '2026-06-03',
  },
  {
    id: 'analista-sistemas-caja-arequipa',
    title: 'Analista de Sistemas',
    company: 'Caja Arequipa',
    location: 'Arequipa, Perú',
    modalidad: 'Presencial',
    salary: { min: 3800, max: 5200, moneda: 'PEN' },
    contractType: 'Tiempo completo',
    requiredSkills: ['SQL', 'Análisis funcional', 'Levantamiento de requerimientos', 'UML', 'Documentación'],
    niceToHaveSkills: ['Power BI', 'Python', 'BPMN'],
    experienciaMinimaAnios: 2,
    experienciaNivel: 'Semi-senior',
    description:
      'Analiza y documenta requerimientos funcionales para los sistemas core de microfinanzas, sirviendo de puente entre negocio y TI.',
    responsibilities: [
      'Levantar y documentar requerimientos',
      'Modelar procesos de negocio',
      'Validar entregables con usuarios',
      'Apoyar pruebas de aceptación',
    ],
    industry: 'Microfinanzas',
    postedAt: '2026-05-28',
  },
  {
    id: 'ing-industrial-cementos-yura',
    title: 'Ingeniero Industrial',
    company: 'Cementos Yura',
    location: 'Arequipa, Perú',
    modalidad: 'Presencial',
    salary: { min: 4200, max: 6000, moneda: 'PEN' },
    contractType: 'Tiempo completo',
    requiredSkills: ['Lean Manufacturing', 'Six Sigma', 'Excel avanzado', 'KPIs', 'Mejora continua'],
    niceToHaveSkills: ['Minitab', 'AutoCAD', 'SAP'],
    experienciaMinimaAnios: 2,
    experienciaNivel: 'Semi-senior',
    description:
      'Lidera proyectos de optimización en planta cementera, identificando oportunidades de mejora en procesos productivos.',
    responsibilities: [
      'Mapear procesos productivos',
      'Diseñar e implementar mejoras Lean',
      'Medir y reportar indicadores de productividad',
      'Capacitar a equipos operativos',
    ],
    industry: 'Industrial / Cemento',
    postedAt: '2026-06-01',
  },
  {
    id: 'marketing-digital-plaza-vea',
    title: 'Especialista en Marketing Digital',
    company: 'Plaza Vea',
    location: 'Arequipa, Perú',
    modalidad: 'Híbrido',
    salary: { min: 3500, max: 5000, moneda: 'PEN' },
    contractType: 'Tiempo completo',
    requiredSkills: ['Google Ads', 'Meta Ads', 'SEO', 'Analytics', 'Copywriting'],
    niceToHaveSkills: ['HubSpot', 'Diseño básico', 'Email marketing'],
    experienciaMinimaAnios: 2,
    experienciaNivel: 'Semi-senior',
    description:
      'Diseña y ejecuta campañas digitales regionales para captar tráfico y conversiones en la tienda online.',
    responsibilities: [
      'Planificar campañas de paid media',
      'Optimizar presupuestos y rendimiento',
      'Analizar métricas y reportar ROI',
      'Coordinar con agencias creativas',
    ],
    industry: 'Retail',
    postedAt: '2026-06-05',
  },
  {
    id: 'practicante-rrhh-sodimac',
    title: 'Practicante de Recursos Humanos',
    company: 'Sodimac',
    location: 'Arequipa, Perú',
    modalidad: 'Presencial',
    salary: { min: 1200, max: 1500, moneda: 'PEN' },
    contractType: 'Prácticas',
    requiredSkills: ['Excel', 'Comunicación', 'Organización', 'Trabajo en equipo'],
    niceToHaveSkills: ['Power Point', 'Reclutamiento básico'],
    experienciaMinimaAnios: 0,
    experienciaNivel: 'Sin experiencia',
    description:
      'Apoya las actividades del equipo de Talento Humano en procesos de selección, capacitación y clima laboral.',
    responsibilities: [
      'Apoyar en convocatorias y entrevistas',
      'Coordinar capacitaciones internas',
      'Mantener actualizada la base de colaboradores',
      'Colaborar en actividades de clima',
    ],
    industry: 'Retail / Construcción',
    postedAt: '2026-06-10',
  },
  {
    id: 'soporte-ti-movistar',
    title: 'Especialista en Soporte Técnico',
    company: 'Movistar Perú',
    location: 'Arequipa, Perú',
    modalidad: 'Híbrido',
    salary: { min: 2800, max: 3800, moneda: 'PEN' },
    contractType: 'Tiempo completo',
    requiredSkills: ['Soporte N1/N2', 'Redes', 'Windows Server', 'Atención al cliente', 'ITIL'],
    niceToHaveSkills: ['CCNA', 'Linux básico', 'Active Directory'],
    experienciaMinimaAnios: 1,
    experienciaNivel: 'Junior',
    description:
      'Atiende y resuelve incidentes técnicos de clientes corporativos, asegurando tiempos de respuesta dentro de SLA.',
    responsibilities: [
      'Atender tickets en mesa de ayuda',
      'Escalar incidentes a niveles superiores',
      'Documentar soluciones en base de conocimiento',
      'Brindar soporte remoto y presencial',
    ],
    industry: 'Telecomunicaciones',
    postedAt: '2026-06-08',
  },
  {
    id: 'scrum-master-ibm',
    title: 'Scrum Master',
    company: 'IBM Perú',
    location: 'Lima, Perú',
    modalidad: 'Remoto',
    salary: { min: 7000, max: 10000, moneda: 'PEN' },
    contractType: 'Tiempo completo',
    requiredSkills: ['Scrum', 'Kanban', 'Coaching', 'Facilitación', 'JIRA'],
    niceToHaveSkills: ['PSM I/II', 'SAFe', 'Inglés avanzado'],
    experienciaMinimaAnios: 4,
    experienciaNivel: 'Senior',
    description:
      'Facilita prácticas ágiles a equipos de desarrollo distribuidos, ayudándolos a mejorar continuamente su forma de trabajar.',
    responsibilities: [
      'Facilitar ceremonias ágiles',
      'Eliminar impedimentos del equipo',
      'Coachear a Product Owners y stakeholders',
      'Medir y mejorar métricas de equipo',
    ],
    industry: 'Tecnología / Consultoría',
    postedAt: '2026-05-25',
  },
];

export function formatSalary(s?: RangoSalarial): string {
  if (!s) return 'A convenir';
  const symbol = s.moneda === 'USD' ? 'US$' : 'S/';
  const fmt = (n: number) => n.toLocaleString('es-PE');
  return `${symbol} ${fmt(s.min)} - ${symbol} ${fmt(s.max)}`;
}

export function getVacancyById(id: string): Vacancy | undefined {
  return VACANCIES.find((v) => v.id === id);
}

export function getUniqueLocations(): string[] {
  return Array.from(new Set(VACANCIES.map((v) => v.location))).sort();
}

export function getUniqueModalidades(): Modalidad[] {
  return Array.from(new Set(VACANCIES.map((v) => v.modalidad))) as Modalidad[];
}
