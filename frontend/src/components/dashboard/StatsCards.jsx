import React from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Scale, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsCards({ transactions }) {
  const buyingTotal = transactions
    .filter(t => t.transaction_type === 'buying')
    .reduce((sum, t) => sum + (t.total_payment || 0), 0);
  
  const sellingTotal = transactions
    .filter(t => t.transaction_type === 'selling')
    .reduce((sum, t) => sum + (t.total_payment || 0), 0);
  
  const totalWeight = transactions
    .reduce((sum, t) => sum + (t.total_weight || 0), 0);
  
  const balance = sellingTotal - buyingTotal;

  const stats = [
    {
      title: "Total Buying",
      value: `₹${buyingTotal.toLocaleString()}`,
      icon: TrendingDown,
      color: "bg-red-500",
      lightColor: "bg-red-50",
      textColor: "text-red-600"
    },
    {
      title: "Total Selling",
      value: `₹${sellingTotal.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Total Weight",
      value: `${totalWeight.toLocaleString()} kg`,
      icon: Scale,
      color: "bg-indigo-500",
      lightColor: "bg-indigo-50",
      textColor: "text-indigo-600"
    },
    {
      title: "Balance",
      value: `₹${Math.abs(balance).toLocaleString()}`,
      icon: Wallet,
      color: balance >= 0 ? "bg-emerald-500" : "bg-amber-500",
      lightColor: balance >= 0 ? "bg-emerald-50" : "bg-amber-50",
      textColor: balance >= 0 ? "text-emerald-600" : "text-amber-600",
      subtitle: balance >= 0 ? "Profit" : "Loss"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`p-5 ${stat.lightColor} border-0 shadow-sm hover:shadow-md transition-all duration-300`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.title}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.textColor}`}>{stat.value}</p>
                {stat.subtitle && (
                  <p className={`text-xs mt-1 ${stat.textColor} opacity-70`}>{stat.subtitle}</p>
                )}
              </div>
              <div className={`p-2.5 rounded-xl ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}