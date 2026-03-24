package com.team02.cafe.domain.order.service;

import com.team02.cafe.domain.order.dto.MergedOrderDto;
import com.team02.cafe.domain.order.dto.MergedProductDto;
import com.team02.cafe.domain.order.dto.OrderDetailResponseDto;
import com.team02.cafe.domain.order.dto.OrderRequest;
import com.team02.cafe.domain.order.dto.OrderResponse;
import com.team02.cafe.domain.order.dto.OrderResponseDto;
import com.team02.cafe.domain.order.entity.Order;
import com.team02.cafe.domain.order.entity.OrderStatus;
import com.team02.cafe.domain.order.repository.OrderRepository;
import com.team02.cafe.domain.orderproduct.dto.OrderProductRequest;
import com.team02.cafe.domain.orderproduct.entity.OrderProduct;
import com.team02.cafe.domain.orderproduct.repository.OrderProductRepository;
import com.team02.cafe.domain.product.entity.Product;
import com.team02.cafe.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderProductRepository orderProductRepository;

    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        Order order = new Order(
                request.email(),
                request.username(),
                request.address(),
                request.phoneNumber(),
                OrderStatus.READY,
                getDeliveryDate()
        );

        List<Long> productIds = new ArrayList<>();
        for(OrderProductRequest opReq : request.orderProductRequestList()) {
            productIds.add(opReq.productId());
        }
        List<Product> products = productRepository.findAllById(productIds);
        Map<Long, Product> productMap = products.stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        for(OrderProductRequest opReq : request.orderProductRequestList()) {
            Product product = productMap.get(opReq.productId());

            long quantity = opReq.orderQuantity();

            product.decreaseQuantity(quantity);
            order.addOrderProduct(product, quantity);
        }

        orderRepository.save(order);

        return new OrderResponse(order);
    }

    private LocalDate getDeliveryDate() {
        LocalDateTime now = LocalDateTime.now();

        if (now.toLocalTime().isBefore(LocalTime.of(14, 0))) {
            return LocalDate.now();
        } else {
            return LocalDate.now().plusDays(1);
        }
    }

    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문이 존재하지 않습니다."));

        if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("이미 취소된 주문입니다.");
        }

        if (order.getOrderStatus() == OrderStatus.COMPLETED) {
            throw new IllegalArgumentException("배송 완료된 주문은 취소할 수 없습니다.");
        }

        List<OrderProduct> orderProducts = orderProductRepository.findByOrderId(order.getId());

        for (OrderProduct orderProduct : orderProducts) {
            Product product = orderProduct.getProduct();
            product.increaseQuantity(orderProduct.getOrderQuantity());
        }

        order.changeStatus(OrderStatus.CANCELLED);
    }

    @Transactional
    public void updateOrderStatus(Long orderId, OrderStatus orderStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문이 존재하지 않습니다."));

        if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("취소된 주문은 상태를 변경할 수 없습니다.");
        }

        order.changeStatus(orderStatus);
    }

    @Transactional
    public void updateMergedOrderStatus(
            String email,
            String username,
            String address,
            OrderStatus orderStatus
    ) {
        LocalDateTime[] range = getCurrentDeliveryRange();
        LocalDateTime start = range[0];
        LocalDateTime end = range[1];

        List<Order> orders = orderRepository
                .findByCreatedAtBetweenAndOrderStatusNot(start, end, OrderStatus.CANCELLED)
                .stream()
                .filter(order ->
                        order.getEmail().equals(email) &&
                                order.getUsername().equals(username) &&
                                order.getAddress().equals(address)
                )
                .toList();

        if (orders.isEmpty()) {
            throw new IllegalArgumentException("합배송 대상 주문을 찾을 수 없습니다.");
        }

        for (Order order : orders) {
            order.changeStatus(orderStatus);
        }
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByEmail(String email) {
        return orderRepository.findByEmail(email).stream()
                .map(OrderResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDetailResponseDto getOrderDetails(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));
        return new OrderDetailResponseDto(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .sorted((o1, o2) -> o1.getId().compareTo(o2.getId()))
                .map(OrderResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MergedOrderDto> getMergedOrdersForDelivery() {
        LocalDateTime[] range = getCurrentDeliveryRange();
        LocalDateTime start = range[0];
        LocalDateTime end = range[1];

        List<Order> targetOrders =
                orderRepository.findByCreatedAtBetweenAndOrderStatusNot(start, end, OrderStatus.CANCELLED);

        // 이메일 + 이름 + 주소 기준으로 그룹화
        Map<String, List<Order>> groupedOrders = targetOrders.stream()
                .collect(Collectors.groupingBy(order ->
                        order.getEmail() + "|" + order.getUsername() + "|" + order.getAddress()
                ));

        return groupedOrders.values().stream().map(orders -> {
            Order firstOrder = orders.get(0);

            Long orderId = orders.stream()
                    .map(Order::getId)
                    .min(Long::compareTo)
                    .orElse(null);

            String email = firstOrder.getEmail();
            String username = firstOrder.getUsername();
            String address = firstOrder.getAddress();
            String phoneNumber = firstOrder.getPhoneNumber();
            LocalDate deliveryDate = firstOrder.getDeliveryDate();
            OrderStatus orderStatus = firstOrder.getOrderStatus();

            long totalMergedPrice = orders.stream()
                    .mapToLong(Order::getTotalPrice)
                    .sum();

            Map<String, MergedProductDto> productMap = new HashMap<>();

            for (Order order : orders) {
                for (OrderProduct op : order.getOrderProducts()) {
                    String productName = op.getProduct().getName();
                    long quantity = op.getOrderQuantity();
                    long totalPrice = op.getOrderPrice();

                    productMap.merge(
                            productName,
                            new MergedProductDto(productName, quantity, totalPrice),
                            (existing, newOne) -> new MergedProductDto(
                                    productName,
                                    existing.getQuantity() + newOne.getQuantity(),
                                    existing.getTotalPrice() + newOne.getTotalPrice()
                            )
                    );
                }
            }

            return new MergedOrderDto(
                    orderId,
                    email,
                    username,
                    address,
                    phoneNumber,
                    totalMergedPrice,
                    deliveryDate,
                    orderStatus,
                    new ArrayList<>(productMap.values())
            );
        }).collect(Collectors.toList());
    }

    private LocalDateTime[] getCurrentDeliveryRange() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start;
        LocalDateTime end;

        if (now.toLocalTime().isBefore(LocalTime.of(14, 0))) {
            start = LocalDateTime.of(now.toLocalDate().minusDays(1), LocalTime.of(14, 0));
            end = LocalDateTime.of(now.toLocalDate(), LocalTime.of(14, 0));
        } else {
            start = LocalDateTime.of(now.toLocalDate(), LocalTime.of(14, 0));
            end = LocalDateTime.of(now.toLocalDate().plusDays(1), LocalTime.of(14, 0));
        }

        return new LocalDateTime[]{start, end};
    }
}
