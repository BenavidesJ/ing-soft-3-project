import React from 'react';
import { FaUser } from 'react-icons/fa';
import { getInitials } from '../../utils/getInitials';

interface UserData {
  nombre: string;
  username: string;
  correo: string;
  imagenPerfil?: string;
}

interface AvatarProps {
  user?: UserData;
  size?: number | string;
  backgroundColor?: string;
  color?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  user,
  size = 48,
  backgroundColor = '#ccc',
  color = '#fff',
  className = '',
}) => {
  const initials = getInitials(user?.nombre);
  return (
    <div
      className={`d-flex align-items-center justify-content-center rounded-circle overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor,
        color,
        fontWeight: 'bold',
        textTransform: 'uppercase',
      }}
    >
      <>
        {user ? (
          <>
            {' '}
            {user.imagenPerfil ? (
              <img
                src={user.imagenPerfil}
                alt="Foto de perfil"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span>{initials}</span>
            )}
          </>
        ) : (
          <FaUser size={Number(size) / 2} />
        )}
      </>
    </div>
  );
};
