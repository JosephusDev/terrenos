import { PDFViewer } from "@react-pdf/renderer";
import { format } from "date-fns";
import {
  CalendarIcon,
  CheckCircle,
  CheckIcon,
  PlusCircle,
  Printer,
  Trash,
  Shuffle,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import BarraDeFerramenta from "@/components/barra";
import MyModal from "@/components/myModal";
import Ficha from "@/components/reports/Ficha";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VisualPdf } from "@/components/visualPdf";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Api } from "@/services/api";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface IEspaco {
  id: number;
  dimensao: string;
  data_aquisicao: string;
  id_utente: number;
  id_reserva: number;
  utente: string;
  bi: string;
  telemovel: string;
  endereco: string;
  reserva: string;
}
interface IReserva {
  id: number;
  nome: string;
}
interface IUtente {
  id: number;
  nome: string;
}

interface ISorteioResultado {
  utente: string;
  reserva: string;
  dimensao: string;
}

export default function Espacos() {
  const token = localStorage.getItem("token");

  const [espacos, setEspacos] = useState<IEspaco[]>();
  const [reservas, setReservas] = useState<IReserva[]>();
  const [utentes, setUtentes] = useState<IUtente[]>();
  const [dimensao, setDimensao] = useState("");
  const [data_aquisicao, setDataAquisicao] = useState<Date | undefined>(
    new Date(),
  );
  const [utente, setUtente] = useState<IUtente | null>(null);
  const [reserva, setReserva] = useState<IReserva | null>(null);
  const [search, setSearch] = useState("");

  // Estados para o sorteio
  const [dimensoesSelecionadas, setDimensoesSelecionadas] = useState<string[]>(
    [],
  );
  const [utentesSelecionados, setUtentesSelecionados] = useState<IUtente[]>([]);
  const [reservasSelecionadas, setReservasSelecionadas] = useState<IReserva[]>(
    [],
  );
  const [maxVagas, setMaxVagas] = useState<number>(0);
  const [isPending, startTransition] = useTransition();
  const [resultadosSorteio, setResultadosSorteio] = useState<
    ISorteioResultado[]
  >([]);
  const [sorteioRealizado, setSorteioRealizado] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  const espacos_filtrados = search
    ? espacos?.filter((e) => {
        return (
          e.reserva.toLowerCase().includes(search.toLowerCase()) ||
          e.utente.toLowerCase().includes(search.toLowerCase()) ||
          e.dimensao.toLowerCase().includes(search.toLowerCase()) ||
          e.data_aquisicao.toLowerCase().includes(search.toLowerCase())
        );
      })
    : espacos;

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

  const carregar = async () => {
    const response = await Api.get("/espacos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setEspacos(response.data);
  };

  const carregarUtentes = async () => {
    const response = await Api.get("/utentes/solicitacoes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUtentes(response.data);
  };

  const carregarReservas = async () => {
    const response = await Api.get("/reservas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setReservas(response.data);
  };

  const adicionar = async () => {
    if (dimensao.trim()) {
      await Api.post(
        "/espacos",
        {
          dimensao: dimensao,
          data_aquisicao:
            data_aquisicao && format(data_aquisicao, "yyyy-MM-dd"),
          id_utente: utente?.id,
          id_reserva: reserva?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
        .then(() => alertar("Efectuado com sucesso."))
        .catch(() => alertar("Utente ou Espaço já atribuidos."))
        .finally(() => {
          carregar();
          carregarUtentes();
        });
    } else {
      alertar("Preencha todos os campos.");
    }
  };

  const eliminar = async (id: number) => {
    await Api.delete(`/espacos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => alertar("Efectuado com sucesso."))
      .catch(() => alertar("Erro ao eliminar."))
      .finally(() => {
        carregar();
        carregarUtentes();
      });
  };

  const toggleDimensao = (dim: string) => {
    setDimensoesSelecionadas((prev) =>
      prev.includes(dim) ? prev.filter((d) => d !== dim) : [...prev, dim],
    );
  };

  const toggleUtente = (ut: IUtente) => {
    setUtentesSelecionados((prev) =>
      prev.some((u) => u.id === ut.id)
        ? prev.filter((u) => u.id !== ut.id)
        : [...prev, ut],
    );
  };

  const toggleReserva = (res: IReserva) => {
    setReservasSelecionadas((prev) =>
      prev.some((r) => r.id === res.id)
        ? prev.filter((r) => r.id !== res.id)
        : [...prev, res],
    );
  };

  const realizarSorteio = () => {
    if (
      dimensoesSelecionadas.length === 0 ||
      utentesSelecionados.length === 0 ||
      reservasSelecionadas.length === 0 ||
      maxVagas <= 0
    ) {
      alertar(
        "Preencha todos os campos: dimensões, utentes, reservas e máximo de vagas.",
      );
      return;
    }

    if (maxVagas > utentesSelecionados.length) {
      alertar(
        "O número máximo de vagas não pode ser maior que o número de utentes selecionados.",
      );
      return;
    }

    startTransition(() => {
      // Simular delay de processamento
      setTimeout(() => {
        // Embaralhar utentes
        const utentesEmbaralhados = [...utentesSelecionados].sort(
          () => Math.random() - 0.5,
        );

        // Pegar apenas o número máximo de vagas
        const utentesSorteados = utentesEmbaralhados.slice(0, maxVagas);

        // Criar resultados do sorteio
        const resultados: ISorteioResultado[] = utentesSorteados.map(
          (utente) => {
            // Sortear dimensão aleatória
            const dimensaoAleatoria =
              dimensoesSelecionadas[
                Math.floor(Math.random() * dimensoesSelecionadas.length)
              ];

            // Sortear reserva aleatória
            const reservaAleatoria =
              reservasSelecionadas[
                Math.floor(Math.random() * reservasSelecionadas.length)
              ];

            return {
              utente: utente.nome,
              reserva: reservaAleatoria.nome,
              dimensao: dimensaoAleatoria,
            };
          },
        );

        setResultadosSorteio(resultados);
        setSorteioRealizado(true);
      }, 2000);
    });
  };

  const resetarSorteio = () => {
    setDimensoesSelecionadas([]);
    setUtentesSelecionados([]);
    setReservasSelecionadas([]);
    setMaxVagas(0);
    setResultadosSorteio([]);
    setSorteioRealizado(false);
    setModalAberto(false);
  };

  const salvarSorteio = async () => {
    if (resultadosSorteio.length === 0) {
      alertar("Nenhum resultado de sorteio para salvar.");
      return;
    }

    try {
      for (const resultado of resultadosSorteio) {
        // Encontrar IDs
        const utenteObj = utentes?.find((u) => u.nome === resultado.utente);
        const reservaObj = reservas?.find((r) => r.nome === resultado.reserva);

        if (utenteObj && reservaObj) {
          await Api.post(
            "/espacos",
            {
              dimensao: resultado.dimensao,
              data_aquisicao:
                data_aquisicao && format(data_aquisicao, "yyyy-MM-dd"),
              id_utente: utenteObj.id,
              id_reserva: reservaObj.id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
        }
      }
      alertar("Sorteio salvo com sucesso!");
      await carregar();
      await carregarUtentes();
      resetarSorteio();
    } catch (error) {
      console.error(error);
      alertar(`Erro ao salvar sorteio.`);
    }
  };

  // Lista estática de dimensões mais comuns (ordenada)
  const dimensoesUnicas = [
    "10x15",
    "10x20",
    "12x15",
    "12x20",
    "15x20",
    "20x20",
    "20x25",
    "25x30",
    "30x30",
    "30x40",
    "40x40",
    "50x50",
  ];

  useEffect(() => {
    carregar();
    carregarUtentes();
    carregarReservas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Sidebar />
      <div className="sm:ml-14">
        <div className="p-6 max-w-5xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <BarraDeFerramenta
              titulo="Espaços"
              placeholder="Pesquisar..."
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-2">
              <MyModal
                titulo_modal={
                  sorteioRealizado
                    ? "Resultados do Sorteio"
                    : "Sorteio de Terrenos"
                }
                triggers={
                  <Button className="mt-12" variant="outline">
                    <Shuffle size={15} />
                    <p className="hidden sm:flex ml-1">Sorteio</p>
                  </Button>
                }
                onClick={sorteioRealizado ? salvarSorteio : realizarSorteio}
                open={modalAberto}
                onOpenChange={(open) => {
                  setModalAberto(open);
                  if (!open) {
                    resetarSorteio();
                  }
                }}
                className="max-w-4xl"
              >
                {isPending ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Shuffle className="animate-spin" size={48} />
                    <p className="text-lg font-semibold">Sorteando...</p>
                  </div>
                ) : sorteioRealizado ? (
                  <div className="space-y-4">
                    <div className="rounded-lg p-4">
                      <div className="max-h-[400px] overflow-y-auto space-y-2">
                        {resultadosSorteio.map((resultado, index) => (
                          <div
                            key={index}
                            className="border rounded p-3 bg-secondary/20"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold">
                                  {resultado.utente}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Reserva: {resultado.reserva}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Dimensão: {resultado.dimensao}
                                </p>
                              </div>
                              <Badge variant="default">#{index + 1}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      {/* Dimensões e Utentes na mesma linha */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Dimensões */}
                        <div>
                          <Label className="mb-2 block">Dimensões</Label>
                          <Command className="border h-36">
                            <CommandInput
                              placeholder="Procurar dimensão..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                Nenhuma dimensão encontrada.
                              </CommandEmpty>
                              <CommandGroup>
                                {dimensoesUnicas.map((dim) => (
                                  <CommandItem
                                    key={dim}
                                    value={dim}
                                    onSelect={() => toggleDimensao(dim)}
                                  >
                                    {dim}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        dimensoesSelecionadas.includes(dim)
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                          {dimensoesSelecionadas.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {dimensoesSelecionadas.map((dim) => (
                                <Badge key={dim} variant="secondary">
                                  {dim}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Utentes */}
                        <div>
                          <Label className="mb-2 block">Utentes</Label>
                          <Command className="border h-36">
                            <CommandInput
                              placeholder="Procurar utente..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                Utente não encontrado.
                              </CommandEmpty>
                              <CommandGroup>
                                {utentes?.map((_utente) => (
                                  <CommandItem
                                    key={_utente.id}
                                    value={_utente.nome}
                                    onSelect={() => toggleUtente(_utente)}
                                  >
                                    {_utente.nome}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        utentesSelecionados.some(
                                          (u) => u.id === _utente.id,
                                        )
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                          {utentesSelecionados.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {utentesSelecionados.map((ut) => (
                                <Badge key={ut.id} variant="secondary">
                                  {ut.nome}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Reservas */}
                      <div>
                        <Label className="mb-2 block">Reservas</Label>
                        <Command className="border h-36">
                          <CommandInput
                            placeholder="Procurar reserva..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>Reserva não encontrada.</CommandEmpty>
                            <CommandGroup>
                              {reservas?.map((_reserva) => (
                                <CommandItem
                                  key={_reserva.id}
                                  value={_reserva.nome}
                                  onSelect={() => toggleReserva(_reserva)}
                                >
                                  {_reserva.nome}
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      reservasSelecionadas.some(
                                        (r) => r.id === _reserva.id,
                                      )
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                        {reservasSelecionadas.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {reservasSelecionadas.map((res) => (
                              <Badge key={res.id} variant="secondary">
                                {res.nome}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Máximo de Vagas */}
                      <div>
                        <Label className="mb-2 block">
                          Número Máximo de Vagas
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          max={utentesSelecionados.length}
                          value={maxVagas || ""}
                          onChange={(e) =>
                            setMaxVagas(parseInt(e.target.value) || 0)
                          }
                          placeholder="Ex: 10"
                          className="w-full"
                        />
                        {utentesSelecionados.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Utentes selecionados: {utentesSelecionados.length}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </MyModal>

              <MyModal
                titulo_modal="Adicionar espaço"
                triggers={
                  <Button className="mt-12">
                    <PlusCircle className="text-white" size={15} />
                    <p className="hidden sm:flex ml-1 text-white">Adicionar</p>
                  </Button>
                }
                onClick={adicionar}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-8 items-center text-right gap-2">
                    <Input
                      onChange={(e) => setDimensao(e.target.value)}
                      className="col-span-4"
                      placeholder="Dimensão (20x20)"
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "col-span-4 justify-start text-left font-normal",
                            !data_aquisicao && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {data_aquisicao ? (
                            format(data_aquisicao, "dd/MM/yyyy")
                          ) : (
                            <span>Selecionar Data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={data_aquisicao}
                          onSelect={setDataAquisicao}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Command className="col-span-4 h-40">
                      <CommandInput
                        placeholder="Procurar utente..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>Utente não encontrado.</CommandEmpty>
                        <CommandGroup>
                          {utentes?.map((_utente) => (
                            <CommandItem
                              key={_utente.id}
                              value={_utente.nome}
                              onSelect={() => {
                                setUtente(_utente);
                              }}
                            >
                              {_utente.nome}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  utente?.nome === _utente.nome
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                    <Command className="col-span-4 h-40">
                      <CommandInput
                        placeholder="Procurar reserva..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>Reserva não encontrada.</CommandEmpty>
                        <CommandGroup>
                          {reservas?.map((_reserva) => (
                            <CommandItem
                              key={_reserva.id}
                              value={_reserva.nome}
                              onSelect={() => {
                                setReserva(_reserva);
                              }}
                            >
                              {_reserva.nome}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  reserva?.nome === _reserva.nome
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </div>
                </div>
              </MyModal>
            </div>
          </div>
          <div className="border rounded-lg p-2 overflow-x-auto max-h-[500px] overflow-y-auto">
            <Table className="text-center min-w-full table-auto">
              <TableHeader className="sticky top-0 z-10">
                <TableRow>
                  <TableHead className="text-center">Nº</TableHead>
                  <TableHead className="text-center">Dimensão</TableHead>
                  <TableHead className="text-center">Aquisição</TableHead>
                  <TableHead className="text-center">Utente</TableHead>
                  <TableHead className="text-center">Reserva</TableHead>
                  <TableHead className="text-center">Eliminar</TableHead>
                  <TableHead className="text-center">Imprimir</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {espacos_filtrados?.map((espaco, index) => (
                  <TableRow key={espaco.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{espaco.dimensao}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(espaco.data_aquisicao, "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {espaco.utente}
                    </TableCell>
                    <TableCell>{espaco.reserva}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => eliminar(espaco.id)}
                        size={"icon"}
                        variant={"ghost"}
                      >
                        <Trash
                          size={15}
                          className="text-secondary-foreground"
                        />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <VisualPdf
                        triggers={
                          <Button size={"icon"} variant={"ghost"}>
                            <Printer
                              size={15}
                              className="text-secondary-foreground"
                            />
                          </Button>
                        }
                      >
                        <PDFViewer className="w-full h-full">
                          <Ficha data={espaco} />
                        </PDFViewer>
                      </VisualPdf>
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
