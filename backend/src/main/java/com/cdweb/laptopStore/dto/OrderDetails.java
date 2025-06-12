package com.cdweb.laptopStore.dto;

import com.cdweb.laptopStore.entities.Address;
import com.cdweb.laptopStore.entities.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDetails {

    private UUID id;
    private LocalDateTime orderDate;
    private Address address;
    private Double totalAmount;
    private OrderStatus orderStatus;
    private String shipmentNumber;
    private LocalDateTime expectedDeliveryDate;
    private List<OrderItemDetail> orderItemList;

}
