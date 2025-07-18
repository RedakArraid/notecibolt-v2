import React, { useState } from 'react';
import { Student } from '../../types/api';

interface StudentDetailsProps {
  student: Student;
  onClose: () => void;
  onUpdate: (updated: Partial<Student>) => Promise<void>;
  onArchive: () => Promise<void>;
  loading?: boolean;
}

export const StudentDetails: React.FC<StudentDetailsProps> = ({ student, onClose, onUpdate, onArchive, loading }) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: student.name || '',
    email: student.email || '',
    phone: student.phone || '',
    address: student.address || '',
    classId: student.class?.id || '',
    isActive: student.isActive,
  });
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'isActive' ? value === 'true' : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await onUpdate(form);
      setSuccess('Élève modifié avec succès');
      setEditMode(false);
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de la modification');
    }
  };

  const handleArchive = async () => {
    setError(null);
    setSuccess(null);
    try {
      await onArchive();
      setSuccess('Élève archivé avec succès');
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de l\'archivage');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-8 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">×</button>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Fiche élève</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        {editMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" type="email" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Téléphone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Adresse</label>
              <input name="address" value={form.address} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Statut</label>
              <select name="isActive" value={form.isActive ? 'true' : 'false'} onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value="true">Actif</option>
                <option value="false">Inactif</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={() => setEditMode(false)} disabled={loading}>Annuler</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                {student.name.charAt(0)}
              </div>
              <div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">{student.name}</div>
                <div className="text-sm text-gray-500">ID: {student.studentId}</div>
                <div className="text-sm text-gray-500">Classe: {student.class?.name || 'Non assigné'}</div>
                <div className="text-sm text-gray-500">Statut: {student.isActive ? 'Actif' : 'Inactif'}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="text-base text-gray-900 dark:text-white">{student.email}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Téléphone</div>
                <div className="text-base text-gray-900 dark:text-white">{student.phone || <span className="text-gray-400">Non renseigné</span>}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Adresse</div>
                <div className="text-base text-gray-900 dark:text-white">{student.address || <span className="text-gray-400">Non renseignée</span>}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Date d'inscription</div>
                <div className="text-base text-gray-900 dark:text-white">{student.enrollmentDate}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Parent principal</div>
                <div className="text-base text-gray-900 dark:text-white">{student.parent?.name || <span className="text-gray-400">Non renseigné</span>}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Moyenne</div>
                <div className="text-base text-gray-900 dark:text-white">{student.academicInfo?.currentGPA ?? 'N/A'}/20</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Présence</div>
                <div className="text-base text-gray-900 dark:text-white">{student.academicInfo?.attendanceRate ?? 'N/A'}%</div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Fermer</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setEditMode(true)}>Modifier</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={() => setConfirmArchive(true)}>Archiver</button>
            </div>
          </div>
        )}
        {/* Confirmation archivage */}
        {confirmArchive && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <p className="mb-4">Confirmer l'archivage de <span className="font-semibold">{student.name}</span> ?</p>
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setConfirmArchive(false)} disabled={loading}>Annuler</button>
                <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleArchive} disabled={loading}>{loading ? 'Archivage...' : 'Archiver'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 