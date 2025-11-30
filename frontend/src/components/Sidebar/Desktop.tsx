import { TooltipContent, Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Blocks, Home, LogOut, Package, ShoppingBag, UserCircle, Users } from "lucide-react"
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import ThemeToggleButton from "@/components/ThemeToggleButton";

export function SidebarDesktop(){
    const { logout, usuario } = useAuth();
    return(
        <aside 
            className="fixed inset-y-0 left-0 z-10 hidden w-14 border-r bg-background sm:flex flex-col"
        >
            <nav className="flex flex-col items-center gap-4 px-2 py-5">
                <TooltipProvider>
                    <Link to="/dashboard" className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary
                        text-primary-foreground rounded-full"
                    >
                        <Package className="h-5 w-5"/>
                    </Link>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link to="/dashboard" className="flex h-9 w-9 shrink-0 items-center justify-center
                                rounded-lg text-foreground transition-colors hover:text-muted-foreground"
                            >
                                <Home className="h-5 w-5"/>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Início</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link to="/reservas" className="flex h-9 w-9 shrink-0 items-center justify-center
                                rounded-lg text-foreground transition-colors hover:text-muted-foreground"
                            >
                                <ShoppingBag className="h-5 w-5"/>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Reservas</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link to="/espacos" className="flex h-9 w-9 shrink-0 items-center justify-center
                                rounded-lg text-foreground transition-colors hover:text-muted-foreground"
                            >
                                <Blocks className="h-5 w-5"/>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Espaços</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link to="/utentes" className="flex h-9 w-9 shrink-0 items-center justify-center
                                rounded-lg text-foreground transition-colors hover:text-muted-foreground"
                            >
                                <Users className="h-5 w-5"/>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Utentes</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
                
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size={"icon"} variant={"ghost"} className="flex h-9 w-9 shrink-0 items-center justify-center
                                rounded-lg text-foreground transition-colors hover:text-muted-foreground"
                            >
                                <UserCircle className="h-5 w-5"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">{usuario}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <ThemeToggleButton/>
                        </TooltipTrigger>
                        <TooltipContent side="right">Alternar tema</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size={"icon"} variant={"ghost"} onClick={logout} className="flex h-9 w-9 shrink-0 items-center justify-center
                                rounded-lg text-foreground transition-colors hover:text-muted-foreground"
                            >
                                <LogOut className="h-4 w-4 text-red-500"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">Terminar sessão</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </nav>
        </aside>
    )
}