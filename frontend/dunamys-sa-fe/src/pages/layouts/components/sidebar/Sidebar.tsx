import { Link } from 'react-router';
import { BrandName } from '../../../../utils/strings';
import { Button, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { LuChevronsLeft, LuChevronsRight } from 'react-icons/lu';
import '../../styles/Dashboard.scss';
import { useCallback, useState } from 'react';
import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { GoProjectSymlink } from 'react-icons/go';
import { TbReportAnalytics } from 'react-icons/tb';
import { FaTasks, FaUsersCog } from 'react-icons/fa';
import { GrResources } from 'react-icons/gr';

export const Sidebar = () => {
  const [toggleSideBar, setToggleSideBar] = useState(false);

  const handleToggle = useCallback(() => {
    setToggleSideBar(!toggleSideBar);
  }, [toggleSideBar]);

  return (
    <aside id="sidebar" className={toggleSideBar ? 'expand' : ''}>
      <div className="d-flex justify-content-between p-4">
        <div className="sidebar-logo">
          <Link to={'/'} replace>
            {BrandName}
          </Link>
        </div>
        <Button
          className="toggle-btn border-0"
          type="button"
          onClick={handleToggle}
        >
          {!toggleSideBar ? (
            <LuChevronsRight size={20} className="icon" />
          ) : (
            <LuChevronsLeft size={20} className="icon" />
          )}
        </Button>
      </div>
      <Nav className="sidebar-nav" defaultActiveKey="/dashboard">
        <Nav.Link as={Link} to="/dashboard" className="sidebar-item">
          <OverlayTrigger
            placement="top"
            overlay={!toggleSideBar ? <Tooltip>Dashboard</Tooltip> : <></>}
          >
            <div className="sidebar-link">
              <MdOutlineSpaceDashboard className="icon" />
              <span>Dashboard</span>
            </div>
          </OverlayTrigger>
        </Nav.Link>
        <Nav.Link as={Link} to="/gestion-proyectos" className="sidebar-item">
          <OverlayTrigger
            placement="top"
            overlay={
              !toggleSideBar ? <Tooltip>Gestión de Proyectos</Tooltip> : <></>
            }
          >
            <div className="sidebar-link">
              <GoProjectSymlink className="icon" />
              <span>Gestión de Proyectos</span>
            </div>
          </OverlayTrigger>
        </Nav.Link>
        <Nav.Link as={Link} to="/gestion-tareas" className="sidebar-item">
          <OverlayTrigger
            placement="top"
            overlay={
              !toggleSideBar ? <Tooltip>Gestión de Tareas</Tooltip> : <></>
            }
          >
            <div className="sidebar-link">
              <FaTasks className="icon" />
              <span>Gestión de Tareas</span>
            </div>
          </OverlayTrigger>
        </Nav.Link>
        <Nav.Link as={Link} to="/gestion-recursos" className="sidebar-item">
          <OverlayTrigger
            placement="top"
            overlay={
              !toggleSideBar ? <Tooltip>Gestión de Recursos</Tooltip> : <></>
            }
          >
            <div className="sidebar-link">
              <GrResources className="icon" />
              <span>Gestión de Recursos</span>
            </div>
          </OverlayTrigger>
        </Nav.Link>
        <Nav.Link as={Link} to="/gestion-usuarios" className="sidebar-item">
          <OverlayTrigger
            placement="top"
            overlay={
              !toggleSideBar ? <Tooltip>Gestión de Usuarios</Tooltip> : <></>
            }
          >
            <div className="sidebar-link">
              <FaUsersCog className="icon" />
              <span>Gestión de Usuarios</span>
            </div>
          </OverlayTrigger>
        </Nav.Link>
        <Nav.Link as={Link} to="/reportes" className="sidebar-item">
          <OverlayTrigger
            placement="top"
            overlay={!toggleSideBar ? <Tooltip>Reportes</Tooltip> : <></>}
          >
            <div className="sidebar-link">
              <TbReportAnalytics className="icon" />
              <span>Reportes</span>
            </div>
          </OverlayTrigger>
        </Nav.Link>
      </Nav>
    </aside>
  );
};
