"use client"

import React from 'react'
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { getPriceHistory } from "@/actions/serverAction";
import { Loader2 } from "lucide-react";

interface ChartData {
  date: string
  price: number
}

const PriceChart = ({ productId }: { productId: string }) => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const history = await getPriceHistory(productId);

      const chartData = history.map((item) => ({
        date: new Date(item.checked_at).toLocaleDateString(),
        price: parseFloat(item.price),
      }));

      setData(chartData);
      setLoading(false);
    }

    loadData();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-300 w-full">
        <Loader2 className="w-5 h-5 animate-spin mr-2 text-orange-400" />
        Loading ...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 w-full">
        No price history yet 📊
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4">

      <h4 className="text-md font-semibold mb-4 text-gray-300 tracking-tight">
        Price History
      </h4>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>

          {/* Subtle Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.08)"
          />

          {/* X Axis */}
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            stroke="rgba(255,255,255,0.1)"
          />

          {/* Y Axis */}
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            stroke="rgba(255,255,255,0.1)"
          />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(20,20,20,0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              backdropFilter: "blur(10px)",
              color: "#fff",
            }}
            labelStyle={{ color: "#9ca3af" }}
            cursor={{ stroke: "rgba(255,115,0,0.3)" }}
          />

          {/* Line */}
          <Line
            type="monotone"
            dataKey="price"
            stroke="#fb923c"
            strokeWidth={2.5}
            dot={{ fill: "#fb923c", r: 3 }}
            activeDot={{
              r: 6,
              fill: "#fb923c",
              stroke: "rgba(255,115,0,0.3)",
              strokeWidth: 6,
            }}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PriceChart
