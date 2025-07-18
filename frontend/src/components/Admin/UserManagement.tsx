import React, { useState, useEffect } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { User } from '../../types/api';

const ROLES = [
  { value: '', label: 'Tous les rôles' },
  { value: 'STUDENT', label: 'Élève' },
  { value: 'TEACHER', label: 'Enseignant' },
  { value: 'PARENT', label: 'Parent' },
  { value: 'ADMIN', label: 'Administrateur' },
  { value: 'SUPERVISOR', label: 'Surveillant' },
];

const CONTACT_METHODS = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'SMS', label: 'SMS' },
  { value: 'PHONE', label: 'Téléphone' },
];

export const UserManagement: React.FC = () => {
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [availableClasses, setAvailableClasses] = useState<any[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<any[]>([]);
  const [availableParents, setAvailableParents] = useState<any[]>([]);
  const [availableStudents, setAvailableStudents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [state, actions] = useUsers(true);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState<any>({ role: '', isActive: true });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  // Ajoute un state pour les stats globales
  const [globalStats, setGlobalStats] = useState<{ students: number; teachers: number; parents: number; total: number } | null>(null);

  // Charger la liste des classes, matières, parents, enfants au montage
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response = await fetch('/api/v1/students/classes');
        const result = await response.json();
        if (result.success) setAvailableClasses(result.data);
      } catch { setAvailableClasses([]); }
    };
    const loadSubjects = async () => {
      try {
        const response = await fetch('/api/v1/subjects');
        const result = await response.json();
        if (result.success) setAvailableSubjects(result.data);
      } catch { setAvailableSubjects([]); }
    };
    const loadParents = async () => {
      try {
        const response = await fetch('/api/v1/users?role=PARENT');
        const result = await response.json();
        if (result.success) setAvailableParents(result.data);
      } catch { setAvailableParents([]); }
    };
    const loadStudents = async () => {
      try {
        const response = await fetch('/api/v1/users?role=STUDENT');
        const result = await response.json();
        if (result.success) setAvailableStudents(result.data);
      } catch { setAvailableStudents([]); }
    };
    loadClasses();
    loadSubjects();
    loadParents();
    loadStudents();
  }, []);

  // Effet pour charger les stats globales depuis l'API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/v1/users/stats');
        const data = await res.json();
        if (data.success) {
          setGlobalStats({
            students: data.data.totalStudents,
            teachers: data.data.totalTeachers,
            parents: data.data.totalParents,
            total: data.data.totalUsers,
          });
        }
      } catch {
        setGlobalStats(null);
      }
    };
    fetchStats();
  }, []);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
    actions.loadUsers(1, {
      role: e.target.value || undefined,
      isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
      classId: classFilter !== 'all' ? classFilter : undefined,
      search: search || undefined
    });
  };
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    actions.loadUsers(1, {
      role: roleFilter || undefined,
      isActive: e.target.value === 'all' ? undefined : e.target.value === 'active',
      classId: classFilter !== 'all' ? classFilter : undefined,
      search: search || undefined
    });
  };
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClassFilter(e.target.value);
    actions.loadUsers(1, {
      role: roleFilter || undefined,
      isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
      classId: e.target.value !== 'all' ? e.target.value : undefined,
      search: search || undefined
    });
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    actions.loadUsers(1, {
      role: roleFilter || undefined,
      isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
      classId: classFilter !== 'all' ? classFilter : undefined,
      search: e.target.value || undefined
    });
  };

  const getRoleLabel = (role: string) => ROLES.find(r => r.value === role)?.label || role;

  // Formulaire dynamique d'édition
  useEffect(() => {
    if (!selectedUser) return;
    // Pré-remplir le formulaire selon le rôle
    const base = {
      name: selectedUser.name || '',
      email: selectedUser.email || '',
      phone: selectedUser.phone || '',
      isActive: selectedUser.isActive,
    };
    if (selectedUser.role === 'student') {
      const student = selectedUser as import('../../types/api').Student;
      setEditForm({
        ...base,
        address: student.address || '',
        dateOfBirth: student.dateOfBirth || '',
        studentId: student.studentId || '',
        classId: student.class?.id || '',
        enrollmentDate: student.enrollmentDate || '',
        parentIds: student.parent ? [student.parent.id] : [],
      });
    } else if (selectedUser.role === 'teacher') {
      const teacher = selectedUser as import('../../types/api').Teacher;
      setEditForm({
        ...base,
        address: teacher.address || '',
        employeeId: teacher.employeeId || '',
        department: teacher.department || '',
        subjects: teacher.subjects || [],
        classes: teacher.classes || [],
      });
    } else if (selectedUser.role === 'parent') {
      const parent = selectedUser as import('../../types/api').Parent;
      setEditForm({
        ...base,
        address: parent.address || '',
        childrenIds: parent.children ? parent.children.map(c => c.id) : [],
      });
    } else {
      setEditForm(base);
    }
  }, [selectedUser]);

  // Soumission édition dynamique
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setEditLoading(true);
    setEditError(null);
    setEditSuccess(null);
    try {
      let payload: any = {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        isActive: editForm.isActive,
      };
      if (selectedUser.role === 'student') {
        payload.studentData = {
          address: editForm.address,
          dateOfBirth: editForm.dateOfBirth,
          studentId: editForm.studentId,
          classId: editForm.classId,
          enrollmentDate: editForm.enrollmentDate,
          parentIds: editForm.parentIds,
        };
      } else if (selectedUser.role === 'teacher') {
        payload.teacherData = {
          address: editForm.address,
          employeeId: editForm.employeeId,
          department: editForm.department,
          subjects: editForm.subjects,
          classes: editForm.classes,
        };
      } else if (selectedUser.role === 'parent') {
        payload.parentData = {
          address: editForm.address,
          childrenIds: editForm.childrenIds,
        };
      }
      await actions.updateUser(selectedUser.id, payload);
      setEditSuccess('Utilisateur modifié avec succès');
      setTimeout(() => {
        setSelectedUser(null);
        setEditSuccess(null);
      }, 1000);
    } catch (err: any) {
      setEditError(err?.message || 'Erreur lors de la modification');
    } finally {
      setEditLoading(false);
    }
  };

  // Archivage (désactivation)
  const handleArchive = async () => {
    if (!selectedUser) return;
    setEditLoading(true);
    setEditError(null);
    setEditSuccess(null);
    try {
      await actions.updateUser(selectedUser.id, { isActive: false });
      setEditSuccess('Utilisateur archivé avec succès');
      setTimeout(() => {
        setSelectedUser(null);
        setEditSuccess(null);
      }, 1000);
    } catch (err: any) {
      setEditError(err?.message || 'Erreur lors de l\'archivage');
    } finally {
      setEditLoading(false);
    }
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setEditForm({ ...user });
    setShowEditModal(true);
  };

  // Pour l'édition, cast dynamiquement selon le rôle
  const isStudent = selectedUser && selectedUser.role === 'student';
  const isTeacher = selectedUser && selectedUser.role === 'teacher';
  const isParent = selectedUser && selectedUser.role === 'parent';

  const handleCreateClick = () => {
    setCreateForm({ role: '', isActive: true });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    setCreateSuccess(null);
    try {
      let payload: any = {
        name: createForm.name,
        email: createForm.email,
        phone: createForm.phone,
        address: createForm.address,
        dateOfBirth: createForm.dateOfBirth,
        isActive: createForm.isActive,
        role: createForm.role,
      };
      if (createForm.role === 'student') {
        payload.studentData = {
          studentId: createForm.studentId,
          classId: createForm.classId,
          academicYear: createForm.academicYear,
          admissionDate: createForm.admissionDate,
          parentIds: createForm.parentIds,
          allergies: createForm.allergies ? createForm.allergies.split(',').map((a: string) => a.trim()) : [],
          medications: createForm.medications ? createForm.medications.split(',').map((m: string) => m.trim()) : [],
          emergencyMedicalContact: createForm.emergencyMedicalContact,
        };
      } else if (createForm.role === 'teacher') {
        payload.teacherData = {
          employeeId: createForm.employeeId,
          department: createForm.department,
          qualifications: createForm.qualifications ? createForm.qualifications.split(',').map((q: string) => q.trim()) : [],
          hireDate: createForm.hireDate,
          subjects: createForm.subjects,
          classes: createForm.classes,
        };
      } else if (createForm.role === 'parent') {
        payload.parentData = {
          occupation: createForm.occupation,
          preferredContactMethod: createForm.preferredContactMethod,
          childrenIds: createForm.childrenIds,
        };
      }
      await actions.createUser(payload);
      setCreateSuccess('Utilisateur créé avec succès');
      setTimeout(() => {
        setShowCreateModal(false);
        setCreateSuccess(null);
        actions.loadUsers(1);
      }, 1000);
    } catch (err: any) {
      setCreateError(err?.message || 'Erreur lors de la création');
    } finally {
      setCreateLoading(false);
    }
  };

  // Calculs des totaux par rôle
  const countByRole = (role: string) => state.users.filter(u => u.role === role).length;
  const total = state.users.length;

  return (
    <>
      {globalStats && (
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center items-center bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex-1 text-center">
            <div className="text-3xl font-bold text-blue-600">{globalStats.students}</div>
            <div className="text-gray-700 dark:text-gray-200">Élèves</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-3xl font-bold text-green-600">{globalStats.teachers}</div>
            <div className="text-gray-700 dark:text-gray-200">Enseignants</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-3xl font-bold text-purple-600">{globalStats.parents}</div>
            <div className="text-gray-700 dark:text-gray-200">Parents</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{globalStats.total}</div>
            <div className="text-gray-700 dark:text-gray-200">Total</div>
          </div>
        </div>
      )}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des utilisateurs</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Gérez tous les utilisateurs de l'établissement (élèves, enseignants, parents, admins...)</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={handleCreateClick}>Ajouter un utilisateur</button>
        </div>

        {/* Filtres */}
        <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <input
            type="text"
            placeholder="Rechercher par nom, email..."
            value={search}
            onChange={handleSearch}
            className="w-full md:w-1/4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <select
            value={roleFilter}
            onChange={handleRoleChange}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
          <select
            value={classFilter}
            onChange={handleClassChange}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Toutes les classes</option>
            {availableClasses.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name} ({cls.currentCount}/{cls.capacity})</option>
            ))}
          </select>
        </div>

        {/* Tableau des utilisateurs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {state.loading ? (
                <tr><td colSpan={5} className="p-6 text-center">Chargement...</td></tr>
              ) : state.users.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-gray-500">Aucun utilisateur trouvé</td></tr>
              ) : state.users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={() => handleRowClick(user)}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getRoleLabel(user.role)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>{user.isActive ? 'Actif' : 'Inactif'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2 justify-end">
                    <button className="text-blue-600 hover:text-blue-900" title="Modifier" onClick={e => { e.stopPropagation(); handleRowClick(user); }}>
                      <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 019 17H7v-2a2 2 0 012-2z" /></svg>
                    </button>
                    <button className="text-red-600 hover:text-red-900" title="Archiver" onClick={e => { e.stopPropagation(); setSelectedUser(user); handleArchive(); }}>
                      <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v2H7V5a2 2 0 012-2z" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {state.totalPages > 1 && (
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Page {state.currentPage} sur {state.totalPages} — {state.totalCount} utilisateurs
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => actions.loadUsers(state.currentPage - 1)} disabled={state.currentPage === 1} className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700">Précédent</button>
              <button onClick={() => actions.loadUsers(state.currentPage + 1)} disabled={state.currentPage === state.totalPages} className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700">Suivant</button>
            </div>
          </div>
        )}

        {/* Modale d'édition dynamique */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-8 relative">
              <button onClick={() => setSelectedUser(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">×</button>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Modifier l'utilisateur</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                {/* Champs communs */}
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={editForm.name || ''} onChange={e => setEditForm((f: any) => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" className="w-full border rounded px-3 py-2" value={editForm.email || ''} onChange={e => setEditForm((f: any) => ({ ...f, email: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={editForm.phone || ''} onChange={e => setEditForm((f: any) => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Adresse</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={editForm.address || ''} onChange={e => setEditForm((f: any) => ({ ...f, address: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date de naissance</label>
                  <input type="date" className="w-full border rounded px-3 py-2" value={editForm.dateOfBirth ? editForm.dateOfBirth.slice(0, 10) : ''} onChange={e => setEditForm((f: any) => ({ ...f, dateOfBirth: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Statut</label>
                  <select className="w-full border rounded px-3 py-2" value={editForm.isActive ? 'active' : 'inactive'} onChange={e => setEditForm((f: any) => ({ ...f, isActive: e.target.value === 'active' }))}>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>

                {/* Champs spécifiques Élève */}
                {isStudent && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">ID Élève</label>
                      <input type="text" className="w-full border rounded px-3 py-2" value={editForm.studentId || ''} onChange={e => setEditForm((f: any) => ({ ...f, studentId: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Classe</label>
                      <select className="w-full border rounded px-3 py-2" value={editForm.classId || ''} onChange={e => setEditForm((f: any) => ({ ...f, classId: e.target.value }))}>
                        <option value="">Non assigné</option>
                        {availableClasses.map(cls => (
                          <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Année académique</label>
                      <input type="text" className="w-full border rounded px-3 py-2" value={editForm.academicYear || ''} onChange={e => setEditForm((f: any) => ({ ...f, academicYear: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Date d'admission</label>
                      <input type="date" className="w-full border rounded px-3 py-2" value={editForm.admissionDate ? editForm.admissionDate.slice(0, 10) : ''} onChange={e => setEditForm((f: any) => ({ ...f, admissionDate: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Parents</label>
                      <select multiple className="w-full border rounded px-3 py-2" value={editForm.parentIds || []} onChange={e => setEditForm((f: any) => ({ ...f, parentIds: Array.from(e.target.selectedOptions, opt => opt.value) }))}>
                        {availableParents.map((p: any) => (
                          <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-4">
                      <div className="font-semibold mb-2">Dossier médical</div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Allergies</label>
                        <input type="text" className="w-full border rounded px-3 py-2" value={editForm.allergies || ''} onChange={e => setEditForm((f: any) => ({ ...f, allergies: e.target.value }))} placeholder="Séparez par des virgules" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Médicaments</label>
                        <input type="text" className="w-full border rounded px-3 py-2" value={editForm.medications || ''} onChange={e => setEditForm((f: any) => ({ ...f, medications: e.target.value }))} placeholder="Séparez par des virgules" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Contact médical d'urgence</label>
                        <input type="text" className="w-full border rounded px-3 py-2" value={editForm.emergencyMedicalContact || ''} onChange={e => setEditForm((f: any) => ({ ...f, emergencyMedicalContact: e.target.value }))} />
                      </div>
                    </div>
                  </>
                )}

                {/* Champs spécifiques Enseignant */}
                {isTeacher && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Matricule</label>
                      <input type="text" className="w-full border rounded px-3 py-2" value={editForm.employeeId || ''} onChange={e => setEditForm((f: any) => ({ ...f, employeeId: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Département</label>
                      <input type="text" className="w-full border rounded px-3 py-2" value={editForm.department || ''} onChange={e => setEditForm((f: any) => ({ ...f, department: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Qualifications</label>
                      <input type="text" className="w-full border rounded px-3 py-2" value={editForm.qualifications || ''} onChange={e => setEditForm((f: any) => ({ ...f, qualifications: e.target.value }))} placeholder="Séparez par des virgules" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Date d'embauche</label>
                      <input type="date" className="w-full border rounded px-3 py-2" value={editForm.hireDate ? editForm.hireDate.slice(0, 10) : ''} onChange={e => setEditForm((f: any) => ({ ...f, hireDate: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Matières</label>
                      <select multiple className="w-full border rounded px-3 py-2" value={editForm.subjects || []} onChange={e => setEditForm((f: any) => ({ ...f, subjects: Array.from(e.target.selectedOptions, opt => opt.value) }))}>
                        {availableSubjects.map((s: any) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Classes</label>
                      <select multiple className="w-full border rounded px-3 py-2" value={editForm.classes || []} onChange={e => setEditForm((f: any) => ({ ...f, classes: Array.from(e.target.selectedOptions, opt => opt.value) }))}>
                        {availableClasses.map((cls: any) => (
                          <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* Champs spécifiques Parent */}
                {isParent && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Profession</label>
                      <input type="text" className="w-full border rounded px-3 py-2" value={editForm.occupation || ''} onChange={e => setEditForm((f: any) => ({ ...f, occupation: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Mode de contact préféré</label>
                      <select className="w-full border rounded px-3 py-2" value={editForm.preferredContactMethod || 'email'} onChange={e => setEditForm((f: any) => ({ ...f, preferredContactMethod: e.target.value }))}>
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="phone">Téléphone</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Enfants</label>
                      <select multiple className="w-full border rounded px-3 py-2" value={editForm.childrenIds || []} onChange={e => setEditForm((f: any) => ({ ...f, childrenIds: Array.from(e.target.selectedOptions, opt => opt.value) }))}>
                        {availableStudents.map((s: any) => (
                          <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {editError && <div className="text-red-600 text-sm">{editError}</div>}
                {editSuccess && <div className="text-green-600 text-sm">{editSuccess}</div>}
                <div className="flex justify-end gap-2">
                  <button className="px-4 py-2 bg-gray-200 rounded" type="button" onClick={() => setSelectedUser(null)} disabled={editLoading}>Annuler</button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit" disabled={editLoading}>{editLoading ? 'Enregistrement...' : 'Enregistrer'}</button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded" type="button" onClick={handleArchive} disabled={editLoading || !editForm.isActive}>{editLoading ? 'Archivage...' : 'Archiver'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-8 relative">
              <button onClick={() => setShowCreateModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">×</button>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Ajouter un utilisateur</h2>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Rôle</label>
                  <select className="w-full border rounded px-3 py-2" value={createForm.role} onChange={e => setCreateForm((f: any) => ({ ...f, role: e.target.value }))} required>
                    <option value="">Sélectionner un rôle</option>
                    <option value="student">Élève</option>
                    <option value="teacher">Enseignant</option>
                    <option value="parent">Parent</option>
                    <option value="admin">Administrateur</option>
                    <option value="supervisor">Surveillant</option>
                  </select>
                </div>
                {/* Champs communs */}
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={createForm.name || ''} onChange={e => setCreateForm((f: any) => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" className="w-full border rounded px-3 py-2" value={createForm.email || ''} onChange={e => setCreateForm((f: any) => ({ ...f, email: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={createForm.phone || ''} onChange={e => setCreateForm((f: any) => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Adresse</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={createForm.address || ''} onChange={e => setCreateForm((f: any) => ({ ...f, address: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date de naissance</label>
                  <input type="date" className="w-full border rounded px-3 py-2" value={createForm.dateOfBirth || ''} onChange={e => setCreateForm((f: any) => ({ ...f, dateOfBirth: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Statut</label>
                  <select className="w-full border rounded px-3 py-2" value={createForm.isActive ? 'active' : 'inactive'} onChange={e => setCreateForm((f: any) => ({ ...f, isActive: e.target.value === 'active' }))}>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
                {/* Champs dynamiques selon le rôle */}
                {createForm.role === 'student' && (
                  <div className="border-t pt-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">ID Élève</label>
                      <input type="text" className="w-full border rounded px-3 py-2" value={createForm.studentId || ''} onChange={e => setCreateForm((f: any) => ({ ...f, studentId: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Classe</label>
                      <select className="w-full border rounded px-3 py-2" value={createForm.classId || ''} onChange={e => setCreateForm((f: any) => ({ ...f, classId: e.target.value }))}>
                        <option value="">Non assigné</option>
                        {availableClasses.map(cls => (
                          <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Année académique</label>
                      <input type="text" className="w-full border rounded px-3 py-2" value={createForm.academicYear || ''} onChange={e => setCreateForm((f: any) => ({ ...f, academicYear: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Date d'admission</label>
                      <input type="date" className="w-full border rounded px-3 py-2" value={createForm.admissionDate || ''} onChange={e => setCreateForm((f: any) => ({ ...f, admissionDate: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Parents</label>
                      <select multiple className="w-full border rounded px-3 py-2" value={createForm.parentIds || []} onChange={e => setCreateForm((f: any) => ({ ...f, parentIds: Array.from(e.target.selectedOptions, opt => opt.value) }))}>
                        {availableParents.map((p: any) => (
                          <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-4">
                      <div className="font-semibold mb-2">Dossier médical</div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Allergies</label>
                        <input type="text" className="w-full border rounded px-3 py-2" value={createForm.allergies || ''} onChange={e => setCreateForm((f: any) => ({ ...f, allergies: e.target.value }))} placeholder="Séparez par des virgules" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Médicaments</label>
                        <input type="text" className="w-full border rounded px-3 py-2" value={createForm.medications || ''} onChange={e => setCreateForm((f: any) => ({ ...f, medications: e.target.value }))} placeholder="Séparez par des virgules" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Contact médical d'urgence</label>
                        <input type="text" className="w-full border rounded px-3 py-2" value={createForm.emergencyMedicalContact || ''} onChange={e => setCreateForm((f: any) => ({ ...f, emergencyMedicalContact: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                )}
                {createForm.role === 'teacher' && (
                  <div className="border-t pt-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Matricule</label>
                      <input type="text" className="w-full border rounded px-3 py-2" value={createForm.employeeId || ''} onChange={e => setCreateForm((f: any) => ({ ...f, employeeId: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Département</label>
                      <input type="text" className="w-full border rounded px-3 py-2" value={createForm.department || ''} onChange={e => setCreateForm((f: any) => ({ ...f, department: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Qualifications</label>
                      <input type="text" className="w-full border rounded px-3 py-2" value={createForm.qualifications || ''} onChange={e => setCreateForm((f: any) => ({ ...f, qualifications: e.target.value }))} placeholder="Séparez par des virgules" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Date d'embauche</label>
                      <input type="date" className="w-full border rounded px-3 py-2" value={createForm.hireDate || ''} onChange={e => setCreateForm((f: any) => ({ ...f, hireDate: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Matières</label>
                      <select multiple className="w-full border rounded px-3 py-2" value={createForm.subjects || []} onChange={e => setCreateForm((f: any) => ({ ...f, subjects: Array.from(e.target.selectedOptions, opt => opt.value) }))}>
                        {availableSubjects.map((s: any) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Classes</label>
                      <select multiple className="w-full border rounded px-3 py-2" value={createForm.classes || []} onChange={e => setCreateForm((f: any) => ({ ...f, classes: Array.from(e.target.selectedOptions, opt => opt.value) }))}>
                        {availableClasses.map((cls: any) => (
                          <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                {createForm.role === 'parent' && (
                  <div className="border-t pt-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Profession</label>
                      <input type="text" className="w-full border rounded px-3 py-2" value={createForm.occupation || ''} onChange={e => setCreateForm((f: any) => ({ ...f, occupation: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Mode de contact préféré</label>
                      <select className="w-full border rounded px-3 py-2" value={createForm.preferredContactMethod || 'email'} onChange={e => setCreateForm((f: any) => ({ ...f, preferredContactMethod: e.target.value }))}>
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="phone">Téléphone</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Enfants</label>
                      <select multiple className="w-full border rounded px-3 py-2" value={createForm.childrenIds || []} onChange={e => setCreateForm((f: any) => ({ ...f, childrenIds: Array.from(e.target.selectedOptions, opt => opt.value) }))}>
                        {availableStudents.map((s: any) => (
                          <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                {createError && <div className="text-red-600 text-sm">{createError}</div>}
                {createSuccess && <div className="text-green-600 text-sm">{createSuccess}</div>}
                <div className="flex justify-end gap-2">
                  <button className="px-4 py-2 bg-gray-200 rounded" type="button" onClick={() => setShowCreateModal(false)} disabled={createLoading}>Annuler</button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit" disabled={createLoading}>{createLoading ? 'Création...' : 'Créer'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}; 