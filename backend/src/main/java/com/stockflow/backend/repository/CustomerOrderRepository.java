package com.stockflow.backend.repository;

import com.stockflow.backend.domain.order.CustomerOrder;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, UUID> {
    @Query("""
            select o from CustomerOrder o
            where o.owner.id = :ownerId
              and (cast(:status as String) is null or o.status = :status)
              and (cast(:fromDate as Instant) is null or o.orderedAt >= :fromDate)
              and (
                :query is null or cast(:query as string) = ''
                or lower(o.orderNumber) like lower(concat('%', cast(:query as string), '%'))
                or lower(o.customerName) like lower(concat('%', cast(:query as string), '%'))
              )
            """)
    Page<CustomerOrder> search(@Param("ownerId") UUID ownerId, @Param("status") String status, @Param("fromDate") Instant fromDate, @Param("query") String query, Pageable pageable);

    List<CustomerOrder> findTop10ByOwnerIdOrderByOrderedAtDesc(UUID ownerId);
    long countByOwnerId(UUID ownerId);
}

