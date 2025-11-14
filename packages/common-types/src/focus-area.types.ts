export interface IFocusArea {
  _id: string;
  title: string;
  slug: string;
  description: string;
  icon: string; // emoji or icon name
  gradient: string; // Tailwind gradient classes
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
