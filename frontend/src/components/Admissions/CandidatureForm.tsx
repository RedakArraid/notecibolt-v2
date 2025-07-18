import React, { useState } from 'react';
import { User, Users, BookOpen, FileText, Calendar, Save, X, AlertCircle, Upload, Trash2, Eye } from 'lucide-react';

interface StudentInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  previousSchool: string;
  previousClass: string;
  medicalInfo: string;
  specialNeeds: string;
}

interface ParentInfo {
  father: {
    name: string;
    email: string;
    phone: string;
    occupation: string;
    address: string;
  };
  mother: {
    name: string;
    email: string;
    phone: string;
    occupation: string;
    address: string;
  };
  guardian?: {
    name: string;
    email: string;
    phone: string;
    occupation: string;
    address: string;
    relationship: string;
  };
}

interface AcademicInfo {
  desiredClass: string;
  academicYear: string;
  previousGrades: string;
  motivationLetter: string;
  extracurricularActivities: string;
}

interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  file?: File;
  required: boolean;
}

interface CandidatureFormData {
  studentInfo: StudentInfo;
  parentInfo: ParentInfo;
  academicInfo: AcademicInfo;
  documents: DocumentFile[];
  hasGuardian: boolean;
}

interface CandidatureFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CandidatureFormData) => void;
  prospectData?: any;
}

export const CandidatureForm: React.FC<CandidatureFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  prospectData 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CandidatureFormData>({
    studentInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'male',
      nationality: 'Ivoirienne',
      previousSchool: '',
      previousClass: '',
      medicalInfo: '',
      specialNeeds: ''
    },
    parentInfo: {
      father: {
        name: prospectData?.name || '',
        email: prospectData?.email || '',
        phone: prospectData?.phone || '',
        occupation: prospectData?.occupation || '',
        address: prospectData?.address || ''
      },
      mother: {
        name: '',
        email: '',
        phone: '',
        occupation: '',
        address: ''
      }
    },
    academicInfo: {
      desiredClass: '',
      academicYear: '2025-2026',
      previousGrades: '',
      motivationLetter: '',
      extracurricularActivities: ''
    },
    documents: [
      { id: 'birth-certificate', name: 'Extrait de naissance', type: 'application/pdf', size: 0, required: true },
      { id: 'family-book', name: 'Livret de famille', type: 'application/pdf', size: 0, required: true },
      { id: 'school-report', name: 'Bulletins scolaires', type: 'application/pdf', size: 0, required: true },
      { id: 'medical-certificate', name: 'Certificat médical', type: 'application/pdf', size: 0, required: true },
      { id: 'photos', name: 'Photos d\'identité', type: 'image/*', size: 0, required: true },
      { id: 'vaccination', name: 'Carnet de vaccination', type: 'application/pdf', size: 0, required: false }
    ],
    hasGuardian: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const levels = ['6e', '5e', '4e', '3e', '2nde', '1re', 'Terminale'];
  const steps = [
    { id: 1, title: 'Élève', icon: User },
    { id: 2, title: 'Parents', icon: Users },
    { id: 3, title: 'Académique', icon: BookOpen },
    { id: 4, title: 'Documents', icon: FileText }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.studentInfo.firstName.trim()) newErrors.firstName = 'Prénom requis';
        if (!formData.studentInfo.lastName.trim()) newErrors.lastName = 'Nom requis';
        if (!formData.studentInfo.dateOfBirth) newErrors.dateOfBirth = 'Date de naissance requise';
        if (!formData.studentInfo.previousSchool.trim()) newErrors.previousSchool = 'École précédente requise';
        break;

      case 2:
        if (!formData.parentInfo.father.name.trim()) newErrors.fatherName = 'Nom du père requis';
        if (!formData.parentInfo.father.email.trim()) newErrors.fatherEmail = 'Email du père requis';
        if (!formData.parentInfo.father.phone.trim()) newErrors.fatherPhone = 'Téléphone du père requis';
        if (!formData.parentInfo.mother.name.trim()) newErrors.motherName = 'Nom de la mère requis';
        if (!formData.parentInfo.mother.email.trim()) newErrors.motherEmail = 'Email de la mère requis';
        if (!formData.parentInfo.mother.phone.trim()) newErrors.motherPhone = 'Téléphone de la mère requis';
        break;

      case 3:
        if (!formData.academicInfo.desiredClass) newErrors.desiredClass = 'Classe souhaitée requise';
        if (!formData.academicInfo.motivationLetter.trim()) newErrors.motivationLetter = 'Lettre de motivation requise';
        break;

      case 4:
        const requiredDocs = formData.documents.filter(doc => doc.required);
        const missingDocs = requiredDocs.filter(doc => !doc.file);
        if (missingDocs.length > 0) {
          newErrors.documents = `Documents manquants: ${missingDocs.map(d => d.name).join(', ')}`;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFileUpload = (documentId: string, file: File) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map(doc => 
        doc.id === documentId 
          ? { ...doc, file, size: file.size }
          : doc
      )
    }));
  };

  const handleFileRemove = (documentId: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map(doc => 
        doc.id === documentId 
          ? { ...doc, file: undefined, size: 0 }
          : doc
      )
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Informations de l'élève
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  value={formData.studentInfo.firstName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    studentInfo: { ...prev.studentInfo, firstName: e.target.value }
                  }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.studentInfo.lastName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    studentInfo: { ...prev.studentInfo, lastName: e.target.value }
                  }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date de naissance *
                </label>
                <input
                  type="date"
                  value={formData.studentInfo.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    studentInfo: { ...prev.studentInfo, dateOfBirth: e.target.value }
                  }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.dateOfBirth ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Genre
                </label>
                <select
                  value={formData.studentInfo.gender}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    studentInfo: { ...prev.studentInfo, gender: e.target.value as any }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="male">Masculin</option>
                  <option value="female">Féminin</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nationalité
                </label>
                <input
                  type="text"
                  value={formData.studentInfo.nationality}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    studentInfo: { ...prev.studentInfo, nationality: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  École précédente *
                </label>
                <input
                  type="text"
                  value={formData.studentInfo.previousSchool}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    studentInfo: { ...prev.studentInfo, previousSchool: e.target.value }
                  }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.previousSchool ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.previousSchool && (
                  <p className="mt-1 text-sm text-red-600">{errors.previousSchool}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Informations médicales
              </label>
              <textarea
                value={formData.studentInfo.medicalInfo}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  studentInfo: { ...prev.studentInfo, medicalInfo: e.target.value }
                }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Allergies, traitements médicaux, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Besoins spéciaux
              </label>
              <textarea
                value={formData.studentInfo.specialNeeds}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  studentInfo: { ...prev.studentInfo, specialNeeds: e.target.value }
                }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Dyslexie, handicap, aménagements nécessaires, etc."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Informations des parents
            </h4>

            {/* Père */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-3">Père</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={formData.parentInfo.father.name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      parentInfo: {
                        ...prev.parentInfo,
                        father: { ...prev.parentInfo.father, name: e.target.value }
                      }
                    }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.fatherName ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.fatherName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fatherName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.parentInfo.father.email}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      parentInfo: {
                        ...prev.parentInfo,
                        father: { ...prev.parentInfo.father, email: e.target.value }
                      }
                    }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.fatherEmail ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.fatherEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.fatherEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={formData.parentInfo.father.phone}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      parentInfo: {
                        ...prev.parentInfo,
                        father: { ...prev.parentInfo.father, phone: e.target.value }
                      }
                    }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.fatherPhone ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.fatherPhone && (
                    <p className="mt-1 text-sm text-red-600">{errors.fatherPhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Profession
                  </label>
                  <input
                    type="text"
                    value={formData.parentInfo.father.occupation}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      parentInfo: {
                        ...prev.parentInfo,
                        father: { ...prev.parentInfo.father, occupation: e.target.value }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Adresse
                </label>
                <textarea
                  value={formData.parentInfo.father.address}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    parentInfo: {
                      ...prev.parentInfo,
                      father: { ...prev.parentInfo.father, address: e.target.value }
                    }
                  }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Mère */}
            <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4">
              <h5 className="font-medium text-pink-900 dark:text-pink-100 mb-3">Mère</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={formData.parentInfo.mother.name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      parentInfo: {
                        ...prev.parentInfo,
                        mother: { ...prev.parentInfo.mother, name: e.target.value }
                      }
                    }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.motherName ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.motherName && (
                    <p className="mt-1 text-sm text-red-600">{errors.motherName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.parentInfo.mother.email}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      parentInfo: {
                        ...prev.parentInfo,
                        mother: { ...prev.parentInfo.mother, email: e.target.value }
                      }
                    }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.motherEmail ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.motherEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.motherEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={formData.parentInfo.mother.phone}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      parentInfo: {
                        ...prev.parentInfo,
                        mother: { ...prev.parentInfo.mother, phone: e.target.value }
                      }
                    }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.motherPhone ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.motherPhone && (
                    <p className="mt-1 text-sm text-red-600">{errors.motherPhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Profession
                  </label>
                  <input
                    type="text"
                    value={formData.parentInfo.mother.occupation}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      parentInfo: {
                        ...prev.parentInfo,
                        mother: { ...prev.parentInfo.mother, occupation: e.target.value }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Adresse
                </label>
                <textarea
                  value={formData.parentInfo.mother.address}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    parentInfo: {
                      ...prev.parentInfo,
                      mother: { ...prev.parentInfo.mother, address: e.target.value }
                    }
                  }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Tuteur légal (optionnel) */}
            <div>
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={formData.hasGuardian}
                  onChange={(e) => setFormData(prev => ({ ...prev, hasGuardian: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ajouter un tuteur légal
                </span>
              </label>

              {formData.hasGuardian && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Tuteur légal</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        value={formData.parentInfo.guardian?.name || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          parentInfo: {
                            ...prev.parentInfo,
                            guardian: { 
                              ...prev.parentInfo.guardian,
                              name: e.target.value,
                              email: prev.parentInfo.guardian?.email || '',
                              phone: prev.parentInfo.guardian?.phone || '',
                              occupation: prev.parentInfo.guardian?.occupation || '',
                              address: prev.parentInfo.guardian?.address || '',
                              relationship: prev.parentInfo.guardian?.relationship || ''
                            }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Lien de parenté
                      </label>
                      <input
                        type="text"
                        value={formData.parentInfo.guardian?.relationship || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          parentInfo: {
                            ...prev.parentInfo,
                            guardian: { 
                              ...prev.parentInfo.guardian,
                              relationship: e.target.value,
                              name: prev.parentInfo.guardian?.name || '',
                              email: prev.parentInfo.guardian?.email || '',
                              phone: prev.parentInfo.guardian?.phone || '',
                              occupation: prev.parentInfo.guardian?.occupation || '',
                              address: prev.parentInfo.guardian?.address || ''
                            }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Ex: Grand-père, Oncle, etc."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Informations académiques
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Classe souhaitée *
                </label>
                <select
                  value={formData.academicInfo.desiredClass}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    academicInfo: { ...prev.academicInfo, desiredClass: e.target.value }
                  }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.desiredClass ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Sélectionner une classe</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                {errors.desiredClass && (
                  <p className="mt-1 text-sm text-red-600">{errors.desiredClass}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Année académique
                </label>
                <select
                  value={formData.academicInfo.academicYear}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    academicInfo: { ...prev.academicInfo, academicYear: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="2025-2026">2025-2026</option>
                  <option value="2026-2027">2026-2027</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Résultats scolaires précédents
              </label>
              <textarea
                value={formData.academicInfo.previousGrades}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  academicInfo: { ...prev.academicInfo, previousGrades: e.target.value }
                }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Moyennes générales, mentions, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lettre de motivation *
              </label>
              <textarea
                value={formData.academicInfo.motivationLetter}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  academicInfo: { ...prev.academicInfo, motivationLetter: e.target.value }
                }))}
                rows={5}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.motivationLetter ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Expliquez pourquoi vous souhaitez rejoindre notre établissement..."
              />
              {errors.motivationLetter && (
                <p className="mt-1 text-sm text-red-600">{errors.motivationLetter}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Activités extrascolaires
              </label>
              <textarea
                value={formData.academicInfo.extracurricularActivities}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  academicInfo: { ...prev.academicInfo, extracurricularActivities: e.target.value }
                }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Sports, musique, associations, etc."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Documents requis
            </h4>

            {errors.documents && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.documents}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {formData.documents.map((doc) => (
                <div key={doc.id} className={`border rounded-lg p-4 ${
                  doc.required && !doc.file 
                    ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        {doc.name}
                      </h5>
                      {doc.required && (
                        <span className="text-red-500 text-sm">*</span>
                      )}
                    </div>
                    {doc.file && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Ajouté
                        </span>
                        <button
                          type="button"
                          onClick={() => handleFileRemove(doc.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {!doc.file ? (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Cliquez pour sélectionner ou glissez le fichier ici
                      </p>
                      <input
                        type="file"
                        accept={doc.type}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(doc.id, file);
                          }
                        }}
                        className="hidden"
                        id={`file-${doc.id}`}
                      />
                      <label
                        htmlFor={`file-${doc.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Sélectionner un fichier
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">
                          {doc.file.name}
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Informations importantes
              </h5>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Les documents marqués d'un astérisque (*) sont obligatoires</li>
                <li>• Formats acceptés: PDF, JPG, PNG (max 5MB par fichier)</li>
                <li>• L'extrait de naissance doit dater de moins de 3 mois</li>
                <li>• Les bulletins scolaires des 2 dernières années sont requis</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Nouvelle candidature d'admission
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'border-gray-300 dark:border-gray-600 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {renderStepContent()}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Annuler
            </button>
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Suivant
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Soumission en cours...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Soumettre la candidature
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};