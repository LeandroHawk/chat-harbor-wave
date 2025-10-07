import { BarChart3, TrendingUp, Ship, Anchor } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface DashboardStats {
  totalConversations: number;
  totalQueries: number;
  categoryCounts: {
    rastreamento: number;
    documentacao: number;
    operacoes: number;
  };
  recentQueries: string[];
}

interface DashboardProps {
  stats: DashboardStats;
}

export const Dashboard = ({ stats }: DashboardProps) => {
  const totalCategoryCount =
    stats.categoryCounts.rastreamento +
    stats.categoryCounts.documentacao +
    stats.categoryCounts.operacoes;

  const getCategoryPercentage = (count: number) => {
    if (totalCategoryCount === 0) return 0;
    return Math.round((count / totalCategoryCount) * 100);
  };

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard Portuário
        </h2>
        <p className="text-muted-foreground">Visão geral das suas consultas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Conversas
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConversations}</div>
            <p className="text-xs text-muted-foreground">Conversas criadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rastreamento</CardTitle>
            <Ship className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.categoryCounts.rastreamento}
            </div>
            <p className="text-xs text-muted-foreground">
              Consultas sobre navios/carga
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentação</CardTitle>
            <Anchor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.categoryCounts.documentacao}
            </div>
            <p className="text-xs text-muted-foreground">
              Consultas sobre documentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operações</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.categoryCounts.operacoes}
            </div>
            <p className="text-xs text-muted-foreground">
              Consultas operacionais
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Consultas Recentes</CardTitle>
            <CardDescription>Últimas perguntas ao assistente</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentQueries.length > 0 ? (
              <div className="space-y-3">
                {stats.recentQueries.slice(0, 5).map((query, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm p-2 rounded-md hover:bg-accent/50 transition-colors"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="truncate">{query}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma consulta ainda
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade por Categoria</CardTitle>
            <CardDescription>Distribuição de consultas</CardDescription>
          </CardHeader>
          <CardContent>
            {totalCategoryCount > 0 ? (
              <div className="space-y-3">
                {[
                  {
                    label: "Rastreamento",
                    count: stats.categoryCounts.rastreamento,
                  },
                  {
                    label: "Documentação",
                    count: stats.categoryCounts.documentacao,
                  },
                  { label: "Operações", count: stats.categoryCounts.operacoes },
                ].map((item, i) => {
                  const percentage = getCategoryPercentage(item.count);
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="font-medium">
                          {item.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma consulta categorizada ainda
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
