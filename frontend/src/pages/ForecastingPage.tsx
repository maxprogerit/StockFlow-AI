import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import api from "@/lib/api";
import { useToastStore } from "@/store/toast";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

type Product = { id: string; name: string };
type ForecastResult = {
  predicted_demand: number;
  recommended_restock: number;
  confidence: number;
  insight: string;
  series: { period: number; forecast: number }[];
};

export default function ForecastingPage() {
  const toast = useToastStore((s) => s.push);
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [months, setMonths] = useState("6");
  const [result, setResult] = useState<ForecastResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/products", { params: { page: 0, size: 200 } })
      .then((r) => {
        const list = (r.data.content || []).map((item: any) => ({ id: item.id, name: item.name }));
        setProducts(list);
        if (list.length) setProductId(list[0].id);
      })
      .catch(() => toast({ title: "Failed to load products", variant: "danger" }));
  }, []);

  const run = async () => {
    if (!productId) return;
    setError("");
    try {
      const { data } = await api.post(`/forecasting/${productId}?months=${months}`);
      setResult(data);
    } catch (err: any) {
      setResult(null);
      setError(err.response?.data?.error || "Forecast cannot be generated yet.");
    }
  };

  if (products.length === 0) {
    return <EmptyState icon={Sparkles} title="Not enough data for forecasting" description="Create products and completed orders first. Forecasting requires historical order points." />;
  }

  return (
    <div className="space-y-4">
      <PageHeader title="AI Forecasting Engine" subtitle="Demand forecast, confidence, restock recommendations, and stock risk projections.">
        <div className="flex gap-2">
          <Select value={productId} onChange={(e) => setProductId(e.target.value)} className="w-52">
            {products.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
          <Select value={months} onChange={(e) => setMonths(e.target.value)} className="w-32">
            <option value="3">3 months</option>
            <option value="6">6 months</option>
            <option value="12">12 months</option>
          </Select>
          <Button onClick={() => void run()}>Run forecast</Button>
        </div>
      </PageHeader>

      {error ? (
        <EmptyState icon={Sparkles} title="Forecast unavailable" description={`${error} Add at least 3 completed order records for this product.`} />
      ) : result ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <p className="text-xs text-slate-400">Predicted Demand</p>
              <p className="mt-2 text-2xl font-semibold">{Number(result.predicted_demand).toLocaleString()}</p>
            </Card>
            <Card>
              <p className="text-xs text-slate-400">Recommended Restock</p>
              <p className="mt-2 text-2xl font-semibold">{Number(result.recommended_restock).toLocaleString()}</p>
            </Card>
            <Card>
              <p className="text-xs text-slate-400">Confidence</p>
              <p className="mt-2 text-2xl font-semibold">{Math.round(result.confidence * 100)}%</p>
            </Card>
            <Card>
              <p className="text-xs text-slate-400">Risk Level</p>
              <p className="mt-2 text-2xl font-semibold">{result.confidence < 0.75 ? "High" : result.confidence < 0.85 ? "Medium" : "Low"}</p>
            </Card>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <p className="mb-3 text-sm font-semibold">Seasonal Trend Projection</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.series}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#33415544" />
                    <XAxis dataKey="period" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Line dataKey="forecast" stroke="#8A4DFF" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card>
              <p className="text-sm font-semibold">AI Explanation</p>
              <p className="mt-3 rounded-xl bg-white/5 p-3 text-sm">{result.insight}</p>
              <p className="mt-3 rounded-xl bg-white/5 p-3 text-xs text-slate-300">Expected stockout date (estimated): {result.predicted_demand > result.recommended_restock ? "Soon - prioritize restock" : "Stable in selected horizon"}.</p>
            </Card>
          </div>
        </>
      ) : (
        <EmptyState icon={Sparkles} title="Run your first forecast" description="Select a product and forecast horizon to generate AI demand projections." />
      )}
    </div>
  );
}
