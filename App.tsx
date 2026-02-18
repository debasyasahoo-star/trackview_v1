import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthState, UserRole, Project, ProjectStatus, ShiftInventory } from './types';
import Layout from './components/Layout';
import Login from './pages/Login';
import AdminProjectSetup from './pages/AdminProjectSetup';
import Dashboard from './pages/Dashboard';
import RequirementsEntry from './pages/RequirementsEntry';
import MasterDataUpload from './pages/MasterDataUpload';
import WarehouseReceiving from './pages/WarehouseReceiving';
import DispatchSetup from './pages/DispatchSetup';
import DispatchTracking from './pages/DispatchTracking';
import ClientConfirmation from './pages/ClientConfirmation';
import LockMapping from './pages/LockMapping';
import Reports from './pages/Reports';
import ReverseLogistics from './pages/ReverseLogistics';
import UserManual from './pages/UserManual';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('trackview_auth');
    return saved ? JSON.parse(saved) : { user: null, activeProject: null };
  });

  const createDefaultShift = (id: string, name: string): ShiftInventory => ({
    id,
    shiftName: name,
    startTime: '09:00',
    endTime: '12:00',
    gpsLocks: { enabled: true, quantity: 2250, nomenclature: 'SmartLock v3' },
    chargers: { enabled: true, quantity: 125, nomenclature: 'RapidCharger v1' },
    adaptors: { enabled: true, quantity: 125, nomenclature: 'IO-Hub v2' },
    rfidMaster: { enabled: true, quantity: 25, nomenclature: 'Master-Card-Tier1' },
    rfidUnique: { enabled: true, quantity: 600, nomenclature: 'Center-Tag-v4' }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('trackview_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure all stored projects have necessary passcode fields
        return parsed.map((p: any) => ({
          ...p,
          projectPasscode: p.projectPasscode || 'oss',
          adminPasscode: p.adminPasscode || 'oss'
        }));
      } catch (e) {
        console.error("Critical: Failed to restore projects from registry storage.", e);
      }
    }
    // Default initial project as requested: OSS / oss
    return [
      {
        id: '1',
        name: 'Operational Security System',
        client: 'Global Operations Control',
        code: 'OSS',
        examDate: '2024-12-31',
        status: ProjectStatus.REQUIREMENTS,
        totalCenters: 100,
        totalLocks: 500,
        shifts: [createDefaultShift('s1', 'Shift 1')],
        manualRequirements: [],
        projectPasscode: 'oss',
        adminPasscode: 'oss'
      }
    ];
  });

  // Persist authentication state changes
  useEffect(() => {
    localStorage.setItem('trackview_auth', JSON.stringify(auth));
  }, [auth]);

  // Persist project registry changes
  useEffect(() => {
    localStorage.setItem('trackview_projects', JSON.stringify(projects));
  }, [projects]);

  /**
   * Role-based login validation
   * Admin role uses 'adminPasscode'
   * All other roles (OPS, WAREHOUSE, CLIENT) use 'projectPasscode'
   */
  const handleLogin = (role: UserRole, projectCode: string, passcode: string) => {
    const normalizedCode = projectCode.trim().toUpperCase();
    console.debug(`[AUTH] Login Attempt - Role: ${role}, Code: ${normalizedCode}`);
    
    // Locate project in the registry
    const project = projects.find(p => p.code.trim().toUpperCase() === normalizedCode);
    
    if (!project) {
      alert(`AUTH_FAILURE: Project code "${projectCode}" not found in active registry.`);
      return;
    }

    // Role-specific credential validation
    const targetPasscode = role === UserRole.ADMIN ? project.adminPasscode : project.projectPasscode;
    const isAuthorized = passcode === targetPasscode;

    if (isAuthorized) {
      console.debug(`[AUTH] Success - Access granted to ${role} for project ${project.code}`);
      setAuth({
        user: { role, name: role === UserRole.ADMIN ? 'System Admin' : `${role} Operator` },
        activeProject: project
      });
    } else {
      console.warn(`[AUTH] Denied - Incorrect passcode for ${role} role.`);
      alert(`AUTH_DENIED: Invalid passcode for the ${role} role in project ${project.code}.`);
    }
  };

  const handleLogout = () => {
    console.debug("[AUTH] Session terminated.");
    setAuth({ user: null, activeProject: null });
  };

  const updateProject = (updatedProject: Project) => {
    console.debug(`[REGISTRY] Updating project metadata: ${updatedProject.code}`);
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    
    // If the updated project is the currently active one, sync the session state
    if (auth.activeProject?.id === updatedProject.id) {
      setAuth(prev => ({ ...prev, activeProject: updatedProject }));
    }
  };

  const addProject = (newProject: Project) => {
    console.debug(`[REGISTRY] Provisioning new project node: ${newProject.code}`);
    setProjects(prev => [...prev, newProject]);
  };

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!auth.user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" replace />} 
        />
        <Route path="/manual" element={<UserManual />} />
        
        {auth.user ? (
          <Route element={<Layout user={auth.user} project={auth.activeProject} onLogout={handleLogout} />}>
            <Route path="/dashboard" element={<Dashboard project={auth.activeProject} />} />
            
            {(auth.user.role === UserRole.ADMIN) && (
              <Route path="/admin/setup" element={
                <AdminProjectSetup 
                  projects={projects} 
                  onAddProject={addProject} 
                  onUpdateProject={updateProject}
                  onSelectProject={(p) => setAuth(prev => ({ ...prev, activeProject: p }))}
                />
              } />
            )}
            
            {(auth.user.role === UserRole.ADMIN || auth.user.role === UserRole.IIL_OPS) && (
              <Route path="/requirements" element={<RequirementsEntry project={auth.activeProject} onUpdate={updateProject} />} />
            )}
            
            {(auth.user.role === UserRole.ADMIN || auth.user.role === UserRole.IIL_OPS) && (
              <Route path="/master-data" element={<MasterDataUpload project={auth.activeProject} />} />
            )}

            {(auth.user.role === UserRole.ADMIN || auth.user.role === UserRole.WAREHOUSE) && (
              <Route path="/dispatch-setup" element={<DispatchSetup projectCode={auth.activeProject?.code || ''} />} />
            )}

            {(auth.user.role === UserRole.ADMIN || auth.user.role === UserRole.WAREHOUSE || auth.user.role === UserRole.IIL_OPS) && (
              <Route path="/warehouse" element={<WarehouseReceiving role={auth.user.role} project={auth.activeProject} />} />
            )}

            <Route path="/dispatch-tracking" element={<DispatchTracking project={auth.activeProject} />} />

            {(auth.user.role === UserRole.ADMIN || auth.user.role === UserRole.CLIENT) && (
              <Route path="/client-confirmation" element={<ClientConfirmation />} />
            )}

            {(auth.user.role === UserRole.ADMIN || auth.user.role === UserRole.IIL_OPS || auth.user.role === UserRole.CLIENT) && (
              <Route path="/lock-mapping" element={<LockMapping project={auth.activeProject} />} />
            )}
            
            <Route path="/reports" element={<Reports role={auth.user.role} project={auth.activeProject} />} />
            <Route path="/returns" element={<ReverseLogistics role={auth.user.role} project={auth.activeProject} />} />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </HashRouter>
  );
};

export default App;