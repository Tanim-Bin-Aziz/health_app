import { ReactNode } from "react";

export interface Doctor {
  id: string;
  email: string;
  name: string;
  profilePhoto: string;
  contactNumber: string;
  address: string | null;
  registrationNumber: string;
  experience: number;
  gender: "MALE" | "FEMALE";
  apointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  averageRating: number;
  review: any[];
  doctorSpecialties: DoctorSpecialty[];
}

export interface DoctorSpecialty {
  specialtiesId: string;
  doctorId: string;
  specialties: {
    title: any;
    id: string;
    name: string;
    isDeleted: boolean;
  };
}

export interface IDoctor {
  email: ReactNode;
  id?: string;
  name: string;
  profilePhoto: string;
  contactNumber: string;
  address: string;
  registrationNumber: string;
  experience: number;
  gender: "MALE" | "FEMALE";
  apointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  specialties: ISpecialties[];
}

export interface ISpecialties {
  specialtiesId: string;
  isDeleted?: boolean | null;
}

export interface IDoctorFormData {
  doctor: IDoctor;
  password: string;
}
