package com.stockflow.backend.mapper;

import com.stockflow.backend.domain.catalog.Category;
import com.stockflow.backend.domain.product.Product;
import com.stockflow.backend.domain.supplier.Supplier;
import com.stockflow.backend.dto.product.ProductDto;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-22T17:53:51+0200",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class ProductMapperImpl implements ProductMapper {

    @Override
    public ProductDto toDto(Product product) {
        if ( product == null ) {
            return null;
        }

        ProductDto productDto = new ProductDto();

        productDto.setCategoryId( productCategoryId( product ) );
        productDto.setSupplierId( productSupplierId( product ) );
        productDto.setId( product.getId() );
        productDto.setSku( product.getSku() );
        productDto.setName( product.getName() );
        productDto.setDescription( product.getDescription() );
        productDto.setImageUrl( product.getImageUrl() );
        productDto.setPrice( product.getPrice() );
        productDto.setCost( product.getCost() );
        productDto.setLowStockThreshold( product.getLowStockThreshold() );
        productDto.setBarcode( product.getBarcode() );

        return productDto;
    }

    @Override
    public Product toEntity(ProductDto dto) {
        if ( dto == null ) {
            return null;
        }

        Product product = new Product();

        product.setSku( dto.getSku() );
        product.setName( dto.getName() );
        product.setDescription( dto.getDescription() );
        product.setImageUrl( dto.getImageUrl() );
        product.setPrice( dto.getPrice() );
        product.setCost( dto.getCost() );
        product.setLowStockThreshold( dto.getLowStockThreshold() );
        product.setBarcode( dto.getBarcode() );

        return product;
    }

    private UUID productCategoryId(Product product) {
        if ( product == null ) {
            return null;
        }
        Category category = product.getCategory();
        if ( category == null ) {
            return null;
        }
        UUID id = category.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private UUID productSupplierId(Product product) {
        if ( product == null ) {
            return null;
        }
        Supplier supplier = product.getSupplier();
        if ( supplier == null ) {
            return null;
        }
        UUID id = supplier.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
