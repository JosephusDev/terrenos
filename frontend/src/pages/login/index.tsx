import { AlertTriangleIcon, LogIn, Package } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import Autoplay from "embla-carousel-autoplay"
import imageA from "@/assets/a.png"
import imageB from "@/assets/b.png"
import imageC from "@/assets/c.png"

export default function LoginScreen(){

    const { toast } = useToast()
    const alerta = () => {
        toast({
            description: 
                <div className="flex">
                    <AlertTriangleIcon size="20" /> 
                    <div className="ml-2 font-bold">
                        Por favor, preencha todos os campos.
                    </div>
                </div>,
            variant: "destructive"
        })
    }    

    const { login } = useAuth();
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const logar = async () => {
        if(user.trim() && password.trim()){
            await login(user, password);
            setUser("");
            setPassword("");
        }else{
            alerta();
        }
    }

    return(
        <main className="h-screen flex w-full">
            <div className="sm:flex hidden bg-primary-foreground w-full h-full items-center justify-center p-16">
                <Carousel className="w-full max-w-xl" 
                    opts={{loop: true}}
                    plugins={[
                        Autoplay({
                            delay: 2000,
                        }),
                    ]}
                >
                    <CarouselContent>
                        <CarouselItem>
                            <div className="flex aspect-square bg-background rounded p-8">
                                <img src={imageA} alt="" />
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div className="flex aspect-square bg-background rounded p-8">
                                <img src={imageB} alt="" />
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div className="flex aspect-square bg-background rounded p-8">
                                <img src={imageC} alt="" />
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
            <section className="flex bg-background h-full w-max-3xl w-full p-4 items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold tracking-tighter flex items-center justify-center">
                            <Package size={30} className="text-primary mr-2"/> Bem-vindo ao RFU
                        </CardTitle>
                        <CardDescription className="text-center">
                            Sistema de Reservas Fundiárias do Uige
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <Label htmlFor="utilizador">Utilizador</Label>
                            <Input className="mt-1" id="utilizador" value={user} onChange={e => setUser(e.target.value)} placeholder="Nome de utilizador"/>
                        </div>
                        <div className="mt-4">
                            <Label htmlFor="senha">Palavra-passe</Label>
                            <Input className="mt-1" id="senha" value={password} onChange={e => setPassword(e.target.value)} placeholder="Palavra-passe" type="password"/>
                        </div>
                        <Button className="mt-6 mb-6 w-full" onClick={logar}><LogIn className="mr-1 text-white" size={15}/> <span className="text-white">Entrar</span></Button>
                    </CardContent>
                    <CardFooter>
                        <p className="text-muted-foreground text-center text-sm">Ao entrar no sistema concorda com os Termos de Uso e Políticas de privacidade.</p>
                    </CardFooter>
                </Card>
            </section>
        </main>
    )
}