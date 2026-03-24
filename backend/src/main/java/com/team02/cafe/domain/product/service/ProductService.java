package com.team02.cafe.domain.product.service;

import com.team02.cafe.domain.product.entity.Product;
import com.team02.cafe.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    // 전체 조회
    @Transactional(readOnly = true)
    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    // 단건 조회
    @Transactional(readOnly = true)
    public Product getProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. id: " + id));
    }

    // 등록
    public Product createProduct(String name, Long price, Long quantity) {
        Product product = new Product(name, price, quantity, "default.png");
        return productRepository.save(product);
    }

    // 수정
    public Product updateProduct(Long id, String name, Long price, Long quantity, String imageUrl) {
        Product product = getProduct(id);

        product.update(
                name,
                price,
                quantity,
                imageUrl != null ? imageUrl : product.getImageUrl()
        );

        return product;
    }

    // 삭제
    public void deleteProduct(Long id) {
        Product product = getProduct(id);
        productRepository.delete(product);
    }

    // 재고 차감(동시성 제어)
    public void decreaseQuantity(Long productId, Long quantity) {
        Product product = productRepository.findByIdWithLock(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. id: " + productId));
        product.decreaseQuantity(quantity);
    }

    // 재고 복구
    public void increaseQuantity(Long productId, Long quantity) {
        Product product = getProduct(productId);
        product.increaseQuantity(quantity);
    }
}
