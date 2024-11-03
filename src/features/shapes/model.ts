import { ViewMode } from '../../types';

export type ShapeState = {
  currentView: ViewMode;
  previousView: ViewMode | null;
  isTransitioning: boolean;
  transitionPhase: 'start' | 'morph' | 'complete';
  isCrowned?: boolean;
  isReshuffling: boolean;
};

export type ShapeTransition = {
  from: ViewMode;
  to: ViewMode;
  duration: number;
  phases: {
    start: number;
    morph: number;
    complete: number;
  };
};

export const SHAPE_TRANSITIONS: Record<ViewMode, Record<ViewMode, ShapeTransition>> = {
  heart: {
    table: {
      duration: 2000,
      phases: {
        start: 500,   // Уменьшение и изменение цвета
        morph: 1000,  // Трансформация формы
        complete: 500 // Финальное позиционирование
      }
    },
    // ... другие переходы
  },
  table: {
    heart: {
      duration: 2000,
      phases: {
        start: 500,   // Группировка элементов
        morph: 1000,  // Формирование сердца
        complete: 500 // Включение пульсации и эффектов
      }
    },
    // ... другие переходы
  },
  // ... остальные состояния
};

// Добавим константы для цветов
export const SHAPE_COLORS = {
  HEART: {
    NORMAL: {
      background: 'rgba(255,0,0,',
      glow: 'rgba(255,0,0,'
    },
    CROWNED: {
      background: 'rgba(255,20,60,',
      glow: 'rgba(255,50,50,'
    }
  },
  STAR: {
    background: 'rgba(41,87,164,',
    glow: 'rgba(65,105,225,'
  },
  DEFAULT: {
    background: 'rgba(0,127,127,',
    glow: 'rgba(0,255,255,'
  }
}; 