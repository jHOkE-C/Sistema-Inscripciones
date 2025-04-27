export interface ButtonConfig {
  label: string;
  to: string;
  Icon: React.ElementType;
  color: string;
}
export interface ButtonsGridProps {
    buttons: ButtonConfig[];
    children?: React.ReactNode;
  }