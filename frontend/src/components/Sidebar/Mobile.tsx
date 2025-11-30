import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Blocks, Home, LogOut, Menu, Package, ShoppingBag, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"
import ThemeToggleButton from "@/components/ThemeToggleButton";

export function SidebarMobile() {

    const { logout } = useAuth();
    

    return (
        <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <header className="sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-background 
                gap-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <Sheet>
                    <SheetTrigger>
                        <Button size={"icon"} variant={"outline"} className="sm:hidden">
                            <Menu className="w-5 h-5 text-primary" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side={"left"}>
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link to="/dashboard" className="flex h-10 w-10 bg-primary 
                                rounded-full text-lg items-center justify-center text-primary-foreground md:text-base gap-2"
                            >
                                <Package className="h-5 w-5 transition-all" />
                            </Link>
                            <Link to="/dashboard" className="flex items-center gap-4 px-2.5 text-foreground
                                hover:text-muted-foreground"
                            >
                                <Home className="h-5 w-5 transition-all" />
                                <h6 className="text-base sm:text-xl">Inicio</h6>
                            </Link>
                            <Link to="/reservas" className="flex items-center gap-4 px-2.5 text-foreground
                                hover:text-muted-foreground"
                            >
                                <ShoppingBag className="h-5 w-5 transition-all" />
                                <h6 className="text-base sm:text-xl">Reservas</h6>
                            </Link>
                            <Link to="/espacos" className="flex items-center gap-4 px-2.5 text-foreground
                                hover:text-muted-foreground"
                            >
                                <Blocks className="h-5 w-5 transition-all" />
                                <h6 className="text-base sm:text-xl">Espaços</h6>
                            </Link>
                            <Link to="/utentes" className="flex items-center gap-4 px-2.5 text-foreground
                                hover:text-muted-foreground"
                            >
                                <Users className="h-5 w-5 transition-all" />
                                <h6 className="text-base sm:text-xl">Utentes</h6>
                            </Link>
                            <Link to="/" onClick={logout} className="flex items-center gap-4 px-2.5 text-foreground
                                hover:text-muted-foreground"
                            >
                                <LogOut className="h-5 w-5 text-red-500 transition-all" />
                                <h6 className="text-base sm:text-xl">Terminar sessão</h6>
                            </Link>
                            <Link to="#" className="flex items-center gap-2 text-foreground
                                hover:text-muted-foreground"
                            >
                                <ThemeToggleButton/>
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                <h2>Menu</h2>
            </header>
        </div>
    );
}
