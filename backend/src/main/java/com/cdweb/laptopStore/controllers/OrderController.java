package com.cdweb.laptopStore.controllers;

import com.cdweb.laptopStore.auth.dto.OrderResponse;
import com.cdweb.laptopStore.dto.OrderDetails;
import com.cdweb.laptopStore.dto.OrderRequest;
import com.cdweb.laptopStore.dto.ShippingProviderDTO;
import com.cdweb.laptopStore.repositories.ShippingProviderRepository;
import com.cdweb.laptopStore.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/order")
@CrossOrigin
public class OrderController {

    @Autowired
    OrderService orderService;

    @Autowired
    private ShippingProviderRepository shippingProviderRepository;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest, Principal principal) throws Exception {
        OrderResponse orderResponse = orderService.createOrder(orderRequest,principal);
            // return new ResponseEntity<>(order, HttpStatus.CREATED);

        return new ResponseEntity<>(orderResponse,HttpStatus.OK);
    }

    @PostMapping("/update-payment")
    public ResponseEntity<?> updatePaymentStatus(@RequestBody Map<String,String> request){
        Map<String,String> response = orderService.updateStatus(request.get("paymentIntent"),request.get("status"));
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @PostMapping("/cancel/{id}")
    public ResponseEntity<?> cancelOrder(@PathVariable UUID id,Principal principal){
        orderService.cancelOrder(id,principal);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<List<OrderDetails>> getOrderByUser(Principal principal) {
        List<OrderDetails> orders = orderService.getOrdersByUser(principal.getName());
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/shipping-providers")
    public List<ShippingProviderDTO> getAll() {
        return shippingProviderRepository.findAll().stream()
            .map(sp -> new ShippingProviderDTO(sp.getId(), sp.getName(), sp.getImgShip() , sp.getTrackingUrlTemplate()))
            .collect(Collectors.toList());
    }

}
