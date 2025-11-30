import { CheckCircle, Edit, PlusCircle, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import BarraDeFerramenta from "@/components/barra";
import { Api } from "@/services/api";
import { useEffect, useState } from "react";
import MyModal from "@/components/myModal";
import { toast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";

interface IReserva {
  id: number;
  nome: string;
  utentes: number;
}

export default function Reservas() {
  const token = localStorage.getItem("token");

  const [reservas, setReservas] = useState<IReserva[]>();
  const [nome_reserva, setNomeReserva] = useState("");
  const [search, setSearch] = useState("");

  const reservas_filtradas = search
    ? reservas?.filter((e) =>
        e.nome.toLowerCase().includes(search.toLowerCase()),
      )
    : reservas;

  const alertar = (text: string) => {
    toast({
      description: (
        <div className="flex">
          <CheckCircle size="20" />
          <div className="ml-2 font-bold">{text}</div>
        </div>
      ),
      variant: "destructive",
    });
  };

  const preencherModal = (reserva: IReserva) => {
    setNomeReserva(reserva.nome);
  };

  const carregar = async () => {
    const response = await Api.get("/reservas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setReservas(response.data);
  };

  const adicionar = async () => {
    if (nome_reserva.trim()) {
      await Api.post(
        "/reservas",
        {
          nome: nome_reserva,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
        .then(() => alertar("Efectuado com sucesso."))
        .catch(() => alertar("Esta reserva já existe."));
      setNomeReserva("");
    } else {
      alertar("Introduza um nome válido.");
    }
  };

  const editar = async (id: number) => {
    if (nome_reserva.trim()) {
      await Api.put(
        "/reservas",
        {
          id: id,
          nome: nome_reserva,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
        .then(() => alertar("Efectuado com sucesso."))
        .catch(() => alertar("Erro ao editar."));
      setNomeReserva("");
    } else {
      alertar("Introduza um nome válido.");
    }
  };

  const eliminar = async (id: number) => {
    await Api.delete(`/reservas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => alertar("Efectuado com sucesso."))
      .catch(() => alertar("Erro ao eliminar."));
  };

  useEffect(() => {
    carregar();
  }, [reservas]);

  return (
    <>
      <Sidebar />
      <div className="sm:ml-14">
        <div className="p-6 max-w-5xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <BarraDeFerramenta
              titulo="Reservas"
              placeholder="Pesquisar reserva..."
              onChange={(e) => setSearch(e.target.value)}
            />
            <MyModal
              titulo_modal="Adicionar reserva"
              triggers={
                <Button className="mt-12">
                  <PlusCircle className="text-white" size={15} />
                  <p className="hidden sm:flex ml-1 text-white">Adicionar</p>
                </Button>
              }
              onClick={adicionar}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center text-right gap-2">
                  <Input
                    onChange={(e) => setNomeReserva(e.target.value)}
                    className="col-span-4"
                    placeholder="Nome da reserva..."
                  />
                </div>
              </div>
            </MyModal>
          </div>
          <div className="border rounded-lg p-2 overflow-x-auto max-h-[400px] overflow-y-auto">
            <Table className="text-center min-w-full table-auto">
              <TableHeader className="sticky top-0 z-10">
                <TableRow>
                  <TableHead className="text-center">Nº</TableHead>
                  <TableHead className="text-center">Reserva</TableHead>
                  <TableHead className="text-center">Utentes</TableHead>
                  <TableHead className="text-center">Editar</TableHead>
                  <TableHead className="text-center">Eliminar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservas_filtradas?.map((reserva, index) => (
                  <TableRow key={reserva.nome}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {reserva.nome}
                    </TableCell>
                    <TableCell>{reserva.utentes}</TableCell>
                    <TableCell>
                      <MyModal
                        titulo_modal="Editar reserva"
                        triggers={
                          <Button
                            onClick={() => preencherModal(reserva)}
                            size={"icon"}
                            variant={"ghost"}
                          >
                            <Edit
                              size={15}
                              className="text-secondary-foreground"
                            />
                          </Button>
                        }
                        onClick={() => editar(reserva.id)}
                      >
                        <div className="space-y-4">
                          <div className="grid grid-cols-4 items-center text-right gap-2">
                            <Input
                              value={nome_reserva}
                              onChange={(e) => setNomeReserva(e.target.value)}
                              className="col-span-4"
                              placeholder="Nome da reserva..."
                            />
                          </div>
                        </div>
                      </MyModal>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => eliminar(reserva.id)}
                        size={"icon"}
                        variant={"ghost"}
                      >
                        <Trash
                          size={15}
                          className="text-secondary-foreground"
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
