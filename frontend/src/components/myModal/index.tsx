import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MyModalProps {
  titulo_modal: string;
  children?: React.ReactNode;
  triggers?: React.ReactNode;
  onClick?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export default function MyModal({
  children,
  titulo_modal,
  triggers,
  onClick,
  open,
  onOpenChange,
  className,
}: MyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{triggers}</DialogTrigger>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{titulo_modal}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">{children && children}</div>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button className="border-primary" variant={"outline"}>
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={onClick} className="text-white">
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
