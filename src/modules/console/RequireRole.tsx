import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import type { Role } from '../../lib/api/types';

type Props = { roles: Role[]; children: React.ReactNode };

/** Penjagaan role di level route; pengguna tanpa akses dialihkan ke ringkasan. */
export const RequireRole: React.FC<Props> = ({ roles, children }) => {
  const { role } = useAuth();
  if (!role || !roles.includes(role)) return <Navigate to="/app" replace />;
  return <>{children}</>;
};
