package com.cdweb.laptopStore.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "shipping_providers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingProvider {

    @Id
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(name = "image_ship", length = 255)
    private String imgShip;

    @Column(name = "contact_info", length = 255)
    private String contactInfo;

    @Column(name = "tracking_url_template", length = 500)
    private String trackingUrlTemplate;
}
