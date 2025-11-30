import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalTickets: 0,
    checkedIn: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/events');
        const events = response.data;
        setStats({
          totalEvents: events.length || 0,
          totalTickets: 0,
          checkedIn: 0,
          revenue: 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Total de Eventos',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'text-primary',
    },
    {
      title: 'Tickets Vendidos',
      value: stats.totalTickets,
      icon: Users,
      color: 'text-success',
    },
    {
      title: 'Check-ins Realizados',
      value: stats.checkedIn,
      icon: CheckCircle,
      color: 'text-warning',
    },
    {
      title: 'Receita Total',
      value: `R$ ${stats.revenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-primary',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral do sistema de eventos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo ao EventManager</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Gerencie seus eventos, vendas de tickets e check-ins de forma simples e eficiente.
              Use o menu lateral para navegar entre as funcionalidades.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
