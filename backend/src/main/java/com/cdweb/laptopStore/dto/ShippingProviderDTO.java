package com.cdweb.laptopStore.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShippingProviderDTO {
    private UUID id;
    private String name;
    private String imgShip;
    private String trackingUrlTemplate;
}