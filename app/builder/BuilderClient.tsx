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
import { PlusIcon, TrashIcon, SaveIcon, EyeIcon, LayoutIcon, CheckCircleIcon, SettingsIcon, ArrowUpIcon, ArrowDownIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from '@/components/ui/icons';
import { SortableItem } from './SortableItem';
import { savePageLayout } from './actions';
import { logout } from '@/app/login/actions';

interface BuilderClientProps {
  initialComponents: ComponentItem[];
  tenantSlug: string;
}

export default function BuilderClient({ initialComponents, tenantSlug }: BuilderClientProps) {
  const [components, setComponents] = useState<ComponentItem[]>(initialComponents);

  const [savedStatus, setSavedStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    
    const response = await savePageLayout(components);
    
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 px-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-black text-slate-950">
            B
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-none">Drag-and-Drop Page Builder</h1>
            <span className="text-xs text-slate-400">Tenant Workspace ({tenantSlug})</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedStatus && (
            <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${savedStatus.includes('Error') ? 'text-red-400 bg-red-500/10 border border-red-500/30' : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'}`}>
              <CheckCircleIcon size={14} />
              {savedStatus}
            </div>
          )}
          <a
            href={`/tenant/${tenantSlug}`}
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
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Component Palette */}
        <aside className={`${isSidebarOpen ? 'w-72 p-5' : 'w-16 p-4 flex flex-col items-center'} border-r border-slate-800 bg-slate-900/50 transition-all duration-300 overflow-y-auto overflow-x-hidden relative shrink-0`}>
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
              </div>
            </div>
          ) : (
            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/80" title="Expand Sidebar">
              <PanelLeftOpenIcon size={20} />
            </button>
          )}
        </aside>

        {/* Center Canvas: Live Page Canvas with Drag and Drop */}
        <main className="flex-1 bg-slate-950 p-8 overflow-y-auto" onClick={() => setSelectedComponentId(null)}>
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
                      className={`relative group border-2 rounded-3xl transition-all p-1 cursor-grab active:cursor-grabbing ${selectedComponentId === comp.id ? 'border-sky-500 shadow-[0_0_0_4px_rgba(14,165,233,0.15)]' : 'border-transparent hover:border-sky-500/50'}`}
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
                        {renderBuilderComponent(comp)}
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </main>

        {/* Right Sidebar: CMS Properties Editor */}
        <aside className="w-80 border-l border-slate-800 bg-slate-900/50 p-5 overflow-y-auto">
          <div className="flex items-center gap-2 mb-6">
            <SettingsIcon size={16} className="text-sky-400" />
            <h3 className="font-bold text-white uppercase tracking-widest text-sm">Component CMS</h3>
          </div>
          
          {selectedComponent ? (
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
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500">
              <SettingsIcon size={32} className="mb-3 opacity-20" />
              <p className="text-sm">Select a component on the canvas to edit its properties.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
