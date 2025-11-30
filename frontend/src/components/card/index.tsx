import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface CardProps {
  title: string;
  description: string;
  content: string;
  icon?: ReactNode;
}

export default function CardComponent({ title, description, content, icon }: CardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-center">
          <CardTitle className="text-secondary-foreground sm:text-xl select-none">
            {title}
          </CardTitle>
          {icon && <div className="ml-auto w-6 h-6 text-primary">{icon}</div>}
        </div>
      </CardHeader>
      <CardDescription className="text-secondary-foreground text-center py-3">{description}</CardDescription>
      <CardContent>
        <p className="text-sm sm:text-xl font-bold select-none">{content}</p>
      </CardContent>
    </Card>
  );
}
