import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ButtonsGridProps } from "@/interfaces/buttons.interface";

const colorClasses: Record<string, { bg: string; hover: string }> = {
    sky: { bg: "bg-sky-600", hover: "hover:bg-sky-700" },
    amber: { bg: "bg-amber-600", hover: "hover:bg-amber-700" },
    purple: { bg: "bg-purple-600", hover: "hover:bg-purple-700" },
    rose: { bg: "bg-rose-600", hover: "hover:bg-rose-700" },
    pink: { bg: "bg-pink-600", hover: "hover:bg-pink-700" },
    slate: { bg: "bg-slate-600", hover: "hover:bg-slate-700" },
    indigo: { bg: "bg-indigo-600", hover: "hover:bg-indigo-700" },
    green: { bg: "bg-green-600", hover: "hover:bg-green-700" },
};

export default function ButtonsGrid({ buttons, children }: ButtonsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children}
            {buttons.map(({ label, to, Icon, color }) => {
                const classes = color
                    ? colorClasses[color]
                    : { bg: "", hover: "" };
                return (
                    <Button
                        key={to}
                        className={`h-auto p-10 ${classes.bg} ${classes.hover} text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg`}
                        asChild
                    >
                        <Link to={to}>
                            <Icon className="size-8 mb-1" />
                            <span className="text-lg font-semibold text-wrap text-center">
                                {label}
                            </span>
                        </Link>
                    </Button>
                );
            })}
        </div>
    );
}
