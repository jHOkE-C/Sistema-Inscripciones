export interface ButtonConfig {
    label: string;
    to: string;
    Icon: React.ElementType;
    color?:
        | "indigo"
        | "sky"
        | "amber"
        | "purple"
        | "rose"
        | "pink"
        | "slate"
        | "indigo"
        | "green";
}
export interface ButtonsGridProps {
    buttons: ButtonConfig[];
    children?: React.ReactNode;
}
