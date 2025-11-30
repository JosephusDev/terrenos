import { Input } from "@/components/ui/input";

interface BarraDeFerramentaProps {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick?: () => void;
    titulo: string;
    placeholder: string;
    children?: React.ReactNode;
}

export default function BarraDeFerramenta({ 
    onChange, titulo, placeholder 
}: BarraDeFerramentaProps) {
    return (
        <div>
            <h1 className="text-3xl font-bold my-2">{titulo}</h1>
            <div className="flex items-center gap-2">
                <Input 
                    className="w-auto" 
                    placeholder={placeholder}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}
