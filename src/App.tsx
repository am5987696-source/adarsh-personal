/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { LandingPage } from './pages/LandingPage';
import { DashboardOverview } from './pages/DashboardOverview';
import { SafetyMonitorModule } from './pages/SafetyMonitorModule';
import { CrackDetectionModule } from './pages/CrackDetectionModule';
import { PropertyValuationModule } from './pages/PropertyValuationModule';
import { ProjectPlannerModule } from './pages/ProjectPlannerModule';
import { DailySiteAssistantModule } from './pages/DailySiteAssistantModule';
import { WeatherAdvisoryModule } from './pages/WeatherAdvisoryModule';
import { KnowledgeBaseModule } from './pages/KnowledgeBaseModule';
import { ProjectsManagementModule } from './pages/ProjectsManagementModule';
import { SettingsModule } from './pages/SettingsModule';
import { Project, SafetyInspection, CrackAnalysis, ValuationEstimate, ProjectPlan, User } from './types';
import { api } from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Core application data
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [safetyInspections, setSafetyInspections] = useState<SafetyInspection[]>([]);
  const [crackAnalyses, setCrackAnalyses] = useState<CrackAnalysis[]>([]);
  const [valuations, setValuations] = useState<ValuationEstimate[]>([]);
  const [projectPlans, setProjectPlans] = useState<ProjectPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Global search query
  const [globalSearch, setGlobalSearch] = useState<string>('');

  const loadAllData = async () => {
    try {
      const [userRes, projRes, safeRes, crackRes, valRes] = await Promise.all([
        api.getMe(),
        api.getProjects(),
        api.getSafetyHistory(),
        api.getCrackHistory(),
        api.getValuationHistory(),
      ]);

      setCurrentUser(userRes.user);
      setProjects(projRes.projects || []);
      if (projRes.projects && projRes.projects.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projRes.projects[0].id);
      }
      setSafetyInspections(safeRes.inspections || []);
      setCrackAnalyses(crackRes.records || []);
      setValuations(valRes.valuations || []);
    } catch (err) {
      console.error('Error loading initial applet data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleNavigateToModule = (module: string, projectId?: string) => {
    if (projectId) setSelectedProjectId(projectId);
    setCurrentView(module);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isPublicView = currentView === 'landing';

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#142B4A] flex flex-col font-sans">
      {isPublicView ? (
        // Public Landing Page layout with full Navbar & Footer
        <>
          <Navbar onNavigate={setCurrentView} currentView={currentView} />
          <main className="flex-1">
            <LandingPage onNavigate={setCurrentView} />
          </main>
          <Footer onNavigate={setCurrentView} />
        </>
      ) : (
        // App Dashboard layout with Left Sidebar & TopNav
        <div className="flex flex-1">
          <Sidebar
            currentView={currentView}
            onNavigate={setCurrentView}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            currentUser={currentUser}
          />

          <div
            className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
              sidebarCollapsed ? 'ml-20' : 'ml-64'
            }`}
          >
            <TopNav
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              currentUser={currentUser}
              onSearch={setGlobalSearch}
              onNavigate={setCurrentView}
            />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {currentView === 'dashboard' && (
                <DashboardOverview
                  onNavigate={setCurrentView}
                  projects={projects}
                  inspections={safetyInspections}
                  cracks={crackAnalyses}
                  plans={projectPlans}
                />
              )}

              {currentView === 'projects' && (
                <ProjectsManagementModule
                  projects={projects}
                  onRefreshData={loadAllData}
                  onNavigateToModule={handleNavigateToModule}
                />
              )}

              {currentView === 'safety' && (
                <SafetyMonitorModule
                  projects={projects}
                  selectedProjectId={selectedProjectId}
                  onRefreshData={loadAllData}
                  inspections={safetyInspections}
                />
              )}

              {currentView === 'cracks' && (
                <CrackDetectionModule
                  projects={projects}
                  selectedProjectId={selectedProjectId}
                  onRefreshData={loadAllData}
                  crackAnalyses={crackAnalyses}
                />
              )}

              {currentView === 'valuation' && (
                <PropertyValuationModule
                  valuations={valuations}
                  onRefreshData={loadAllData}
                />
              )}

              {currentView === 'planner' && (
                <ProjectPlannerModule
                  plans={projectPlans}
                  onRefreshData={loadAllData}
                />
              )}

              {currentView === 'assistant' && (
                <DailySiteAssistantModule
                  projects={projects}
                  selectedProjectId={selectedProjectId}
                />
              )}

              {currentView === 'weather' && (
                <WeatherAdvisoryModule
                  defaultLocation={projects.find((p) => p.id === selectedProjectId)?.location}
                />
              )}

              {currentView === 'knowledge' && (
                <KnowledgeBaseModule />
              )}

              {currentView === 'settings' && (
                <SettingsModule currentUser={currentUser} />
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
