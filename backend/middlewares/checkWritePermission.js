export const checkWritePermission = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado.',
      });
    }

    const roles = req.user.Rols || [];
    const permisos = roles.reduce((acc, rol) => {
      if (rol.Permisos && Array.isArray(rol.Permisos)) {
        rol.Permisos.forEach((permiso) => {
          if (!acc.includes(permiso.NombrePermiso)) {
            acc.push(permiso.NombrePermiso);
          }
        });
      }
      return acc;
    }, []);

    if (!permisos.includes('ESCRITURA')) {
      return res.status(403).json({
        success: false,
        message:
          'El usuario no tiene permiso para realizar esta operación. Contacte a un administrador.',
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
