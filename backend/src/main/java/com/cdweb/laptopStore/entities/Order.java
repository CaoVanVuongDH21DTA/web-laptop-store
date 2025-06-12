package com.cdweb.laptopStore.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.cdweb.laptopStore.auth.entities.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name="orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue
    private UUID id;

    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime orderDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "address_id",nullable = false)
    @ToString.Exclude
    @JsonIgnore
    private Address address;

    @ManyToOne
    @JoinColumn(name = "shipping_provider_id",nullable = false)
    @ToString.Exclude
    @JsonIgnore
    private ShippingProvider shippingProvider;

    @Column(nullable = false)
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus orderStatus;

    @Column(nullable = false)
    private String paymentMethod;

    @Column(nullable = true)
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime expectedDeliveryDate;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "order",cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<OrderItem> orderItemList;

    private Double discount;

    @OneToOne(fetch = FetchType.LAZY,mappedBy = "order",cascade = CascadeType.ALL)
    @ToString.Exclude
    private Payment payment;

}
