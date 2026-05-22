package com.stockflow.backend.config;

import com.stockflow.backend.domain.alert.Alert;
import com.stockflow.backend.domain.catalog.Category;
import com.stockflow.backend.domain.company.Company;
import com.stockflow.backend.domain.inventory.Inventory;
import com.stockflow.backend.domain.inventory.StockMovement;
import com.stockflow.backend.domain.order.CustomerOrder;
import com.stockflow.backend.domain.order.OrderItem;
import com.stockflow.backend.domain.order.PurchaseOrder;
import com.stockflow.backend.domain.product.Product;
import com.stockflow.backend.domain.report.Report;
import com.stockflow.backend.domain.settings.AppSettings;
import com.stockflow.backend.domain.supplier.Supplier;
import com.stockflow.backend.domain.user.Role;
import com.stockflow.backend.domain.user.User;
import com.stockflow.backend.repository.AlertRepository;
import com.stockflow.backend.repository.AppSettingsRepository;
import com.stockflow.backend.repository.CategoryRepository;
import com.stockflow.backend.repository.CompanyRepository;
import com.stockflow.backend.repository.CustomerOrderRepository;
import com.stockflow.backend.repository.ForecastRepository;
import com.stockflow.backend.repository.InventoryRepository;
import com.stockflow.backend.repository.OrderItemRepository;
import com.stockflow.backend.repository.ProductRepository;
import com.stockflow.backend.repository.PurchaseOrderRepository;
import com.stockflow.backend.repository.ReportRepository;
import com.stockflow.backend.repository.StockMovementRepository;
import com.stockflow.backend.repository.SupplierRepository;
import com.stockflow.backend.repository.UserRepository;
import com.stockflow.backend.repository.WarehouseRepository;
import com.stockflow.backend.domain.warehouse.Warehouse;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DemoDataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final WarehouseRepository warehouseRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final StockMovementRepository stockMovementRepository;
    private final CustomerOrderRepository customerOrderRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final OrderItemRepository orderItemRepository;
    private final AlertRepository alertRepository;
    private final ReportRepository reportRepository;
    private final ForecastRepository forecastRepository;
    private final CompanyRepository companyRepository;
    private final AppSettingsRepository appSettingsRepository;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("demo@stockflow.ai").isPresent()) {
            return;
        }

        User demo = new User();
        demo.setFullName("Demo Admin");
        demo.setEmail("demo@stockflow.ai");
        demo.setPassword(passwordEncoder.encode("demo123456"));
        demo.setRole(Role.ADMIN);
        demo.setAvatarUrl("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&q=80");
        demo.setTimezone("Europe/Berlin");
        demo.setJobTitle("Head of Operations");
        demo = userRepository.save(demo);

        Company company = new Company();
        company.setOwner(demo);
        company.setName("StockFlow Demo Logistics");
        company.setWebsite("https://stockflow.ai");
        company.setAddress("Berlin, Germany");
        companyRepository.save(company);

        AppSettings settings = new AppSettings();
        settings.setOwner(demo);
        settings.setCurrency("EUR");
        settings.setTimezone("Europe/Berlin");
        settings.setNotificationsEnabled(true);
        settings.setLowStockThresholdDefault(12);
        settings.setForecastHorizonMonths(6);
        settings.setTheme("dark");
        settings.setApiKeyHint("sf_demo_****");
        appSettingsRepository.save(settings);

        Category electronics = createCategory(demo, "Electronics", "Sensors and devices");
        Category automation = createCategory(demo, "Automation", "Automation hardware");
        Category packaging = createCategory(demo, "Packaging", "Shipping materials");

        Supplier titan = createSupplier(demo, "Titan Components Ltd.", "ops@titancomponents.com", 4.8);
        Supplier nova = createSupplier(demo, "Nova Packaging GmbH", "hello@novapackaging.de", 4.5);
        Supplier optima = createSupplier(demo, "Optima Industrial", "procurement@optima-industrial.com", 4.3);

        Warehouse berlin = createWarehouse(demo, "Berlin Hub", "Berlin, DE", 2200);
        Warehouse prague = createWarehouse(demo, "Prague Node", "Prague, CZ", 1800);
        Warehouse warsaw = createWarehouse(demo, "Warsaw Dock", "Warsaw, PL", 2500);

        Product camera = createProduct(demo, "AIV-5512", "AI Vision Camera", electronics, titan, BigDecimal.valueOf(590), BigDecimal.valueOf(340), 24, "8901123045014");
        Product sensor = createProduct(demo, "QSP-8821", "Quantum Sensor Pack", electronics, titan, BigDecimal.valueOf(420), BigDecimal.valueOf(260), 30, "8901123045012");
        Product drone = createProduct(demo, "WDC-8802", "Warehouse Drone Cell", automation, optima, BigDecimal.valueOf(980), BigDecimal.valueOf(610), 12, "8901123045018");
        Product labels = createProduct(demo, "TLR-7120", "Thermal Label Roll", packaging, nova, BigDecimal.valueOf(22), BigDecimal.valueOf(8), 100, "8901123045015");

        createInventory(demo, camera, berlin, 65);
        createInventory(demo, sensor, berlin, 42);
        createInventory(demo, drone, prague, 9);
        createInventory(demo, labels, warsaw, 240);
        createInventory(demo, camera, warsaw, 21);

        createPurchaseOrder(demo, titan, berlin, camera, 40, BigDecimal.valueOf(330));
        createPurchaseOrder(demo, optima, prague, drone, 20, BigDecimal.valueOf(580));

        createCustomerOrder(demo, "Nordic Retail Group", berlin, camera, 18, BigDecimal.valueOf(620), "IN_TRANSIT");
        createCustomerOrder(demo, "BlueMart EU", warsaw, labels, 120, BigDecimal.valueOf(24), "DELIVERED");
        createCustomerOrder(demo, "Apex Commerce", berlin, sensor, 14, BigDecimal.valueOf(430), "PICKING");

        createAlert(demo, "LOW_STOCK", "HIGH", "Warehouse Drone Cell below threshold at Prague Node");
        createAlert(demo, "SUPPLIER_DELAY", "MEDIUM", "Titan Components shipment delayed by 8 hours");
        createAlert(demo, "FORECAST_STOCKOUT", "HIGH", "AI predicts stockout for AIV-5512 in 12 days");

        createReport(demo, "Monthly Revenue Deep Dive", "PDF");
        createReport(demo, "Low Stock Risk Matrix", "EXCEL");
    }

    private Category createCategory(User owner, String name, String description) {
        Category category = new Category();
        category.setOwner(owner);
        category.setName(name);
        category.setDescription(description);
        return categoryRepository.save(category);
    }

    private Supplier createSupplier(User owner, String name, String email, double rating) {
        Supplier supplier = new Supplier();
        supplier.setOwner(owner);
        supplier.setName(name);
        supplier.setContactEmail(email);
        supplier.setContactPhone("+49 30 2000 123");
        supplier.setAddress("Europe");
        supplier.setRating(rating);
        supplier.setActive(true);
        return supplierRepository.save(supplier);
    }

    private Warehouse createWarehouse(User owner, String name, String location, int capacity) {
        Warehouse warehouse = new Warehouse();
        warehouse.setOwner(owner);
        warehouse.setName(name);
        warehouse.setLocation(location);
        warehouse.setCapacity(capacity);
        warehouse.setActive(true);
        return warehouseRepository.save(warehouse);
    }

    private Product createProduct(User owner, String sku, String name, Category category, Supplier supplier, BigDecimal price, BigDecimal cost, int threshold, String barcode) {
        Product product = new Product();
        product.setOwner(owner);
        product.setSku(sku);
        product.setName(name);
        product.setCategory(category);
        product.setSupplier(supplier);
        product.setPrice(price);
        product.setCost(cost);
        product.setLowStockThreshold(threshold);
        product.setBarcode(barcode);
        product.setDescription(name + " for automated inventory operations");
        return productRepository.save(product);
    }

    private void createInventory(User owner, Product product, Warehouse warehouse, int quantity) {
        Inventory inventory = new Inventory();
        inventory.setOwner(owner);
        inventory.setProduct(product);
        inventory.setWarehouse(warehouse);
        inventory.setQuantity(quantity);
        inventory.setReserved(0);
        inventory.setBatchNumber("B-" + product.getSku());
        inventory.setExpiryDate(LocalDate.now().plusMonths(6));
        Inventory saved = inventoryRepository.save(inventory);

        StockMovement movement = new StockMovement();
        movement.setOwner(owner);
        movement.setType("INITIAL_LOAD");
        movement.setQuantity(quantity);
        movement.setReferenceNumber("SEED-" + product.getSku());
        movement.setOccurredAt(Instant.now().minusSeconds((long) (Math.random() * 120000)));
        movement.setProduct(product);
        movement.setWarehouse(warehouse);
        stockMovementRepository.save(movement);
    }

    private void createPurchaseOrder(User owner, Supplier supplier, Warehouse warehouse, Product product, int qty, BigDecimal unitPrice) {
        PurchaseOrder order = new PurchaseOrder();
        order.setOwner(owner);
        order.setSupplier(supplier);
        order.setWarehouse(warehouse);
        order.setOrderNumber("PO-" + System.nanoTime());
        order.setStatus("COMPLETED");
        order.setExpectedDate(LocalDate.now().plusDays(7));
        order.setTotalAmount(unitPrice.multiply(BigDecimal.valueOf(qty)));
        order = purchaseOrderRepository.save(order);

        OrderItem item = new OrderItem();
        item.setOwner(owner);
        item.setPurchaseOrder(order);
        item.setProduct(product);
        item.setQuantity(qty);
        item.setUnitPrice(unitPrice);
        orderItemRepository.save(item);
    }

    private void createCustomerOrder(User owner, String customer, Warehouse warehouse, Product product, int qty, BigDecimal unitPrice, String status) {
        CustomerOrder order = new CustomerOrder();
        order.setOwner(owner);
        order.setOrderNumber("SO-" + System.nanoTime());
        order.setCustomerName(customer);
        order.setStatus(status);
        order.setWarehouse(warehouse);
        order.setOrderedAt(Instant.now().minusSeconds((long) (Math.random() * 140000)));
        order.setTotalAmount(unitPrice.multiply(BigDecimal.valueOf(qty)));
        order = customerOrderRepository.save(order);

        OrderItem item = new OrderItem();
        item.setOwner(owner);
        item.setCustomerOrder(order);
        item.setProduct(product);
        item.setQuantity(qty);
        item.setUnitPrice(unitPrice);
        orderItemRepository.save(item);
    }

    private void createAlert(User owner, String type, String severity, String message) {
        Alert alert = new Alert();
        alert.setOwner(owner);
        alert.setType(type);
        alert.setSeverity(severity);
        alert.setMessage(message);
        alert.setResolved(false);
        alertRepository.save(alert);
    }

    private void createReport(User owner, String name, String type) {
        Report report = new Report();
        report.setOwner(owner);
        report.setName(name);
        report.setType(type);
        report.setStatus("READY");
        report.setFileUrl("/exports/" + name.replace(" ", "-").toLowerCase() + "." + type.toLowerCase());
        report.setGeneratedAt(Instant.now());
        reportRepository.save(report);
    }
}
