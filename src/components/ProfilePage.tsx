import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  User,
  Mail,
  MapPin,
  GraduationCap,
  FileText,
  Sparkles,
  Briefcase,
  CreditCard,
  Edit,
  Save,
  X,
  Plus,
  Upload,
  Calendar,
  Crown,
  CheckCircle2,
} from 'lucide-react';
import {
  type UserProfile,
  type AcademicStatus,
  type SubscriptionPlan,
} from '../data/userProfile';
import type { Modalidad } from '../data/vacancies';
import type { NotificationCenter } from '../data/notifications';
import type { Screen } from '../hooks/useRouter';
import { AppHeader } from './AppHeader';

interface ProfilePageProps {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  /** Perfil real del usuario (análisis guardado + ediciones previas). */
  profile: UserProfile;
  /** Persiste los cambios en el backend. */
  onSave: (profile: UserProfile) => void;
  notificationCenter: NotificationCenter;
}

const MODALIDADES: Modalidad[] = ['Presencial', 'Remoto', 'Híbrido'];
const STATUSES: AcademicStatus[] = ['En curso', 'Egresado', 'Titulado'];

type SectionId =
  | 'personal'
  | 'education'
  | 'cv'
  | 'skills'
  | 'preferences'
  | 'plan';

function ChipList({
  items,
  onRemove,
  className,
}: {
  items: string[];
  onRemove?: (idx: number) => void;
  className: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, idx) => (
        <span
          key={`${item}-${idx}`}
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${className}`}
        >
          {item}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="hover:opacity-70"
            >
              <X size={12} />
            </button>
          )}
        </span>
      ))}
      {items.length === 0 && (
        <span className="text-gray-500 text-sm">Sin elementos</span>
      )}
    </div>
  );
}

function ChipInput({
  onAdd,
  placeholder,
}: {
  onAdd: (value: string) => void;
  placeholder: string;
}) {
  const [value, setValue] = useState('');
  const submit = () => {
    const trimmed = value.trim();
    if (trimmed) onAdd(trimmed);
    setValue('');
  };
  return (
    <div className="flex items-center gap-2 mt-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={placeholder}
        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 outline-none text-gray-900"
      />
      <button
        type="button"
        onClick={submit}
        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-1"
      >
        <Plus size={14} />
        Añadir
      </button>
    </div>
  );
}

export function ProfilePage({
  onBack,
  onNavigate,
  onLogout,
  profile: savedProfile,
  onSave,
  notificationCenter,
}: ProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile>(savedProfile);
  const [editing, setEditing] = useState<SectionId | null>(null);
  const [draft, setDraft] = useState<UserProfile>(savedProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // El perfil llega de forma asíncrona (sincronización con el backend):
  // se refresca mientras el usuario no esté editando, para no pisarle los cambios.
  useEffect(() => {
    if (editing === null) {
      setProfile(savedProfile);
      setDraft(savedProfile);
    }
  }, [savedProfile, editing]);

  /** Actualiza el estado local y persiste en el backend. */
  const commit = (next: UserProfile) => {
    setProfile(next);
    onSave(next);
  };

  const startEdit = (section: SectionId) => {
    setDraft(profile);
    setEditing(section);
  };
  const cancelEdit = () => {
    setEditing(null);
    setDraft(profile);
  };
  const saveEdit = () => {
    commit(draft);
    setEditing(null);
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    commit({
      ...profile,
      cvFile: {
        name: file.name,
        sizeKB: Math.round(file.size / 1024),
        uploadedAt: new Date().toISOString().slice(0, 10),
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        onNavigate={onNavigate}
        onLogout={onLogout}
        notificationCenter={notificationCenter}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={18} />
          Volver
        </button>
        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 flex items-start gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="text-white" size={32} />
          </div>
          <div className="flex-1">
            <h1
              className="text-gray-900 mb-1"
              style={{ fontSize: '24px', fontWeight: 700 }}
            >
              {profile.name}
            </h1>
            <p className="text-gray-600 mb-2">{profile.headline}</p>
            <div className="flex flex-wrap gap-3 text-gray-500 text-sm">
              <span className="inline-flex items-center gap-1">
                <MapPin size={14} />
                {profile.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Briefcase size={14} />
                {profile.yearsExperience} años de experiencia
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                  profile.plan === 'Premium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {profile.plan === 'Premium' && <Crown size={12} />}
                Plan {profile.plan}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 1: Datos personales */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="text-blue-600" size={20} />
              </div>
              <h2 className="text-gray-900">Datos personales</h2>
            </div>
            {editing !== 'personal' ? (
              <button
                onClick={() => startEdit('personal')}
                className="text-blue-600 hover:underline inline-flex items-center gap-1 text-sm"
              >
                <Edit size={14} />
                Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={cancelEdit}
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveEdit}
                  className="text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-sm inline-flex items-center gap-1"
                >
                  <Save size={14} />
                  Guardar
                </button>
              </div>
            )}
          </div>
          {editing !== 'personal' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm mb-1">Nombre completo</p>
                <p className="text-gray-900">{profile.name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Correo</p>
                <p className="text-gray-900 inline-flex items-center gap-2">
                  <Mail size={14} />
                  {profile.email}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-500 text-sm mb-1">Ubicación</p>
                <p className="text-gray-900 inline-flex items-center gap-2">
                  <MapPin size={14} />
                  {profile.location}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) =>
                    setDraft({ ...draft, name: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Correo
                </label>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) =>
                    setDraft({ ...draft, email: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-600 text-sm mb-1">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={draft.location}
                  onChange={(e) =>
                    setDraft({ ...draft, location: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: Formación */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-green-600" size={20} />
              </div>
              <h2 className="text-gray-900">Formación</h2>
            </div>
            {editing !== 'education' ? (
              <button
                onClick={() => startEdit('education')}
                className="text-blue-600 hover:underline inline-flex items-center gap-1 text-sm"
              >
                <Edit size={14} />
                Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={cancelEdit}
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveEdit}
                  className="text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-sm inline-flex items-center gap-1"
                >
                  <Save size={14} />
                  Guardar
                </button>
              </div>
            )}
          </div>
          {editing !== 'education' ? (
            <div className="space-y-2">
              <p className="text-gray-900">{profile.education.university}</p>
              <p className="text-gray-600">{profile.education.career}</p>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  {profile.education.status}
                </span>
                {profile.education.status === 'En curso' &&
                  profile.education.cycle && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                      Ciclo {profile.education.cycle}
                    </span>
                  )}
                {profile.education.graduationYear &&
                  profile.education.status !== 'En curso' && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full inline-flex items-center gap-1">
                      <Calendar size={12} />
                      Promoción {profile.education.graduationYear}
                    </span>
                  )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-600 text-sm mb-1">
                  Universidad / Instituto
                </label>
                <input
                  type="text"
                  value={draft.education.university}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      education: { ...draft.education, university: e.target.value },
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Carrera
                </label>
                <input
                  type="text"
                  value={draft.education.career}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      education: { ...draft.education, career: e.target.value },
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Estado
                </label>
                <select
                  value={draft.education.status}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      education: {
                        ...draft.education,
                        status: e.target.value as AcademicStatus,
                      },
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none bg-white"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              {draft.education.status === 'En curso' ? (
                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Ciclo actual
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    value={draft.education.cycle ?? ''}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        education: {
                          ...draft.education,
                          cycle: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        },
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Año de egreso
                  </label>
                  <input
                    type="number"
                    min={1980}
                    max={new Date().getFullYear()}
                    value={draft.education.graduationYear ?? ''}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        education: {
                          ...draft.education,
                          graduationYear: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        },
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION 3: CV cargado */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="text-purple-600" size={20} />
              </div>
              <h2 className="text-gray-900">CV cargado</h2>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:underline inline-flex items-center gap-1 text-sm"
            >
              <Upload size={14} />
              Cambiar CV
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelected}
              className="hidden"
            />
          </div>
          {profile.cvFile ? (
            <div className="border border-gray-200 rounded-lg p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="text-red-500" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-gray-900">{profile.cvFile.name}</p>
                <p className="text-gray-500 text-sm">
                  {profile.cvFile.sizeKB} KB · Subido el {profile.cvFile.uploadedAt}
                </p>
              </div>
              <CheckCircle2 className="text-green-600" size={20} />
            </div>
          ) : (
            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileText className="text-gray-400 mx-auto mb-2" size={32} />
              <p className="text-gray-600 mb-3">No hay CV cargado todavía</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Upload size={16} />
                Subir CV
              </button>
            </div>
          )}
        </div>

        {/* SECTION 4: Habilidades */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Sparkles className="text-blue-600" size={20} />
              </div>
              <div>
                <h2 className="text-gray-900">Habilidades</h2>
                <p className="text-gray-500 text-sm">
                  Detectadas en tu CV (puedes ajustarlas)
                </p>
              </div>
            </div>
            {editing !== 'skills' ? (
              <button
                onClick={() => startEdit('skills')}
                className="text-blue-600 hover:underline inline-flex items-center gap-1 text-sm"
              >
                <Edit size={14} />
                Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={cancelEdit}
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveEdit}
                  className="text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-sm inline-flex items-center gap-1"
                >
                  <Save size={14} />
                  Guardar
                </button>
              </div>
            )}
          </div>
          {editing !== 'skills' ? (
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm mb-2">
                  Técnicas ({profile.technicalSkills.length})
                </p>
                <ChipList
                  items={profile.technicalSkills}
                  className="bg-blue-100 text-blue-700"
                />
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-2">
                  Blandas ({profile.softSkills.length})
                </p>
                <ChipList
                  items={profile.softSkills}
                  className="bg-orange-100 text-orange-700"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="text-gray-600 text-sm mb-2">Técnicas</p>
                <ChipList
                  items={draft.technicalSkills}
                  className="bg-blue-100 text-blue-700"
                  onRemove={(idx) =>
                    setDraft({
                      ...draft,
                      technicalSkills: draft.technicalSkills.filter(
                        (_, i) => i !== idx,
                      ),
                    })
                  }
                />
                <ChipInput
                  placeholder="Añadir habilidad técnica…"
                  onAdd={(v) =>
                    setDraft({
                      ...draft,
                      technicalSkills: [...draft.technicalSkills, v],
                    })
                  }
                />
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-2">Blandas</p>
                <ChipList
                  items={draft.softSkills}
                  className="bg-orange-100 text-orange-700"
                  onRemove={(idx) =>
                    setDraft({
                      ...draft,
                      softSkills: draft.softSkills.filter((_, i) => i !== idx),
                    })
                  }
                />
                <ChipInput
                  placeholder="Añadir habilidad blanda…"
                  onAdd={(v) =>
                    setDraft({
                      ...draft,
                      softSkills: [...draft.softSkills, v],
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 5: Preferencias laborales */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Briefcase className="text-orange-600" size={20} />
              </div>
              <h2 className="text-gray-900">Preferencias laborales</h2>
            </div>
            {editing !== 'preferences' ? (
              <button
                onClick={() => startEdit('preferences')}
                className="text-blue-600 hover:underline inline-flex items-center gap-1 text-sm"
              >
                <Edit size={14} />
                Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={cancelEdit}
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveEdit}
                  className="text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-sm inline-flex items-center gap-1"
                >
                  <Save size={14} />
                  Guardar
                </button>
              </div>
            )}
          </div>
          {editing !== 'preferences' ? (
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm mb-2">Modalidad preferida</p>
                <ChipList
                  items={profile.preferredModalidades}
                  className="bg-blue-100 text-blue-700"
                />
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-2">Áreas de interés</p>
                <ChipList
                  items={profile.interests}
                  className="bg-purple-100 text-purple-700"
                />
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-2">Ubicaciones preferidas</p>
                <ChipList
                  items={profile.preferredLocations}
                  className="bg-green-100 text-green-700"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="text-gray-600 text-sm mb-2">Modalidad preferida</p>
                <div className="flex flex-wrap gap-2">
                  {MODALIDADES.map((m) => {
                    const active = draft.preferredModalidades.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          const next = active
                            ? draft.preferredModalidades.filter((x) => x !== m)
                            : [...draft.preferredModalidades, m];
                          setDraft({ ...draft, preferredModalidades: next });
                        }}
                        className={`px-3 py-1 rounded-full border transition-colors ${
                          active
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-2">Áreas de interés</p>
                <ChipList
                  items={draft.interests}
                  className="bg-purple-100 text-purple-700"
                  onRemove={(idx) =>
                    setDraft({
                      ...draft,
                      interests: draft.interests.filter((_, i) => i !== idx),
                    })
                  }
                />
                <ChipInput
                  placeholder="Añadir área de interés…"
                  onAdd={(v) =>
                    setDraft({ ...draft, interests: [...draft.interests, v] })
                  }
                />
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-2">
                  Ubicaciones preferidas
                </p>
                <ChipList
                  items={draft.preferredLocations}
                  className="bg-green-100 text-green-700"
                  onRemove={(idx) =>
                    setDraft({
                      ...draft,
                      preferredLocations: draft.preferredLocations.filter(
                        (_, i) => i !== idx,
                      ),
                    })
                  }
                />
                <ChipInput
                  placeholder="Añadir ubicación…"
                  onAdd={(v) =>
                    setDraft({
                      ...draft,
                      preferredLocations: [...draft.preferredLocations, v],
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 6: Plan activo */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <CreditCard className="text-yellow-700" size={20} />
              </div>
              <h2 className="text-gray-900">Plan activo</h2>
            </div>
          </div>
          {profile.plan === 'Premium' ? (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2">
                  <Crown size={22} />
                  <h3 className="text-white text-lg">Plan Premium</h3>
                </div>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  Activo
                </span>
              </div>
              <p className="text-blue-100 mb-4">
                Análisis ilimitados, recomendaciones avanzadas y acceso a todos los cursos.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setProfile({ ...profile, plan: 'Free' })}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                >
                  Cambiar a Gratis
                </button>
                <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  Gestionar pago
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 text-lg">Plan Gratis</h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  Activo
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                3 análisis por mes, recomendaciones básicas. Sube a Premium para acceso ilimitado.
              </p>
              <button
                onClick={() => setProfile({ ...profile, plan: 'Premium' })}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Crown size={16} />
                Mejorar a Premium
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
