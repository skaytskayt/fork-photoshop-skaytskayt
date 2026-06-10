export interface KernelPreset {
  label: string;
  values: number[];
}

export const KERNEL_PRESETS: KernelPreset[] = [
  {
    label: 'Тождественное отображение',
    values: [0, 0, 0, 0, 1, 0, 0, 0, 0],
  },
  {
    label: 'Повышение резкости',
    values: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
  },
  {
    label: 'Фильтр Гаусса 3×3',
    values: [1, 2, 1, 2, 4, 2, 1, 2, 1],
  },
  {
    label: 'Прямоугольное размытие',
    values: [1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  {
    label: 'Оператор Прюитта (горизонт.)',
    values: [-1, 0, 1, -1, 0, 1, -1, 0, 1],
  },
  {
    label: 'Оператор Прюитта (вертик.)',
    values: [-1, -1, -1, 0, 0, 0, 1, 1, 1],
  },
];
