import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";


interface MyModalProps {
    children?: React.ReactNode;
    triggers?: React.ReactNode;
}

export function VisualPdf({ 
    children, triggers 
}: MyModalProps) {
    return(
        <Dialog>
            <DialogTrigger asChild>{triggers}</DialogTrigger>
            <DialogContent className="max-w-[1200px] h-full p-0">
                <div className="w-full">
                    {children && (
                        children
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}