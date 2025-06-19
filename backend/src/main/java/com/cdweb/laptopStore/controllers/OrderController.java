package com.cdweb.laptopStore.controllers;

import com.cdweb.laptopStore.auth.dto.OrderResponse;
import com.cdweb.laptopStore.dto.OrderDetails;
import com.cdweb.laptopStore.dto.OrderRequest;
import com.cdweb.laptopStore.dto.ShippingProviderDTO;
import com.cdweb.laptopStore.entities.Order;
import com.cdweb.laptopStore.entities.OrderStatus;
import com.cdweb.laptopStore.repositories.OrderRepository;
import com.cdweb.laptopStore.repositories.ShippingProviderRepository;
import com.cdweb.laptopStore.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
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

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest, Principal principal) throws Exception {
        OrderResponse orderResponse = orderService.createOrder(orderRequest,principal);
        return new ResponseEntity<>(orderResponse,HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllOrders(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "1000") int perPage
    ) {
        Page<Order> orderPage = orderRepository.findAllWithUser(PageRequest.of(page - 1, perPage));
        List<Order> orders = orderPage.getContent();
        List<OrderDetails> orderDetails = orders.stream()
            .map(order -> {
                return OrderDetails.builder()
                    .id(order.getId())
                    .orderDate(order.getOrderDate())
                    .address(order.getAddress())
                    .totalAmount(order.getTotalAmount())
                    .orderStatus(order.getOrderStatus() != null ? order.getOrderStatus() : OrderStatus.PENDING)
                    .expectedDeliveryDate(order.getExpectedDeliveryDate() != null 
                        ? order.getExpectedDeliveryDate() 
                        : order.getOrderDate().plusDays(7))
                    .orderItemList(orderService.getItemDetails(order.getOrderItemList()))
                    .user(order.getUser())
                    .build();
            })
            .collect(Collectors.toList());
        Map<String, Object> response = new HashMap<>();
        response.put("data", orderDetails);
        response.put("total", orderPage.getTotalElements());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @PostMapping("/update-payment")
    public ResponseEntity<?> updatePaymentStatus(@RequestBody Map<String,String> request){
        Map<String,String> response = orderService.updateStatus(request.get("paymentIntent"),request.get("status"));
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable UUID id) {
        return orderRepository.findByIdWithUser(id)
            .map(order -> {
                OrderDetails orderDetails = OrderDetails.builder()
                    .id(order.getId())
                    .orderDate(order.getOrderDate())
                    .address(order.getAddress())
                    .totalAmount(order.getTotalAmount())
                    .orderStatus(order.getOrderStatus() != null ? order.getOrderStatus() : OrderStatus.PENDING)
                    .expectedDeliveryDate(order.getExpectedDeliveryDate() != null
                        ? order.getExpectedDeliveryDate()
                        : order.getOrderDate().plusDays(7))
                    .orderItemList(orderService.getItemDetails(order.getOrderItemList()))
                    .user(order.getUser())
                    .build();
                return new ResponseEntity<>(orderDetails, HttpStatus.OK);
            })
            .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
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

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable UUID id, @RequestBody OrderRequest orderRequest, Principal principal) {
        try {
            Order updatedOrder = orderService.updateOrder(id, orderRequest, principal);
            return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
        } catch (RuntimeException ex) {
            return new ResponseEntity<>(Map.of("error", ex.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable UUID id, Principal principal) {
        try {
            orderService.deleteOrder(id, principal);
            return new ResponseEntity<>(Map.of("message", "Đơn hàng đã được xóa"), HttpStatus.OK);
        } catch (RuntimeException ex) {
            return new ResponseEntity<>(Map.of("error", ex.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

}
