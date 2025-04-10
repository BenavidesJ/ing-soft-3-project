import { BrandName } from './strings';

export const getPageName = (path: string) => {
  switch (path) {
    case '/dashboard':
      return 'Dashboard';
    case '/gestion-proyectos':
      return 'Gestión Proyectos';
    case '/gestion-tareas':
      return 'Gestión Tareas';
    case '/gestion-usuarios':
      return 'Gestión Usuarios';
    case '/gestion-recursos':
      return 'Gestión Recursos';
    case '/reportes':
      return 'Reportes';
    default:
      return BrandName;
  }
};
