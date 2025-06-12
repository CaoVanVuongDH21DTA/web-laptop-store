package com.cdweb.laptopStore.services;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import com.cdweb.laptopStore.entities.Order;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class PaymentIntentService {

    // Tỷ giá giả định: 1 USD = 25,000 VND
    private static final double EXCHANGE_RATE_VND_TO_USD = 25000.0;

    public Map<String, String> createPaymentIntent(Order order) throws StripeException {
        Map<String, String> metaData = new HashMap<>();
        metaData.put("orderId",order.getId().toString());

        metaData.put("original_amount_vnd", String.valueOf(order.getTotalAmount().longValue())); // lưu số tiền gốc theo VND

        // Convert từ VND sang USD cents (Stripe dùng cents, tức 1 USD = 100)
        long amountInUsdCents = convertVndToUsdCents(order.getTotalAmount().longValue());

        PaymentIntentCreateParams paymentIntentCreateParams= PaymentIntentCreateParams.builder()
                .setAmount(amountInUsdCents)
                .setCurrency("usd")
                .putAllMetadata(metaData)
                .setDescription("Thanh toán đơn hàng (tương đương " + order.getTotalAmount().longValue() + " VND)")
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build()
                )
                .build();
        PaymentIntent paymentIntent = PaymentIntent.create(paymentIntentCreateParams);
        Map<String, String> map = new HashMap<>();
        map.put("client_secret", paymentIntent.getClientSecret());
        return map;
    }

    private long convertVndToUsdCents(long vndAmount) {
        return Math.round((vndAmount / EXCHANGE_RATE_VND_TO_USD) * 100);
    }
}
