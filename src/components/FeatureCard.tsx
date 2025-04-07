import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="mt-2 flex flex-col justify-center items-center gap-2">
            <div className="flex items-center justify-center">
                    {icon}
            </div>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>
                    {description}</CardDescription>
            </CardContent>
        </Card>
    );
}
