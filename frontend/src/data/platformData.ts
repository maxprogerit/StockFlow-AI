export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  warehouse: string;
  quantity: number;
  reorderPoint: number;
  lastMovement: string;
  value: number;
};

export type WarehouseItem = {
  id: string;
  name: string;
  location: string;
  manager: string;
  capacityPercent: number;
  throughput: number;
  status: "Online" | "Maintenance" | "Congested";
};

export type ProductItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  margin: number;
  stock: number;
  soldThisMonth: number;
  image: string;
};

export type OrderItem = {
  id: string;
  type: "Purchase" | "Sales";
  partner: string;
  total: number;
  status: "Created" | "Picking" | "In Transit" | "Delivered";
  date: string;
  warehouse: string;
};

export type SupplierItem = {
  id: string;
  name: string;
  category: string;
  rating: number;
  onTimeRate: number;
  activeContracts: number;
  contact: string;
};

export type AlertItem = {
  id: string;
  title: string;
  category: "Low Stock" | "Expiry" | "Warehouse Issue" | "Delay";
  severity: "Low" | "Medium" | "High" | "Critical";
  timestamp: string;
  recommendation: string;
};

export const inventoryItems: InventoryItem[] = [
  { id: "INV-101", name: "Quantum Sensor Pack", sku: "QSP-8821", barcode: "8901123045012", category: "Electronics", warehouse: "Berlin Hub", quantity: 42, reorderPoint: 30, lastMovement: "2h ago", value: 17640 },
  { id: "INV-102", name: "Smart Conveyor Motor", sku: "SCM-1930", barcode: "8901123045013", category: "Machinery", warehouse: "Prague Node", quantity: 19, reorderPoint: 25, lastMovement: "5h ago", value: 24800 },
  { id: "INV-103", name: "AI Vision Camera", sku: "AIV-5512", barcode: "8901123045014", category: "Electronics", warehouse: "Warsaw Dock", quantity: 65, reorderPoint: 40, lastMovement: "1h ago", value: 39000 },
  { id: "INV-104", name: "Thermal Label Roll", sku: "TLR-7120", barcode: "8901123045015", category: "Packaging", warehouse: "Berlin Hub", quantity: 180, reorderPoint: 80, lastMovement: "3h ago", value: 3600 },
  { id: "INV-105", name: "Pallet RFID Tags", sku: "PRT-4470", barcode: "8901123045016", category: "Tracking", warehouse: "Milan Port", quantity: 74, reorderPoint: 60, lastMovement: "30m ago", value: 5180 },
  { id: "INV-106", name: "Hydraulic Lift Kit", sku: "HLK-9822", barcode: "8901123045017", category: "Machinery", warehouse: "Prague Node", quantity: 12, reorderPoint: 15, lastMovement: "4h ago", value: 14400 },
  { id: "INV-107", name: "Warehouse Drone Cell", sku: "WDC-8802", barcode: "8901123045018", category: "Automation", warehouse: "Warsaw Dock", quantity: 27, reorderPoint: 20, lastMovement: "45m ago", value: 21420 },
  { id: "INV-108", name: "Cold Chain Sensor", sku: "CCS-3122", barcode: "8901123045019", category: "Monitoring", warehouse: "Milan Port", quantity: 9, reorderPoint: 14, lastMovement: "6h ago", value: 7650 }
];

export const stockMovement = [
  { day: "Mon", inbound: 320, outbound: 280 },
  { day: "Tue", inbound: 410, outbound: 340 },
  { day: "Wed", inbound: 390, outbound: 360 },
  { day: "Thu", inbound: 450, outbound: 372 },
  { day: "Fri", inbound: 470, outbound: 401 },
  { day: "Sat", inbound: 280, outbound: 220 }
];

export const warehouses: WarehouseItem[] = [
  { id: "WH-01", name: "Berlin Hub", location: "Berlin, DE", manager: "Lena Hartmann", capacityPercent: 82, throughput: 1240, status: "Online" },
  { id: "WH-02", name: "Prague Node", location: "Prague, CZ", manager: "Marek Novak", capacityPercent: 91, throughput: 980, status: "Congested" },
  { id: "WH-03", name: "Warsaw Dock", location: "Warsaw, PL", manager: "Jakub Zielinski", capacityPercent: 69, throughput: 1310, status: "Online" },
  { id: "WH-04", name: "Milan Port", location: "Milan, IT", manager: "Giulia Riva", capacityPercent: 58, throughput: 890, status: "Maintenance" }
];

export const capacityTrend = [
  { month: "Jan", berlin: 66, prague: 74, warsaw: 58, milan: 47 },
  { month: "Feb", berlin: 70, prague: 80, warsaw: 61, milan: 49 },
  { month: "Mar", berlin: 74, prague: 82, warsaw: 64, milan: 51 },
  { month: "Apr", berlin: 78, prague: 87, warsaw: 67, milan: 56 },
  { month: "May", berlin: 82, prague: 91, warsaw: 69, milan: 58 }
];

export const products: ProductItem[] = [
  { id: "PR-001", name: "NanoVision Scanner", category: "Electronics", price: 1299, margin: 38, stock: 56, soldThisMonth: 214, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80" },
  { id: "PR-002", name: "Flux Logistics Tablet", category: "Devices", price: 899, margin: 33, stock: 34, soldThisMonth: 172, image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=400&q=80" },
  { id: "PR-003", name: "ThermoSense Beacon", category: "Monitoring", price: 249, margin: 41, stock: 103, soldThisMonth: 331, image: "https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?w=400&q=80" },
  { id: "PR-004", name: "AeroPick Arm", category: "Automation", price: 4999, margin: 29, stock: 17, soldThisMonth: 48, image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80" },
  { id: "PR-005", name: "Quantum Pallet Sensor", category: "Tracking", price: 149, margin: 44, stock: 220, soldThisMonth: 472, image: "https://images.unsplash.com/photo-1488229297570-58520851e868?w=400&q=80" },
  { id: "PR-006", name: "ArcFlow Conveyor Unit", category: "Machinery", price: 3599, margin: 26, stock: 12, soldThisMonth: 37, image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=80" }
];

export const productPerformance = [
  { month: "Jan", revenue: 180000, profit: 54000 },
  { month: "Feb", revenue: 201000, profit: 62000 },
  { month: "Mar", revenue: 222000, profit: 70000 },
  { month: "Apr", revenue: 236000, profit: 76000 },
  { month: "May", revenue: 261000, profit: 84000 }
];

export const orders: OrderItem[] = [
  { id: "SO-78421", type: "Sales", partner: "Nordic Retail Group", total: 28940, status: "In Transit", date: "2026-05-22", warehouse: "Berlin Hub" },
  { id: "PO-33982", type: "Purchase", partner: "Titan Components Ltd.", total: 42100, status: "Picking", date: "2026-05-21", warehouse: "Prague Node" },
  { id: "SO-78409", type: "Sales", partner: "Apex Commerce", total: 18500, status: "Delivered", date: "2026-05-21", warehouse: "Warsaw Dock" },
  { id: "SO-78388", type: "Sales", partner: "BlueMart EU", total: 23380, status: "Created", date: "2026-05-20", warehouse: "Milan Port" },
  { id: "PO-33951", type: "Purchase", partner: "Optima Industrial", total: 19750, status: "In Transit", date: "2026-05-20", warehouse: "Berlin Hub" },
  { id: "SO-78362", type: "Sales", partner: "Velo Distribution", total: 31580, status: "Picking", date: "2026-05-19", warehouse: "Warsaw Dock" }
];

export const orderRevenueTrend = [
  { week: "W1", sales: 98000, purchase: 61000 },
  { week: "W2", sales: 109000, purchase: 65500 },
  { week: "W3", sales: 115000, purchase: 63200 },
  { week: "W4", sales: 131000, purchase: 68100 }
];

export const analyticsKpis = [
  { label: "Revenue YTD", value: "$4.82M", change: "+18.4%" },
  { label: "Gross Margin", value: "32.8%", change: "+2.3%" },
  { label: "Inventory Turnover", value: "8.7x", change: "+0.9x" },
  { label: "Order Fill Rate", value: "97.2%", change: "+1.1%" }
];

export const analyticsRevenue = [
  { month: "Jan", revenue: 740000, turnover: 6.1, margin: 28.1 },
  { month: "Feb", revenue: 810000, turnover: 6.8, margin: 29.6 },
  { month: "Mar", revenue: 860000, turnover: 7.4, margin: 30.2 },
  { month: "Apr", revenue: 910000, turnover: 8.1, margin: 31.6 },
  { month: "May", revenue: 980000, turnover: 8.7, margin: 32.8 }
];

export const forecastingSeries = [
  { month: "Jun", demand: 9200, predicted: 9800, confidence: 81 },
  { month: "Jul", demand: 9700, predicted: 10350, confidence: 84 },
  { month: "Aug", demand: 10100, predicted: 11200, confidence: 86 },
  { month: "Sep", demand: 10800, predicted: 11900, confidence: 83 },
  { month: "Oct", demand: 11300, predicted: 12450, confidence: 79 }
];

export const riskHeatmap = [
  { zone: "Berlin", risk: 21, volatility: 14 },
  { zone: "Prague", risk: 48, volatility: 41 },
  { zone: "Warsaw", risk: 26, volatility: 19 },
  { zone: "Milan", risk: 37, volatility: 28 }
];

export const suppliers: SupplierItem[] = [
  { id: "SUP-01", name: "Titan Components Ltd.", category: "Electronics", rating: 4.8, onTimeRate: 96, activeContracts: 4, contact: "ops@titancomponents.com" },
  { id: "SUP-02", name: "Optima Industrial", category: "Machinery", rating: 4.3, onTimeRate: 89, activeContracts: 3, contact: "contact@optima-industrial.com" },
  { id: "SUP-03", name: "Nova Packaging GmbH", category: "Packaging", rating: 4.6, onTimeRate: 93, activeContracts: 2, contact: "sales@novapackaging.de" },
  { id: "SUP-04", name: "CryoMetrics S.p.A.", category: "Monitoring", rating: 4.1, onTimeRate: 87, activeContracts: 2, contact: "hello@cryometrics.it" }
];

export const supplierPerformanceTrend = [
  { month: "Jan", quality: 91, delivery: 88 },
  { month: "Feb", quality: 92, delivery: 89 },
  { month: "Mar", quality: 94, delivery: 91 },
  { month: "Apr", quality: 95, delivery: 92 },
  { month: "May", quality: 95, delivery: 93 }
];

export const alerts: AlertItem[] = [
  { id: "AL-901", title: "Smart Conveyor Motor below threshold", category: "Low Stock", severity: "High", timestamp: "5m ago", recommendation: "Create urgent purchase order for 40 units." },
  { id: "AL-902", title: "Cold Chain Sensor expires in 12 days", category: "Expiry", severity: "Medium", timestamp: "18m ago", recommendation: "Prioritize dispatch to high-turnover warehouses." },
  { id: "AL-903", title: "Prague Node receiving queue delay", category: "Warehouse Issue", severity: "Critical", timestamp: "26m ago", recommendation: "Shift two inbound trucks to Berlin Hub." },
  { id: "AL-904", title: "Supplier shipment delayed by 18 hours", category: "Delay", severity: "High", timestamp: "42m ago", recommendation: "Activate backup supplier contract." }
];

export const reportHistory = [
  { id: "RP-2001", name: "Monthly Revenue Deep Dive", type: "PDF", generatedBy: "Lena Hartmann", generatedAt: "2026-05-20 09:30", status: "Ready" },
  { id: "RP-2002", name: "Warehouse Utilization Summary", type: "Excel", generatedBy: "Marek Novak", generatedAt: "2026-05-20 11:14", status: "Ready" },
  { id: "RP-2003", name: "Supplier Reliability Review", type: "PDF", generatedBy: "AI Agent", generatedAt: "2026-05-21 08:02", status: "Ready" },
  { id: "RP-2004", name: "Stock Risk Outlook", type: "Excel", generatedBy: "AI Agent", generatedAt: "2026-05-21 16:20", status: "Queued" }
];
