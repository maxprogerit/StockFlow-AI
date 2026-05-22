import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { forecastingSeries, riskHeatmap } from "@/data/platformData";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";

export default function ForecastingPage() {
  const [horizon, setHorizon] = useState("6 months");
  const [warehouse, setWarehouse] = useState("All");

  return (
    <div className="space-y-4">
      <PageHeader title="AI Forecasting Engine" subtitle="Predict demand, optimize stock strategy, and prevent inventory risk.">
        <div className="flex gap-2">
          <Select value={horizon} onChange={(e) => setHorizon(e.target.value)} className="w-32">
            {["3 months", "6 months", "12 months"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <Select value={warehouse} onChange={(e) => setWarehouse(e.target.value)} className="w-40">
            {["All", "Berlin Hub", "Prague Node", "Warsaw Dock", "Milan Port"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <Button>Apply filters</Button>
        </div>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-xs text-slate-400">Prediction Confidence</p>
          <p className="mt-2 text-2xl font-semibold">84.2%</p>
          <p className="text-xs text-emerald-300">+2.5% vs last cycle</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Demand Growth</p>
          <p className="mt-2 text-2xl font-semibold">+14.8%</p>
          <p className="text-xs text-emerald-300">Q3 projected</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Restock Priority SKUs</p>
          <p className="mt-2 text-2xl font-semibold">27</p>
          <p className="text-xs text-amber-300">11 high urgency</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Inventory Risk Score</p>
          <p className="mt-2 text-2xl font-semibold">38/100</p>
          <p className="text-xs text-emerald-300">Within safe band</p>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <p className="mb-3 text-sm font-semibold">Future Demand Prediction Timeline</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastingSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#33415544" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line dataKey="demand" stroke="#2D8CFF" strokeWidth={2} />
                <Line dataKey="predicted" stroke="#8A4DFF" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold">Smart Restock Suggestions</p>
          <div className="mt-3 space-y-2 text-sm">
            <div className="rounded-xl bg-white/5 p-3">Increase AI Vision Camera by +18%</div>
            <div className="rounded-xl bg-white/5 p-3">Move 120 RFID tags to Prague Node</div>
            <div className="rounded-xl bg-white/5 p-3">Delay ArcFlow procurement by 9 days</div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <p className="mb-3 text-sm font-semibold">Prediction Heatmap (Risk vs Volatility)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid stroke="#33415544" />
                <XAxis dataKey="risk" name="Risk" stroke="#94a3b8" />
                <YAxis dataKey="volatility" name="Volatility" stroke="#94a3b8" />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={riskHeatmap} fill="#8A4DFF" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold">AI Recommendations</p>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            <p className="rounded-xl bg-white/5 p-3">Seasonal trend detected: monitoring sensors +22% in Q4.</p>
            <p className="rounded-xl bg-white/5 p-3">Prague shortage probability in 12 days if current velocity persists.</p>
            <p className="rounded-xl bg-white/5 p-3">Optimal transfer window: Tue 06:00 to reduce freight cost by 9%.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
