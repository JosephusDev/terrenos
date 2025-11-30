import {
  AlertTriangle,
  CheckCircle,
  Edit,
  PlusCircle,
  Trash,
} from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, getYear } from "date-fns";
import { cn } from "@/lib/utils";
import { MyCalendar } from "@/components/MyCalendar";

interface IUtente {
  id: number;
  nome: string;
  telemovel: string;
  bi: string;
  data_nascimento: Date;
  endereco: string;
}

export default function Utentes() {
  const token = localStorage.getItem("token");

  const [utentes, setUtentes] = useState<IUtente[]>();
  const [nome_utente, setNomeUtente] = useState("");
  const [telemovel, setTelemovel] = useState("");
  const [bi, setBI] = useState("");
  const [dataNascimento, setDataNascimento] = useState<Date>(new Date());
  const [endereco, setEndereco] = useState("");
  const [search, setSearch] = useState("");

  const utentes_filtrados = search
    ? utentes?.filter((e) => {
        return (
          e.nome.toLowerCase().includes(search.toLowerCase()) ||
          e.bi.toLowerCase().includes(search.toLowerCase()) ||
          e.endereco.toLowerCase().includes(search.toLowerCase())
        );
      })
    : utentes;

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

  const alertarErro = (text: string) => {
    toast({
      description: (
        <div className="flex">
          <AlertTriangle size="20" />
          <div className="ml-2 font-bold">{text}</div>
        </div>
      ),
      variant: "destructive",
    });
  };

  const preencherModal = (utente: IUtente) => {
    setNomeUtente(utente.nome);
    setTelemovel(utente.telemovel);
    setBI(utente.bi);
    setDataNascimento(utente.data_nascimento);
    setEndereco(utente.endereco);
  };

  const carregar = async () => {
    const response = await Api.get("/utentes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUtentes(response.data);
  };

  const limparCampos = () => {
    setNomeUtente("");
    setTelemovel("");
    setBI("");
    setDataNascimento(new Date());
    setEndereco("");
  };

  const adicionar = async () => {
    if (
      nome_utente.trim() &&
      telemovel.trim() &&
      bi.trim() &&
      endereco.trim() &&
      dataNascimento
    ) {
      const ano_atual = new Date().getFullYear();
      const idade = ano_atual - dataNascimento?.getFullYear();
      if (idade >= 18) {
        await Api.post(
          "/utentes",
          {
            nome: nome_utente,
            telemovel: telemovel,
            bi: bi,
            data_nascimento: format(dataNascimento, "yyyy-MM-dd"),
            endereco: endereco,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
          .then(() => {
            alertar("Efectuado com sucesso.");
            limparCampos();
          })
          .catch((error) => {
            alertarErro("Erro ao cadastrar utente.");
            console.error(error);
          })
          .finally(() => {
            carregar();
          });
      } else {
        alertarErro(idade + " anos não é uma idade permitida.");
      }
    } else {
      alertarErro("Preencha todos os campos.");
    }
  };

  const editar = async (id: number) => {
    if (
      nome_utente.trim() &&
      telemovel.trim() &&
      bi.trim() &&
      endereco.trim()
    ) {
      await Api.put(
        "/utentes",
        {
          id: id,
          nome: nome_utente,
          telemovel: telemovel,
          bi: bi,
          endereco: endereco,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
        .then(() => alertar("Efectuado com sucesso."))
        .catch(() => alertar("Erro ao editar."))
        .finally(carregar);
      limparCampos();
    } else {
      alertar("Introduza um nome válido.");
    }
  };

  const eliminar = async (id: number) => {
    await Api.delete(`/utentes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => alertar("Efectuado com sucesso."))
      .catch(() => alertar("Erro ao eliminar."))
      .finally(carregar);
  };

  useEffect(() => {
    carregar();
  }, []);

  return (
    <>
      <Sidebar />
      <div className="sm:ml-14">
        <div className="p-6 max-w-5xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <BarraDeFerramenta
              titulo="Utentes"
              placeholder="Pesquisar..."
              onChange={(e) => setSearch(e.target.value)}
            />
            <MyModal
              titulo_modal="Adicionar utente"
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
                    onChange={(e) => setNomeUtente(e.target.value)}
                    className="col-span-4"
                    placeholder="Nome da utente..."
                  />
                  <Input
                    onChange={(e) => setTelemovel(e.target.value)}
                    className="col-span-4"
                    placeholder="Telemovel..."
                    type="number"
                  />
                  <Input
                    onChange={(e) => setBI(e.target.value.toUpperCase())}
                    className="col-span-4"
                    placeholder="Nº do BI..."
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "col-span-4 justify-start text-left font-normal",
                          !dataNascimento && "text-muted-foreground",
                        )}
                      >
                        {dataNascimento ? (
                          format(dataNascimento, "dd/MM/yyyy")
                        ) : (
                          <span>Data de nascimento</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <MyCalendar
                        data={dataNascimento}
                        setData={setDataNascimento}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    onChange={(e) => setEndereco(e.target.value)}
                    className="col-span-4"
                    placeholder="Endereço..."
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
                  <TableHead className="text-center">Utente</TableHead>
                  <TableHead className="text-center whitespace-nowrap">
                    Data de nascimento
                  </TableHead>
                  <TableHead className="text-center">Idade</TableHead>
                  <TableHead className="text-center">Telemovel</TableHead>
                  <TableHead className="text-center">Nº BI</TableHead>
                  <TableHead className="text-center">Endereço</TableHead>
                  <TableHead className="text-center">Editar</TableHead>
                  <TableHead className="text-center">Eliminar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {utentes_filtrados?.map((utente, index) => (
                  <TableRow key={utente.nome}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {utente.nome}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(utente.data_nascimento, "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {new Date().getFullYear() -
                        getYear(utente.data_nascimento)}{" "}
                      Anos
                    </TableCell>
                    <TableCell>{utente.telemovel}</TableCell>
                    <TableCell>{utente.bi}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {utente.endereco}
                    </TableCell>
                    <TableCell>
                      <MyModal
                        titulo_modal="Editar utente"
                        triggers={
                          <Button
                            onClick={() => preencherModal(utente)}
                            size={"icon"}
                            variant={"ghost"}
                          >
                            <Edit
                              size={15}
                              className="text-secondary-foreground"
                            />
                          </Button>
                        }
                        onClick={() => editar(utente.id)}
                      >
                        <div className="space-y-4">
                          <div className="grid grid-cols-4 items-center text-right gap-2">
                            <Input
                              value={nome_utente}
                              onChange={(e) => setNomeUtente(e.target.value)}
                              className="col-span-4"
                              placeholder="Nome da utente..."
                            />
                            <Input
                              value={telemovel}
                              onChange={(e) => setTelemovel(e.target.value)}
                              className="col-span-4"
                              placeholder="Telemovel..."
                              type="number"
                            />
                            <Input
                              value={bi}
                              onChange={(e) =>
                                setBI(e.target.value.toUpperCase())
                              }
                              className="col-span-4"
                              placeholder="Nº do BI..."
                            />
                            <Input
                              value={endereco}
                              onChange={(e) => setEndereco(e.target.value)}
                              className="col-span-4"
                              placeholder="Endereço..."
                            />
                          </div>
                        </div>
                      </MyModal>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => eliminar(utente.id)}
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
