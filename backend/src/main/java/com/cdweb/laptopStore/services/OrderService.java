package com.cdweb.laptopStore.services;

import com.stripe.model.PaymentIntent;
import com.cdweb.laptopStore.auth.dto.OrderResponse;
import com.cdweb.laptopStore.auth.entities.User;
import com.cdweb.laptopStore.dto.OrderDetails;
import com.cdweb.laptopStore.dto.OrderItemDetail;
import com.cdweb.laptopStore.dto.OrderRequest;
import com.cdweb.laptopStore.entities.*;
import com.cdweb.laptopStore.repositories.OrderRepository;
import com.cdweb.laptopStore.repositories.ShippingProviderRepository;

import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.*;

@Service
public class OrderService {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    ProductService productService;

    @Autowired
    PaymentIntentService paymentIntentService;

    @Autowired
    private ShippingProviderRepository shippingProviderRepository;

    @Transactional
    public OrderResponse createOrder(OrderRequest orderRequest, Principal principal) throws Exception {
        User user = (User) userDetailsService.loadUserByUsername(principal.getName());
        Address address = user.getAddressList().stream().filter(address1 -> orderRequest.getAddressId().equals(address1.getId())).findFirst().orElseThrow(BadRequestException::new);

        // 🧩 Lấy shipping provider
        ShippingProvider shippingProvider = shippingProviderRepository.findById(orderRequest.getShippingProviderId())
                .orElseThrow(() -> new BadRequestException("Invalid shipping provider"));

        Order order= Order.builder()
                .user(user)
                .address(address)
                .shippingProvider(shippingProvider)
                .totalAmount(orderRequest.getTotalAmount())
                .orderDate(orderRequest.getOrderDate())
                .discount(orderRequest.getDiscount())
                .expectedDeliveryDate(orderRequest.getExpectedDeliveryDate())
                .paymentMethod(orderRequest.getPaymentMethod())
                .orderStatus(OrderStatus.PENDING)
                .build();
        List<OrderItem> orderItems = orderRequest.getOrderItemRequests().stream().map(orderItemRequest -> {
            try {
                Product product= productService.fetchProductById(orderItemRequest.getProductId());
                OrderItem orderItem= OrderItem.builder()
                        .product(product)
                        .productVariantId(orderItemRequest.getProductVariantId())
                        .quantity(orderItemRequest.getQuantity())
                        .order(order)
                        .build();
                return orderItem;
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }).toList();

        order.setOrderItemList(orderItems);
        Payment payment=new Payment();
        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setPaymentDate(new Date());
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentMethod(order.getPaymentMethod());
        order.setPayment(payment);
        Order savedOrder = orderRepository.save(order);


        OrderResponse orderResponse = OrderResponse.builder()
                .paymentMethod(orderRequest.getPaymentMethod())
                .orderId(savedOrder.getId())
                .build();
        if(Objects.equals(orderRequest.getPaymentMethod(), "CARD")){
            orderResponse.setCredentials(paymentIntentService.createPaymentIntent(order));
        }

        return orderResponse;

    }

    public Map<String,String> updateStatus(String paymentIntentId, String status) {
        try{
            PaymentIntent paymentIntent= PaymentIntent.retrieve(paymentIntentId);
            if (paymentIntent != null && paymentIntent.getStatus().equals("succeeded")) {
               String orderId = paymentIntent.getMetadata().get("orderId") ;
               Order order= orderRepository.findById(UUID.fromString(orderId)).orElseThrow(BadRequestException::new);
               Payment payment = order.getPayment();
               payment.setPaymentStatus(PaymentStatus.COMPLETED);
                payment.setPaymentMethod(paymentIntent.getPaymentMethod());
                order.setPaymentMethod(paymentIntent.getPaymentMethod());
                order.setOrderStatus(OrderStatus.IN_PROGRESS);
                order.setPayment(payment);
                Order savedOrder = orderRepository.save(order);
                Map<String,String> map = new HashMap<>();
                map.put("orderId", String.valueOf(savedOrder.getId()));
                return map;
            }
            else{
                throw new IllegalArgumentException("PaymentIntent not found or missing metadata");
            }
        }
        catch (Exception e){
            throw new IllegalArgumentException("PaymentIntent not found or missing metadata");
        }
    }

    public List<OrderDetails> getOrdersByUser(String name) {
        User user = (User) userDetailsService.loadUserByUsername(name);
        List<Order> orders = orderRepository.findByUser(user);
        return orders.stream().map(order -> {
            return OrderDetails.builder()
                .id(order.getId())
                .orderDate(order.getOrderDate())
                .orderStatus(order.getOrderStatus())
                .address(order.getAddress())
                .totalAmount(order.getTotalAmount())
                .orderItemList(getItemDetails(order.getOrderItemList()))
                .expectedDeliveryDate(order.getExpectedDeliveryDate())
                .user(order.getUser())
                .build();
        }).toList();
    }

    public List<OrderItemDetail> getItemDetails(List<OrderItem> orderItemList) {
        return orderItemList.stream().map(orderItem -> {
            return OrderItemDetail.builder()
                .id(orderItem.getId())
                .product(orderItem.getProduct())
                .quantity(orderItem.getQuantity())
                .build();
        }).toList();
    }
    
    public void cancelOrder(UUID id, Principal principal) {
        User user = (User) userDetailsService.loadUserByUsername(principal.getName());
        Order order = orderRepository.findById(id).get();
        if(null != order && order.getUser().getId().equals(user.getId())){
            order.setOrderStatus(OrderStatus.CANCELLED);
            //logic to refund amount
            orderRepository.save(order);
        }
        else{
            new RuntimeException("Invalid request");
        }
    }

    @Transactional
    public Order updateOrder(UUID id, OrderRequest orderRequest, Principal principal) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Cập nhật các trường cho phép
        if (orderRequest.getOrderStatus() != null) {
            order.setOrderStatus(orderRequest.getOrderStatus());
        }

        if (orderRequest.getExpectedDeliveryDate() != null) {
            order.setExpectedDeliveryDate(orderRequest.getExpectedDeliveryDate());
        }

        // Có thể cập nhật thêm nếu cần
        return orderRepository.save(order);
    }

    @Transactional
    public void deleteOrder(UUID orderId, Principal principal) {
        User user = (User) userDetailsService.loadUserByUsername(principal.getName());
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        // Kiểm tra quyền sở hữu (chỉ chủ đơn hàng hoặc admin mới được xóa)
        boolean isAdmin = user.getAuthorities().stream()
            .anyMatch(auth -> auth.getAuthority().equalsIgnoreCase("ADMIN"));

        if (!order.getUser().getId().equals(user.getId()) && !isAdmin) {
            throw new RuntimeException("Bạn không có quyền xóa đơn hàng này");
        }

        // Chỉ được xóa nếu đơn hàng chưa xử lý
        if (order.getOrderStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Chỉ có thể xóa đơn hàng đang chờ xử lý");
        }

        orderRepository.delete(order);
    }

}
