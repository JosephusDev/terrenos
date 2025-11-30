import { Blocks, ShoppingBag, Users } from "lucide-react";
import { useEffect, useState } from "react";
import CardComponent from "@/components/card";
import ChartOverView from "@/components/chart";
import Sidebar from "@/components/Sidebar";
import { Api } from "@/services/api";

export default function Dashboard() {
  const token = localStorage.getItem("token");

  const [total_entregas, setTotalEntregas] = useState(0);
  const [total_solcitacoes, setTotalSolcitacoes] = useState(0);
  const [total_reservas, setTotalReservas] = useState(0);

  const carregarSolicitacoes = async () => {
    const response = await Api.get("/utentes/solicitacoes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setTotalSolcitacoes(response.data.length);
  };

  const carregarReservas = async () => {
    const response = await Api.get("/reservas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setTotalReservas(response.data.length);
  };

  const carregarEntregas = async () => {
    const response = await Api.get("/espacos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setTotalEntregas(response.data.length);
  };

  useEffect(() => {
    carregarEntregas();
    carregarReservas();
    carregarSolicitacoes();
  }, []);

  return (
    <>
      <Sidebar />
      <main className="sm:ml-14 p-4">
        <section className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
          <CardComponent
            title="Entregas"
            description="Lotes entregues até ao momento."
            content={total_entregas + " Entrega(s)"}
            icon={<ShoppingBag className="ml-auto w-6 h-6" />}
          />
          <CardComponent
            title="Solicitações"
            description="Solicitações pendentes."
            content={total_solcitacoes + " Pessoa(s)"}
            icon={<Users className="ml-auto w-6 h-6" />}
          />
          <CardComponent
            title="Reservas Fundiárias"
            description="Nº de Reservas Fundiárias no Uige."
            content={total_reservas + " Reserva(s)"}
            icon={<Blocks className="ml-auto w-6 h-6" />}
          />
        </section>

        <section className="mt-4 grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
          <ChartOverView />
        </section>
      </main>
    </>
  );
}
