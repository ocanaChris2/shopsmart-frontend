import {
  TrendingUp, TrendingDown, Minus,
  DollarSign, Package, ShoppingCart, Users,
  RefreshCw,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// ── Types ─────────────────────────────────────────────────────────────────────

interface KpiDef {
  label:  string;
  value:  string;
  change: string;
  trend:  'up' | 'down' | 'flat';
  icon:   LucideIcon;
  accent: 'indigo' | 'amber' | 'emerald' | 'blue';
}

interface RevenuePoint { month: string; revenue: number }

interface StatusPoint { name: string; value: number; color: string }

interface Order {
  id:       string;
  customer: string;
  items:    number;
  amount:   number;
  date:     string;
  status:   string;
}

// ── Mock data ─────────────────────────────────────────────────────────────────
// Replace fetch calls below with real API hooks when the endpoints are ready.

const KPIS: KpiDef[] = [
  { label: 'Total Revenue',    value: '$245,832', change: '+12.4% vs last month',  trend: 'up',   icon: DollarSign,  accent: 'indigo'  },
  { label: 'Inventory Value',  value: '$1.24M',   change: '−2.1% vs last month',   trend: 'down', icon: Package,     accent: 'amber'   },
  { label: 'Open Orders',      value: '47',       change: '8 new today',            trend: 'up',   icon: ShoppingCart,accent: 'emerald' },
  { label: 'Active Customers', value: '384',      change: '+24 this month',         trend: 'up',   icon: Users,       accent: 'blue'    },
];

const REVENUE_DATA: RevenuePoint[] = [
  { month: 'Jan', revenue: 185_000 },
  { month: 'Feb', revenue: 192_000 },
  { month: 'Mar', revenue: 178_000 },
  { month: 'Apr', revenue: 215_000 },
  { month: 'May', revenue: 231_000 },
  { month: 'Jun', revenue: 198_000 },
  { month: 'Jul', revenue: 224_000 },
  { month: 'Aug', revenue: 208_000 },
  { month: 'Sep', revenue: 242_000 },
  { month: 'Oct', revenue: 228_000 },
  { month: 'Nov', revenue: 256_000 },
  { month: 'Dec', revenue: 245_832 },
];

const STATUS_DATA: StatusPoint[] = [
  { name: 'Fulfilled',   value: 68, color: '#10b981' },
  { name: 'In Progress', value: 18, color: '#6366f1' },
  { name: 'Pending',     value:  9, color: '#f59e0b' },
  { name: 'Cancelled',   value:  5, color: '#ef4444' },
];

const RECENT_ORDERS: Order[] = [
  { id: 'ORD-2412', customer: 'Acme Corp',       items: 12, amount: 4_250,  date: '2024-12-15', status: 'Fulfilled'   },
  { id: 'ORD-2411', customer: 'GlobalTech Ltd',   items:  5, amount: 1_890,  date: '2024-12-14', status: 'In Progress' },
  { id: 'ORD-2410', customer: 'Summit Retail',    items: 23, amount: 8_140,  date: '2024-12-14', status: 'Fulfilled'   },
  { id: 'ORD-2409', customer: 'NovaBuild Co.',    items:  3, amount:   720,  date: '2024-12-13', status: 'Pending'     },
  { id: 'ORD-2408', customer: 'Zenith Partners',  items:  8, amount: 3_380,  date: '2024-12-13', status: 'In Progress' },
  { id: 'ORD-2407', customer: 'Apex Industries',  items: 15, amount: 6_990,  date: '2024-12-12', status: 'Fulfilled'   },
  { id: 'ORD-2406', customer: 'BlueSky Trading',  items:  2, amount:   490,  date: '2024-12-12', status: 'Cancelled'   },
  { id: 'ORD-2405', customer: 'Iron Gate LLC',    items:  7, amount: 2_610,  date: '2024-12-11', status: 'Fulfilled'   },
  { id: 'ORD-2404', customer: 'Crestview Supply', items: 18, amount: 7_200,  date: '2024-12-11', status: 'Pending'     },
  { id: 'ORD-2403', customer: 'Metro Wholesale',  items: 30, amount: 12_800, date: '2024-12-10', status: 'Fulfilled'   },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function statusVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (status) {
    case 'Fulfilled':   return 'default';
    case 'In Progress': return 'secondary';
    case 'Pending':     return 'outline';
    case 'Cancelled':   return 'destructive';
    default:            return 'secondary';
  }
}

const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// ── KPI card ──────────────────────────────────────────────────────────────────

const ACCENT: Record<KpiDef['accent'], { ring: string; bg: string; text: string }> = {
  indigo:  { ring: 'ring-indigo-100',  bg: 'bg-indigo-50',  text: 'text-indigo-600'  },
  amber:   { ring: 'ring-amber-100',   bg: 'bg-amber-50',   text: 'text-amber-600'   },
  emerald: { ring: 'ring-emerald-100', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  blue:    { ring: 'ring-blue-100',    bg: 'bg-blue-50',    text: 'text-blue-600'    },
};

function KpiCard({ label, value, change, trend, icon: Icon, accent }: KpiDef) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendCls  = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-slate-500';
  const { ring, bg, text } = ACCENT[accent];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <div className={cn('rounded-lg p-2 ring-1', ring, bg, text)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
      <div className={cn('mt-2 flex items-center gap-1 text-xs font-medium', trendCls)}>
        <TrendIcon className="h-3.5 w-3.5" />
        <span>{change}</span>
      </div>
    </div>
  );
}

// ── Revenue chart ─────────────────────────────────────────────────────────────

interface TooltipPayload { value: number }
interface RevenueTooltipProps {
  active?:  boolean;
  payload?: TooltipPayload[];
  label?:   string;
}

function RevenueTooltip({ active, payload, label }: RevenueTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md text-xs">
      <p className="font-semibold text-foreground mb-0.5">{label}</p>
      <p className="text-indigo-600 font-mono">
        ${(payload[0].value / 1_000).toFixed(0)}k
      </p>
    </div>
  );
}

function RevenueChart() {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm h-full">
      <div className="mb-5">
        <h3 className="text-sm font-semibold">Revenue Trend</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Monthly revenue — last 12 months</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={REVENUE_DATA} margin={{ top: 4, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214.3 31.8% 91.4%)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: 'hsl(215.4 16.3% 46.9%)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => `$${(v / 1_000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: 'hsl(215.4 16.3% 46.9%)' }}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip content={<RevenueTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Order status donut ────────────────────────────────────────────────────────

interface PieLabelProps {
  cx?:          number;
  cy?:          number;
  midAngle?:    number;
  innerRadius?: number;
  outerRadius?: number;
  percent?:     number;
}

function PieLabel({
  cx = 0, cy = 0, midAngle = 0,
  innerRadius = 0, outerRadius = 0, percent = 0,
}: PieLabelProps) {
  if (percent < 0.07) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x} y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function OrderStatusChart() {
  const total = STATUS_DATA.reduce((s, d) => s + d.value, 0);
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm h-full">
      <div className="mb-5">
        <h3 className="text-sm font-semibold">Order Status</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {total.toLocaleString()} orders · current period
        </p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={STATUS_DATA}
            cx="50%"
            cy="46%"
            innerRadius={52}
            outerRadius={82}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={<PieLabel />}
          >
            {STATUS_DATA.map(({ name, color }) => (
              <Cell key={name} fill={color} />
            ))}
          </Pie>
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            formatter={(value: string) => (
              <span style={{ color: 'hsl(222.2 84% 4.9%)' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Recent orders ─────────────────────────────────────────────────────────────

function RecentOrders() {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div>
          <h3 className="text-sm font-semibold">Recent Orders</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Last 10 orders</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              {['Order', 'Customer', 'Items', 'Amount', 'Date', 'Status'].map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    'py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide',
                    i === 0 ? 'pl-5 pr-4 text-left' :
                    i === 5 ? 'pl-4 pr-5 text-left' :
                    i === 2 || i === 3 ? 'px-4 text-right' : 'px-4 text-left',
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECENT_ORDERS.map((order) => (
              <tr
                key={order.id}
                className="border-b last:border-0 hover:bg-muted/20 transition-colors"
              >
                <td className="pl-5 pr-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                  {order.id}
                </td>
                <td className="px-4 py-3 font-medium whitespace-nowrap">{order.customer}</td>
                <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">{order.items}</td>
                <td className="px-4 py-3 text-right font-mono font-medium tabular-nums whitespace-nowrap">
                  ${order.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                  {fmt.format(new Date(order.date))}
                </td>
                <td className="pl-4 pr-5 py-3 whitespace-nowrap">
                  <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardHome() {
  const now     = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{dateStr}</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <RefreshCw className="h-3 w-3" />
          <span>Updated {timeStr}</span>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <OrderStatusChart />
      </div>

      {/* Recent orders */}
      <RecentOrders />
    </div>
  );
}
