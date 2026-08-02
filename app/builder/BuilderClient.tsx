'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ComponentItem, renderBuilderComponent } from '@/components/builder/ComponentRegistry';
import { PlusIcon, TrashIcon, SaveIcon, EyeIcon, LayoutIcon, CheckCircleIcon, SettingsIcon, ArrowUpIcon, ArrowDownIcon, PanelLeftCloseIcon, PanelLeftOpenIcon, PaintbrushIcon, MenuIcon, XIcon } from '@/components/ui/icons';
import { SortableItem } from './SortableItem';
import { savePageLayout, generateAiComponentAction } from './actions';
import { logout } from '@/app/login/actions';
import { isAiComponentEnabled } from '@/lib/featureFlags';

interface BuilderClientProps {
  initialComponents: ComponentItem[];
  tenantSlug: string;
  tournamentId?: string;
  tournamentSlug?: string;
  tournaments?: any[];
}

export default function BuilderClient({ initialComponents, tenantSlug, tournamentId, tournamentSlug, tournaments }: BuilderClientProps) {
  const [components, setComponents] = useState<ComponentItem[]>(initialComponents);

  const [savedStatus, setSavedStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileTab, setMobileTab] = useState<'palette' | 'canvas'>('canvas');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);

  const showAiComponent = isAiComponentEnabled();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px tolerance before drag starts (allows clicking to select)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addComponent = (type: ComponentItem['type']) => {
    const newComp: ComponentItem = {
      id: `comp-${Date.now()}`,
      type,
      props: {},
    };
    setComponents([...components, newComp]);
  };

  const removeComponent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
      setMobileTab('canvas');
    }
    setComponents(components.filter((c) => c.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSavedStatus(null);
    
    const response = await savePageLayout(components, tournamentId);
    
    setIsSaving(false);
    if (response.success) {
      setSavedStatus('Page Layout Saved to Database!');
      setTimeout(() => setSavedStatus(null), 3000);
    } else {
      setSavedStatus(`Error: ${response.error}`);
      setTimeout(() => setSavedStatus(null), 5000);
    }
  };

  const selectedComponent = components.find((c) => c.id === selectedComponentId);

  const updateSelectedComponentProp = (key: string, value: string) => {
    if (!selectedComponentId) return;
    setComponents((prev) =>
      prev.map((c) =>
        c.id === selectedComponentId
          ? { ...c, props: { ...c.props, [key]: value } }
          : c
      )
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateAi = async (promptText: string) => {
    if (!selectedComponentId) return;
    setIsGeneratingAi(true);
    setAiError(null);
    const response = await generateAiComponentAction(promptText, selectedImageBase64 || undefined);
    setIsGeneratingAi(false);
    if (response.success && response.htmlContent) {
      setComponents((prev) =>
        prev.map((c) =>
          c.id === selectedComponentId
            ? {
                ...c,
                props: {
                  ...c.props,
                  prompt: promptText,
                  htmlContent: response.htmlContent,
                },
              }
            : c
        )
      );
    } else {
      setAiError(response.error || 'Failed to generate component');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-black text-slate-950 shrink-0">
            <PaintbrushIcon size={18} />
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-none truncate max-w-[180px] sm:max-w-none">
              {tournamentId ? 'Tournament Page Builder' : 'Home Page Builder'}
            </h1>
            <span className="text-xs text-slate-400 truncate block max-w-[180px] sm:max-w-none">Tenant Workspace ({tenantSlug})</span>
          </div>
        </div>

        {/* Desktop Header Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-800 text-slate-300 text-sm font-medium transition-all mr-2"
          >
            ← Back to Dashboard
          </a>
          {savedStatus && (
            <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${savedStatus.includes('Error') ? 'text-red-400 bg-red-500/10 border border-red-500/30' : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'}`}>
              <CheckCircleIcon size={14} />
              {savedStatus}
            </div>
          )}
          <a
            href={tournamentSlug ? `/tenant/${tenantSlug}/tournaments/${tournamentSlug}` : `/tenant/${tenantSlug}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-all"
          >
            <EyeIcon size={16} />
            Preview Live Site
          </a>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:bg-sky-500/50 disabled:cursor-not-allowed text-slate-950 font-bold text-sm shadow-md transition-all"
          >
            <SaveIcon size={16} />
            {isSaving ? 'Saving...' : 'Save Layout'}
          </button>
          <div className="w-px h-6 bg-slate-800 mx-1"></div>
          <a
            href="/settings"
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all"
            title="Settings"
          >
            <SettingsIcon size={20} />
          </a>
          <form action={logout}>
            <button className="px-4 py-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-sm font-medium transition-all">
              Logout
            </button>
          </form>
        </div>

        {/* Mobile Header Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          {savedStatus && (
            <div className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-medium ${savedStatus.includes('Error') ? 'text-red-400 bg-red-500/10 border border-red-500/30' : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'}`}>
              <CheckCircleIcon size={12} />
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="p-2 rounded-lg bg-sky-500 text-slate-950 shadow-md disabled:bg-sky-500/50 flex items-center gap-1"
            title="Save Layout"
          >
            <SaveIcon size={16} />
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            {isMobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 flex flex-col gap-3 shadow-xl absolute w-full z-40 top-16">
          <a
            href="/dashboard"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300 text-sm font-medium"
          >
            ← Back to Dashboard
          </a>
          <a
            href={tournamentSlug ? `/tenant/${tenantSlug}/tournaments/${tournamentSlug}` : `/tenant/${tenantSlug}`}
            target="_blank"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300 text-sm font-medium"
          >
            <EyeIcon size={16} />
            Preview Live Site
          </a>
          <a
            href="/settings"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300 text-sm font-medium"
          >
            <SettingsIcon size={16} />
            Settings
          </a>
          <form action={logout}>
            <button className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-rose-400 text-sm font-medium">
              Logout
            </button>
          </form>
        </div>
      )}

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex bg-slate-900 border-b border-slate-800 text-sm z-30 relative shrink-0">
        <button onClick={() => setMobileTab('palette')} className={`flex-1 py-3 text-center font-semibold border-b-2 transition-colors ${mobileTab === 'palette' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400'}`}>
          Palette
        </button>
        <button onClick={() => setMobileTab('canvas')} className={`flex-1 py-3 text-center font-semibold border-b-2 transition-colors ${mobileTab === 'canvas' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400'}`}>
          Canvas
        </button>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Component Palette */}
        <aside className={`${mobileTab === 'palette' ? 'flex w-full' : 'hidden'} lg:flex ${isSidebarOpen ? 'lg:w-72 p-5' : 'lg:w-16 lg:p-4 flex-col items-center'} border-r border-slate-800 bg-slate-900/50 transition-all duration-300 overflow-y-auto overflow-x-hidden relative shrink-0`}>
          {isSidebarOpen ? (
            <div className="space-y-6 w-full whitespace-nowrap">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <LayoutIcon size={14} />
                  Add Components
                </h3>
                <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800" title="Collapse Sidebar">
                  <PanelLeftCloseIcon size={16} />
                </button>
              </div>
              <div className="space-y-2.5">
              <button
                onClick={() => addComponent('HeroBanner')}
                className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-sky-600/20 hover:border-sky-500/50 border border-slate-700/80 transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-sm text-white group-hover:text-sky-400">Hero Banner</div>
                  <div className="text-xs text-slate-400">Title, CTA & Dates</div>
                </div>
                <PlusIcon size={16} className="text-slate-400 group-hover:text-sky-400" />
              </button>

              {!tournamentId && (
                <button
                  onClick={() => addComponent('TournamentList')}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-sky-600/20 hover:border-sky-500/50 border border-slate-700/80 transition-all group flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-sm text-white group-hover:text-sky-400">Tournament List</div>
                    <div className="text-xs text-slate-400">Active & upcoming events</div>
                  </div>
                  <PlusIcon size={16} className="text-slate-400 group-hover:text-sky-400" />
                </button>
              )}

              {tournamentId && (
                <button
                  onClick={() => addComponent('LiveBracketEmbed')}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-sky-600/20 hover:border-sky-500/50 border border-slate-700/80 transition-all group flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-sm text-white group-hover:text-sky-400">Live Bracket</div>
                    <div className="text-xs text-slate-400">Interactive bracket tree</div>
                  </div>
                  <PlusIcon size={16} className="text-slate-400 group-hover:text-sky-400" />
                </button>
              )}

              <button
                onClick={() => addComponent('SponsorGrid')}
                className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-sky-600/20 hover:border-sky-500/50 border border-slate-700/80 transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-sm text-white group-hover:text-sky-400">Sponsor Grid</div>
                  <div className="text-xs text-slate-400">Partner logos & tiers</div>
                </div>
                <PlusIcon size={16} className="text-slate-400 group-hover:text-sky-400" />
              </button>

              {tournamentId && (
                <button
                  onClick={() => addComponent('LocationLogistics')}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-sky-600/20 hover:border-sky-500/50 border border-slate-700/80 transition-all group flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-sm text-white group-hover:text-sky-400">Location & Venue</div>
                    <div className="text-xs text-slate-400">Parking & Facility rules</div>
                  </div>
                  <PlusIcon size={16} className="text-slate-400 group-hover:text-sky-400" />
                </button>
              )}

              {showAiComponent && (
                <button
                  onClick={() => addComponent('AIDynamicBlock')}
                  className="w-full text-left p-3 rounded-xl bg-gradient-to-r from-sky-900/40 to-indigo-900/40 hover:from-sky-800/60 hover:to-indigo-800/60 border border-sky-500/40 transition-all group flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-sm text-sky-300 group-hover:text-white flex items-center gap-1.5">
                      <span>✨ AI Custom Component</span>
                    </div>
                    <div className="text-xs text-slate-400">Prompt or upload screenshot</div>
                  </div>
                  <PlusIcon size={16} className="text-sky-400 group-hover:text-white" />
                </button>
              )}
              </div>
            </div>
          ) : (
            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/80" title="Expand Sidebar">
              <PanelLeftOpenIcon size={20} />
            </button>
          )}
        </aside>

        {/* Center Canvas: Live Page Canvas with Drag and Drop */}
        <main className={`${mobileTab === 'canvas' ? 'block' : 'hidden'} lg:block flex-1 bg-slate-950 p-4 lg:p-8 overflow-y-auto`} onClick={() => { setSelectedComponentId(null); setMobileTab('canvas'); }}>
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="text-xs text-slate-500 font-mono mb-4 uppercase tracking-widest text-center">
              Live Interactive Page Canvas ({components.length} components)
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={components.map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {components.map((comp) => (
                  <SortableItem key={comp.id} id={comp.id}>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedComponentId(comp.id);
                      }}
                      className={`relative group border-2 rounded-3xl transition-all p-1 cursor-grab active:cursor-grabbing touch-manipulation ${selectedComponentId === comp.id ? 'border-sky-500 shadow-[0_0_0_4px_rgba(14,165,233,0.15)]' : 'border-transparent hover:border-sky-500/50'}`}
                    >
                      {/* Component Action Controls */}
                      <div className={`absolute top-4 right-4 z-20 transition-opacity bg-slate-900/90 border border-slate-700 p-1.5 rounded-xl flex items-center gap-1 shadow-xl backdrop-blur-md ${selectedComponentId === comp.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <button
                          onClick={(e) => removeComponent(comp.id, e)}
                          className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg"
                          title="Remove Component"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>

                      {/* Render Component */}
                      <div className="pointer-events-none">
                        {renderBuilderComponent(comp, { tournaments, basePath: `/tenant/${tenantSlug}` })}
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </main>

        {/* Properties Modal */}
        {selectedComponent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedComponentId(null)}
            ></div>
            
            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <SettingsIcon size={18} className="text-sky-400" />
                  <h3 className="font-bold text-white text-sm">Edit Component Properties</h3>
                </div>
                <button 
                  onClick={() => setSelectedComponentId(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <XIcon size={18} />
                </button>
              </div>
              
              <div className="p-5 overflow-y-auto">
                <div className="space-y-4">
              <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 mb-6">
                <span className="text-xs text-slate-400 uppercase tracking-widest">Editing</span>
                <div className="font-bold text-sky-400">{selectedComponent.type}</div>
                <div className="text-xs text-slate-500 font-mono mt-1">{selectedComponent.id}</div>
              </div>

              {/* Dynamic Form based on component type */}
              {selectedComponent.type === 'HeroBanner' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                    <input
                      type="text"
                      value={selectedComponent.props.title || ''}
                      onChange={(e) => updateSelectedComponentProp('title', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle</label>
                    <textarea
                      value={selectedComponent.props.subtitle || ''}
                      onChange={(e) => updateSelectedComponentProp('subtitle', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 h-24 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                    <input
                      type="text"
                      value={selectedComponent.props.date || ''}
                      onChange={(e) => updateSelectedComponentProp('date', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                    <input
                      type="text"
                      value={selectedComponent.props.location || ''}
                      onChange={(e) => updateSelectedComponentProp('location', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">CTA Text</label>
                    <input
                      type="text"
                      value={selectedComponent.props.ctaText || ''}
                      onChange={(e) => updateSelectedComponentProp('ctaText', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">CTA Link</label>
                    <input
                      type="text"
                      value={selectedComponent.props.ctaLink || ''}
                      onChange={(e) => updateSelectedComponentProp('ctaLink', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              )}

              {selectedComponent.type === 'LiveBracketEmbed' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Division Name</label>
                    <input
                      type="text"
                      value={selectedComponent.props.divisionName || ''}
                      onChange={(e) => updateSelectedComponentProp('divisionName', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Format</label>
                    <input
                      type="text"
                      value={selectedComponent.props.format || ''}
                      onChange={(e) => updateSelectedComponentProp('format', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              )}

              {selectedComponent.type === 'SponsorGrid' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                    <input
                      type="text"
                      value={selectedComponent.props.title || ''}
                      onChange={(e) => updateSelectedComponentProp('title', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              )}

              {selectedComponent.type === 'LocationLogistics' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Venue Name</label>
                    <input
                      type="text"
                      value={selectedComponent.props.venueName || ''}
                      onChange={(e) => updateSelectedComponentProp('venueName', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Address</label>
                    <input
                      type="text"
                      value={selectedComponent.props.address || ''}
                      onChange={(e) => updateSelectedComponentProp('address', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              )}

              {selectedComponent.type === 'TournamentList' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                    <input
                      type="text"
                      value={selectedComponent.props.title || ''}
                      onChange={(e) => updateSelectedComponentProp('title', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                    <input
                      type="text"
                      value={selectedComponent.props.description || ''}
                      onChange={(e) => updateSelectedComponentProp('description', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              )}

              {selectedComponent.type === 'AIDynamicBlock' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-sky-400 mb-1">AI Prompt</label>
                    <textarea
                      value={selectedComponent.props.prompt || ''}
                      onChange={(e) => updateSelectedComponentProp('prompt', e.target.value)}
                      placeholder="e.g. Prize pool breakdown with 3 tier cards, FAQ accordion, Schedule timeline..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 h-20 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-sky-400 mb-1">
                      Reference Image / Wireframe (Vision Input)
                    </label>
                    {selectedImageBase64 ? (
                      <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 p-2 group">
                        <img
                          src={selectedImageBase64}
                          alt="Reference visual layout"
                          className="w-full h-28 object-cover rounded-md"
                        />
                        <button
                          onClick={() => setSelectedImageBase64(null)}
                          className="absolute top-3 right-3 bg-red-500/90 text-white p-1 rounded-full hover:bg-red-600 transition-all text-xs w-6 h-6 flex items-center justify-center font-bold"
                          title="Remove reference image"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer bg-slate-950/60 hover:bg-slate-900 hover:border-sky-500/50 transition-all text-center p-3">
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-xs font-semibold text-slate-300">🖼️ Upload screenshot / wireframe</span>
                          <span className="text-[10px] text-slate-500 mt-1">PNG, JPG, WEBP</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <button
                    onClick={() => handleGenerateAi(selectedComponent.props.prompt || '')}
                    disabled={isGeneratingAi || (!selectedComponent.props.prompt && !selectedImageBase64)}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>✨</span>
                    {isGeneratingAi ? 'Generating UI...' : 'Generate with AI'}
                  </button>
                  {aiError && (
                    <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 p-2 rounded-lg">
                      {aiError}
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-800 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Section Title (Optional)</label>
                      <input
                        type="text"
                        value={selectedComponent.props.title || ''}
                        onChange={(e) => updateSelectedComponentProp('title', e.target.value)}
                        placeholder="e.g. Official Prize Pool"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Raw HTML Content</label>
                      <textarea
                        value={selectedComponent.props.htmlContent || ''}
                        onChange={(e) => updateSelectedComponentProp('htmlContent', e.target.value)}
                        placeholder="Generated HTML content will appear here..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-sky-500 h-32 resize-y"
                      />
                    </div>
                  </div>
                </div>
              )}
                </div>
              </div>
              
              <div className="p-4 border-t border-slate-800 bg-slate-800/30 flex justify-between items-center shrink-0">
                <button 
                  onClick={(e) => removeComponent(selectedComponent.id, e)}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                  <TrashIcon size={16} />
                  Remove
                </button>
                <button 
                  onClick={() => setSelectedComponentId(null)}
                  className="px-6 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-sm font-bold rounded-lg transition-colors shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
