import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, TrendingUp, TrendingDown, Scale, Users } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from "date-fns";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Reports() {
  const [period, setPeriod] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list('-created_date'),
  });

  const { data: parties = [] } = useQuery({
    queryKey: ['parties'],
    queryFn: () => base44.entities.Party.list(),
  });

  // Filter transactions by period
  const filteredTransactions = useMemo(() => {
    if (period === 'all') return transactions;
    
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'this_month':
        startDate = startOfMonth(now);
        break;
      case 'last_month':
        startDate = startOfMonth(subMonths(now, 1));
        break;
      case 'last_3_months':
        startDate = startOfMonth(subMonths(now, 2));
        break;
      default:
        return transactions;
    }
    
    return transactions.filter(t => {
      if (!t.date) return false;
      return new Date(t.date) >= startDate;
    });
  }, [transactions, period]);

  // Calculate summary stats
  const summary = useMemo(() => {
    const buying = filteredTransactions.filter(t => t.transaction_type === 'buying');
    const selling = filteredTransactions.filter(t => t.transaction_type === 'selling');
    
    return {
      totalBuying: buying.reduce((sum, t) => sum + (t.total_payment || 0), 0),
      totalSelling: selling.reduce((sum, t) => sum + (t.total_payment || 0), 0),
      totalWeight: filteredTransactions.reduce((sum, t) => sum + (t.total_weight || 0), 0),
      buyingCount: buying.length,
      sellingCount: selling.length,
      uniqueParties: new Set(filteredTransactions.map(t => t.party_name)).size
    };
  }, [filteredTransactions]);

  // Party-wise breakdown
  const partyBreakdown = useMemo(() => {
    const breakdown = {};
    filteredTransactions.forEach(t => {
      if (!breakdown[t.party_name]) {
        breakdown[t.party_name] = { buying: 0, selling: 0, weight: 0 };
      }
      if (t.transaction_type === 'buying') {
        breakdown[t.party_name].buying += t.total_payment || 0;
      } else {
        breakdown[t.party_name].selling += t.total_payment || 0;
      }
      breakdown[t.party_name].weight += t.total_weight || 0;
    });
    
    return Object.entries(breakdown)
      .map(([name, data]) => ({ name, ...data, balance: data.selling - data.buying }))
      .sort((a, b) => (b.buying + b.selling) - (a.buying + a.selling));
  }, [filteredTransactions]);

  // Monthly trend data
  const monthlyTrend = useMemo(() => {
    const months = {};
    filteredTransactions.forEach(t => {
      if (!t.date) return;
      const month = format(new Date(t.date), 'MMM yyyy');
      if (!months[month]) {
        months[month] = { month, buying: 0, selling: 0 };
      }
      if (t.transaction_type === 'buying') {
        months[month].buying += t.total_payment || 0;
      } else {
        months[month].selling += t.total_payment || 0;
      }
    });
    return Object.values(months).slice(-6);
  }, [filteredTransactions]);

  // Pie chart data
  const pieData = [
    { name: 'Buying', value: summary.totalBuying },
    { name: 'Selling', value: summary.totalSelling }
  ];

  // Export to CSV
  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Party', 'Phone', 'HNY Rate', 'HNY Weight', 'Black Rate', 'Black Weight', 'Total Weight', 'Total Payment', 'Created By'];
    const rows = filteredTransactions.map(t => [
      t.date,
      t.transaction_type,
      t.party_name,
      t.phone,
      t.hny_rate,
      t.hny_weight,
      t.black_rate,
      t.black_weight,
      t.total_weight,
      t.total_payment,
      t.created_by
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reports</h1>
            <p className="text-slate-500 mt-1">Analytics and export functionality</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="last_3_months">Last 3 Months</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportCSV} className="bg-emerald-600 hover:bg-emerald-700">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-red-50 border-0">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-red-600 uppercase">Total Buying</p>
                  <p className="text-2xl font-bold text-red-700 mt-1">₹{(summary.totalBuying/1000).toFixed(0)}k</p>
                  <p className="text-xs text-red-500 mt-1">{summary.buyingCount} transactions</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-0">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-green-600 uppercase">Total Selling</p>
                  <p className="text-2xl font-bold text-green-700 mt-1">₹{(summary.totalSelling/1000).toFixed(0)}k</p>
                  <p className="text-xs text-green-500 mt-1">{summary.sellingCount} transactions</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-indigo-50 border-0">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-indigo-600 uppercase">Total Weight</p>
                  <p className="text-2xl font-bold text-indigo-700 mt-1">{summary.totalWeight.toLocaleString()} kg</p>
                </div>
                <Scale className="w-8 h-8 text-indigo-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-0">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-purple-600 uppercase">Active Parties</p>
                  <p className="text-2xl font-bold text-purple-700 mt-1">{summary.uniqueParties}</p>
                </div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="buying" name="Buying" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="selling" name="Selling" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transaction Split</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#ef4444" />
                      <Cell fill="#22c55e" />
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Party-wise Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Party-wise Balance Sheet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Party Name</TableHead>
                    <TableHead className="text-right">Buying (₹)</TableHead>
                    <TableHead className="text-right">Selling (₹)</TableHead>
                    <TableHead className="text-right">Total Weight (kg)</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partyBreakdown.slice(0, 15).map((party) => (
                    <TableRow key={party.name}>
                      <TableCell className="font-medium">{party.name}</TableCell>
                      <TableCell className="text-right text-red-600">
                        ₹{party.buying.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        ₹{party.selling.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-slate-600">
                        {party.weight.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={party.balance >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {party.balance >= 0 ? '+' : ''}₹{party.balance.toLocaleString()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}