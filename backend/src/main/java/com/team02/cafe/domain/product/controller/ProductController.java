package com.team02.cafe.domain.product.controller;

import com.team02.cafe.domain.product.dto.ProductRequest;
import com.team02.cafe.domain.product.dto.ProductResponse;
import com.team02.cafe.domain.product.service.ProductService;
import com.team02.cafe.global.common.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    // 전체 조회
    @GetMapping
    public RsData<List<ProductResponse>> getProducts() {
        List<ProductResponse> response = productService.getProducts().stream()
                .map(ProductResponse::new)
                .toList();
        return RsData.of("200", "상품 목록 조회 완료", response);
    }

    // 등록
    @PostMapping
    public RsData<ProductResponse> createProduct(@RequestBody ProductRequest request) {
        ProductResponse response = new ProductResponse(
                productService.createProduct(
                        request.getName(),
                        request.getPrice(),
                        request.getQuantity(),
                        request.getImageUrl()
                )
        );
        return RsData.of("200", "상품 등록 완료", response);
    }

    // 수정
    @PutMapping("/{id}")
    public RsData<ProductResponse> updateProduct(@PathVariable Long id,
                                                 @RequestBody ProductRequest request) {
        ProductResponse response = new ProductResponse(
                productService.updateProduct(
                        id,
                        request.getName(),
                        request.getPrice(),
                        request.getQuantity(),
                        request.getImageUrl()
                )
        );
        return RsData.of("200", "상품 수정 완료", response);
    }

    // 삭제
    @DeleteMapping("/{id}")
    public RsData<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return RsData.of("200", "상품 삭제 완료");
    }
}