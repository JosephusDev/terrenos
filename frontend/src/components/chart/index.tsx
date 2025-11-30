"use client";

import { BarChart2, LineChart as LineChartIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, CartesianGrid, XAxis } from "recharts";
import { useEffect, useState } from "react";
import { Api } from "@/services/api";

interface BeneficiadosData {
  reserva: string;
  utentes: number;
}

export default function ChartOverView() {
  const token = localStorage.getItem("token");

  const [beneficiados, setBeneficiados] = useState<BeneficiadosData[]>([]);

  const carregarBeneficiados = async () => {
    const response = await Api.get("/reservas/beneficiados", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setBeneficiados(response.data);
  };

  useEffect(() => {
    carregarBeneficiados();
  }, []);

  const chartConfig = {
    entregas: {
      label: "Entregas",
    },
    lotes: {
      label: "Lotes",
      color: "#2563eb",
    },
    apartamentos: {
      label: "Apartamentos",
      color: "#60a8fb",
    },
    utentes: {
      label: "Utentes",
      color: "#60a8fb",
    },
  } satisfies ChartConfig;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center">
            <CardTitle className="text-base sm:text-xl select-none">
              Beneficiados por reservas
            </CardTitle>
            <BarChart2 className="ml-auto w-4 h-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row justify-around">
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-full"
            >
              <BarChart accessibilityLayer data={beneficiados}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="reserva"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <Bar
                  dataKey="utentes"
                  fill={chartConfig.utentes.color}
                  radius={4}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <ChartTooltip
                  content={<ChartTooltipContent indicator="dot" />}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-center">
            <CardTitle className="text-base sm:text-xl select-none">
              Progresso de entregas
            </CardTitle>
            <LineChartIcon className="ml-auto w-4 h-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row justify-around">
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-full"
            >
              <LineChart accessibilityLayer data={beneficiados}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="reserva"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <Line
                  type="monotone"
                  dataKey="utentes"
                  stroke={chartConfig.utentes.color}
                  strokeWidth={2}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <ChartTooltip
                  content={<ChartTooltipContent indicator="dot" />}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
