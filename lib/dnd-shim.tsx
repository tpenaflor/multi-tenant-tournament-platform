import React from 'react';

export const DndContext: React.FC<{ children: React.ReactNode; [key: string]: any }> = ({ children }) => (
  <div>{children}</div>
);

export const SortableContext: React.FC<{ children: React.ReactNode; [key: string]: any }> = ({ children }) => (
  <div>{children}</div>
);

export const closestCenter = () => {};
export const PointerSensor = () => {};
export const KeyboardSensor = () => {};
export const useSensor = (sensor?: any, options?: any) => {};
export const useSensors = (...sensors: any[]) => [];
export const sortableKeyboardCoordinates = () => {};
export const verticalListSortingStrategy = {};

export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = array.slice();
  newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);
  return newArray;
}

export function useSortable({ id }: { id: string }) {
  return {
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: undefined,
    transition: undefined,
  };
}

export const CSS = {
  Transform: {
    toString: (transform: any) => undefined,
  },
};
