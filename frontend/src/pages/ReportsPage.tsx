import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useToastStore } from "@/store/toast";
import { FileText, Plus } from "lucide-react";
import { useEffect, useState } from "react";

type Report = { id: string; name: string; type: string; status: string; fileUrl: string; generatedAt: string };

export default function ReportsPage() {
  const toast = useToastStore((s) => s.push);
  const [items, setItems] = useState<Report[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("PDF");

  const load = async () => {
    try {
      const { data } = await api.get("/reports");
      setItems(data || []);
    } catch {
      toast({ title: "Failed to load reports", variant: "danger" });
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async () => {
    try {
      await api.post("/reports", { name, type });
      toast({ title: "Report generated", variant: "success" });
      setOpen(false);
      setName("");
      await load();
    } catch {
      toast({ title: "Failed to generate report", variant: "danger" });
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Report Generation Center" subtitle="Generate inventory, warehouse, sales, and supplier reports from live data.">
        <Button className="gap-2" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Generate report
        </Button>
      </PageHeader>

      {items.length === 0 ? (
        <EmptyState icon={FileText} title="No reports yet" description="Generate first report to populate report history and downloads." />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="pb-2">Report</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Generated At</th>
                  <th className="pb-2 text-right">Download</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-white/10">
                    <td className="py-3 font-medium">{item.name}</td>
                    <td className="py-3">{item.type}</td>
                    <td className="py-3">{item.status}</td>
                    <td className="py-3">{item.generatedAt ? new Date(item.generatedAt).toLocaleString() : "-"}</td>
                    <td className="py-3 text-right">
                      <Button variant="outline" className="h-8 px-2 text-xs" asChild>
                        <a href={item.fileUrl || "#"} target="_blank" rel="noreferrer">
                          Download
                        </a>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} title="Generate Report">
        <div className="space-y-3">
          <Input placeholder="Report name" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <Button variant={type === "PDF" ? "default" : "outline"} onClick={() => setType("PDF")}>
              PDF
            </Button>
            <Button variant={type === "EXCEL" ? "default" : "outline"} onClick={() => setType("EXCEL")}>
              Excel
            </Button>
          </div>
          <Button className="w-full" onClick={() => void create()}>
            Generate
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
