// HACER HIGHER ORDER FUNCTION PARA ESTAS COSAS

import { add, sub } from 'date-fns';

export function widthPxToPc(px, parent) {
  return (px / parent.offsetWidth) * 100;
}

export function heightPxToPc(px, parent) {
  return (px / parent.offsetHeight) * 100;
}

export function isDark(color) {
  const hex = color.substring(1, 7);
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 < 120;
}

export function changeDate(date, direction = 'forward') {
  if (direction === 'backward') {
    return sub(date, { days: 7 });
  }
  return add(date, { days: 7 });
}
