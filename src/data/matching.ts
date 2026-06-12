import type { Vacancy } from './vacancies';
import type { UserProfile } from './userProfile';

export interface MatchBreakdown {
  skillsScore: number;
  experienceScore: number;
  modalidadScore: number;
  locationScore: number;
}

export interface MatchResult {
  vacancy: Vacancy;
  score: number;
  breakdown: MatchBreakdown;
  matchedRequiredSkills: string[];
  missingRequiredSkills: string[];
  matchedNiceToHaveSkills: string[];
}

export const MATCH_WEIGHTS = {
  skills: 0.5,
  experience: 0.25,
  modalidad: 0.15,
  location: 0.1,
} as const;

const REQUIRED_VS_NICE_WEIGHT = 0.8;

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildUserSkillSet(profile: UserProfile): Set<string> {
  const all = [...profile.technicalSkills, ...profile.softSkills];
  return new Set(all.map(normalize));
}

function matchSkills(required: string[], userSet: Set<string>) {
  const matched: string[] = [];
  const missing: string[] = [];
  for (const skill of required) {
    if (userSet.has(normalize(skill))) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }
  return { matched, missing };
}

function calcSkillsScore(
  matchedReq: number,
  totalReq: number,
  matchedNice: number,
  totalNice: number,
): number {
  if (totalReq === 0 && totalNice === 0) return 100;
  const reqRatio = totalReq === 0 ? 1 : matchedReq / totalReq;
  if (totalNice === 0) return Math.round(reqRatio * 100);
  const niceRatio = matchedNice / totalNice;
  return Math.round(
    reqRatio * REQUIRED_VS_NICE_WEIGHT * 100 +
      niceRatio * (1 - REQUIRED_VS_NICE_WEIGHT) * 100,
  );
}

function calcExperienceScore(userYears: number, minYears: number): number {
  if (minYears === 0) return 100;
  if (userYears >= minYears) return 100;
  return Math.round((userYears / minYears) * 100);
}

function calcModalidadScore(
  preferred: UserProfile['preferredModalidades'],
  vacancyModalidad: Vacancy['modalidad'],
): number {
  if (preferred.length === 0) return 100;
  return preferred.includes(vacancyModalidad) ? 100 : 40;
}

function calcLocationScore(profile: UserProfile, vacancy: Vacancy): number {
  if (vacancy.modalidad === 'Remoto') return 100;
  if (profile.preferredLocations.length === 0) return 100;
  if (profile.preferredLocations.includes(vacancy.location)) return 100;
  return 30;
}

export function calculateMatch(
  profile: UserProfile,
  vacancy: Vacancy,
): MatchResult {
  const userSet = buildUserSkillSet(profile);

  const reqMatch = matchSkills(vacancy.requiredSkills, userSet);
  const niceList = vacancy.niceToHaveSkills ?? [];
  const niceMatch = matchSkills(niceList, userSet);

  const skillsScore = calcSkillsScore(
    reqMatch.matched.length,
    vacancy.requiredSkills.length,
    niceMatch.matched.length,
    niceList.length,
  );
  const experienceScore = calcExperienceScore(
    profile.yearsExperience,
    vacancy.experienciaMinimaAnios,
  );
  const modalidadScore = calcModalidadScore(
    profile.preferredModalidades,
    vacancy.modalidad,
  );
  const locationScore = calcLocationScore(profile, vacancy);

  const score = Math.round(
    skillsScore * MATCH_WEIGHTS.skills +
      experienceScore * MATCH_WEIGHTS.experience +
      modalidadScore * MATCH_WEIGHTS.modalidad +
      locationScore * MATCH_WEIGHTS.location,
  );

  return {
    vacancy,
    score,
    breakdown: {
      skillsScore,
      experienceScore,
      modalidadScore,
      locationScore,
    },
    matchedRequiredSkills: reqMatch.matched,
    missingRequiredSkills: reqMatch.missing,
    matchedNiceToHaveSkills: niceMatch.matched,
  };
}

export function calculateAllMatches(
  profile: UserProfile,
  vacancies: Vacancy[],
): MatchResult[] {
  return vacancies
    .map((v) => calculateMatch(profile, v))
    .sort((a, b) => b.score - a.score);
}

export interface MissingSkillAgg {
  skill: string;
  count: number;
  priority: 'Alta' | 'Media' | 'Baja';
}

export interface SkillGapEntry {
  skill: string;
  status: 'Detectada' | 'Faltante';
  requiredInCount: number;
  niceToHaveInCount: number;
  totalDemand: number;
  topVacancies: string[];
}

export function analyzeSkillGap(
  profile: UserProfile,
  vacancies: Vacancy[],
): SkillGapEntry[] {
  const userSet = buildUserSkillSet(profile);
  const entries = new Map<
    string,
    {
      skill: string;
      requiredInCount: number;
      niceToHaveInCount: number;
      vacancyTitles: string[];
    }
  >();

  const upsert = (skill: string, vacancyTitle: string, isRequired: boolean) => {
    const key = normalize(skill);
    const existing = entries.get(key);
    if (existing) {
      if (isRequired) existing.requiredInCount += 1;
      else existing.niceToHaveInCount += 1;
      if (existing.vacancyTitles.length < 5) {
        existing.vacancyTitles.push(vacancyTitle);
      }
    } else {
      entries.set(key, {
        skill,
        requiredInCount: isRequired ? 1 : 0,
        niceToHaveInCount: isRequired ? 0 : 1,
        vacancyTitles: [vacancyTitle],
      });
    }
  };

  for (const v of vacancies) {
    for (const s of v.requiredSkills) upsert(s, v.title, true);
    for (const s of v.niceToHaveSkills ?? []) upsert(s, v.title, false);
  }

  return Array.from(entries.values())
    .map((e) => {
      const totalDemand = e.requiredInCount + e.niceToHaveInCount;
      const status: 'Detectada' | 'Faltante' = userSet.has(normalize(e.skill))
        ? 'Detectada'
        : 'Faltante';
      return {
        skill: e.skill,
        status,
        requiredInCount: e.requiredInCount,
        niceToHaveInCount: e.niceToHaveInCount,
        totalDemand,
        topVacancies: e.vacancyTitles.slice(0, 3),
      };
    })
    .sort((a, b) => b.totalDemand - a.totalDemand);
}

export function aggregateMissingSkills(
  matches: MatchResult[],
  limit = 6,
): MissingSkillAgg[] {
  const map = new Map<string, number>();
  for (const m of matches) {
    for (const skill of m.missingRequiredSkills) {
      map.set(skill, (map.get(skill) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([skill, count]) => ({
      skill,
      count,
      priority:
        count >= 4
          ? ('Alta' as const)
          : count >= 2
          ? ('Media' as const)
          : ('Baja' as const),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export interface ProfileScoreBreakdown {
  skillsBreadth: number;
  experience: number;
  marketFit: number;
  compatibilityBreadth: number;
}

export interface ProfileScore {
  total: number;
  breakdown: ProfileScoreBreakdown;
}

export function calculateProfileScore(
  profile: UserProfile,
  matches: MatchResult[],
): ProfileScore {
  const totalSkills =
    profile.technicalSkills.length + profile.softSkills.length;
  const skillsBreadth = Math.round(Math.min(totalSkills / 15, 1) * 20);

  const experience = Math.round(
    Math.min(profile.yearsExperience / 5, 1) * 20,
  );

  const topN = matches.slice(0, 5);
  const avgTop =
    topN.length === 0
      ? 0
      : topN.reduce((s, m) => s + m.score, 0) / topN.length;
  const marketFit = Math.round((avgTop / 100) * 50);

  const compatibleCount = matches.filter((m) => m.score >= 60).length;
  const compatibilityBreadth = Math.round(
    matches.length === 0 ? 0 : (compatibleCount / matches.length) * 10,
  );

  const total =
    skillsBreadth + experience + marketFit + compatibilityBreadth;

  return {
    total,
    breakdown: {
      skillsBreadth,
      experience,
      marketFit,
      compatibilityBreadth,
    },
  };
}

export function matchBucket(score: number): 'excellent' | 'good' | 'fair' | 'low' {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 55) return 'fair';
  return 'low';
}

export function matchBadgeClasses(score: number): string {
  const b = matchBucket(score);
  if (b === 'excellent') return 'bg-green-100 text-green-700';
  if (b === 'good') return 'bg-blue-100 text-blue-700';
  if (b === 'fair') return 'bg-purple-100 text-purple-700';
  return 'bg-gray-100 text-gray-600';
}

export function matchLabel(score: number): string {
  const b = matchBucket(score);
  if (b === 'excellent') return 'Match excelente';
  if (b === 'good') return 'Buen match';
  if (b === 'fair') return 'Match parcial';
  return 'Match bajo';
}
