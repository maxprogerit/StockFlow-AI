package com.stockflow.backend.service;

import com.stockflow.backend.domain.forecast.ForecastRecord;
import com.stockflow.backend.domain.product.Product;
import com.stockflow.backend.exception.NotFoundException;
import com.stockflow.backend.repository.ForecastRepository;
import com.stockflow.backend.repository.ProductRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class ForecastService {
    private final ProductRepository productRepository;
    private final ForecastRepository forecastRepository;
    private final RestClient.Builder restClientBuilder = RestClient.builder();

    @Value("${app.ml.service-url}")
    private String mlServiceUrl;

    public Map<String, Object> forecast(UUID productId, int months) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found"));

        Map<String, Object> response = restClientBuilder.build()
                .post()
                .uri(mlServiceUrl + "/forecast/demand")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("product_id", productId.toString(), "months", months))
                .retrieve()
                .body(Map.class);

        Number demand = (Number) response.getOrDefault("predicted_demand", 0.0);
        Number restock = (Number) response.getOrDefault("recommended_restock", 0.0);
        Number confidence = (Number) response.getOrDefault("confidence", 0.8);
        String insight = String.valueOf(response.getOrDefault("insight", "Stable demand expected"));

        ForecastRecord record = new ForecastRecord();
        record.setProduct(product);
        record.setPredictedDemand(BigDecimal.valueOf(demand.doubleValue()));
        record.setRecommendedRestock(BigDecimal.valueOf(restock.doubleValue()));
        record.setConfidence(confidence.doubleValue());
        record.setPeriodStart(LocalDate.now());
        record.setPeriodEnd(LocalDate.now().plusMonths(months));
        record.setInsight(insight);
        forecastRepository.save(record);
        return response;
    }

    public List<ForecastRecord> history(UUID productId) {
        return forecastRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }
}

