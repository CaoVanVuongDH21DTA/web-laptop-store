package com.cdweb.laptopStore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.cdweb.laptopStore.entities.OrderStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {
    private UUID userId;
    private LocalDateTime orderDate;
    private UUID addressId;
    private UUID shippingProviderId;
    private List<OrderItemRequest> orderItemRequests;
    private Double totalAmount;
    private Double discount;
    private String paymentMethod;
    private LocalDateTime expectedDeliveryDate;
    private OrderStatus orderStatus;
}
