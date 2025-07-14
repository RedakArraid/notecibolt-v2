export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
    isActive: boolean;
    emailVerifiedAt?: Date;
  };
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  avatar?: string;
  
  // Champs spécifiques aux étudiants
  parentIds?: string[];
  allergies?: string[];
  medications?: string[];
  emergencyMedicalContact?: string;
  
  // Champs spécifiques aux enseignants
  department?: string;
  qualifications?: string[];
  
  // Champs spécifiques aux parents
  occupation?: string;
  preferredContactMethod?: 'EMAIL' | 'SMS' | 'PHONE';
  
  // Champs spécifiques aux administrateurs
  permissions?: string[];
}

export interface UserWithDetails {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  role: string;
  isActive: boolean;
  lastLoginAt?: Date;
  emailVerifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations conditionnelles selon le rôle
  student?: {
    id: string;
    studentId: string;
    classId?: string;
    class?: {
      id: string;
      name: string;
      level: string;
    };
    parentIds: string[];
    parents: Array<{
      id: string;
      user: {
        id: string;
        name: string;
        email: string;
        phone?: string;
      };
    }>;
    admissionDate: Date;
    academicYear: string;
    allergies: string[];
    medications: string[];
    emergencyMedicalContact?: string;
  };
  
  teacher?: {
    id: string;
    employeeId: string;
    department: string;
    qualifications: string[];
    hireDate: Date;
    subjects: Array<{
      subject: {
        id: string;
        name: string;
        code: string;
      };
    }>;
    classes: Array<{
      class: {
        id: string;
        name: string;
        level: string;
      };
      isMainTeacher: boolean;
    }>;
  };
  
  parent?: {
    id: string;
    occupation?: string;
    preferredContactMethod: string;
    children: Array<{
      id: string;
      user: {
        id: string;
        name: string;
        email: string;
      };
      class?: {
        id: string;
        name: string;
        level: string;
      };
    }>;
  };
  
  admin?: {
    id: string;
    permissions: string[];
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthTokenPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  userId: string;
  iat: number;
  exp: number;
}
