package com.team02.cafe.domain.product.controller;

import com.team02.cafe.domain.product.dto.ProductRequest;
import com.team02.cafe.domain.product.dto.ProductResponse;
import com.team02.cafe.domain.product.service.ProductService;
import com.team02.cafe.global.common.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
@Tag(name = "ProductController", description = "상품 API")
public class ProductController {

    private final ProductService productService;
    private static final String ADMIN_EMAIL = "admin@cafe.com"; //관리자 이메일 (하드코딩)

    private void validateAdmin(String email) {
        if (!ADMIN_EMAIL.equals(email)) {
            throw new IllegalArgumentException("관리자만 접근 가능합니다.");
        }
    }

    // 전체 조회
    @GetMapping
    @Operation(summary = "상품 목록 조회")
    public RsData<List<ProductResponse>> getProducts() {
        List<ProductResponse> response = productService.getProducts().stream()
                .map(ProductResponse::new)
                .toList();
        return RsData.of("200", "상품 목록 조회 완료", response);
    }

    // 등록
    @PostMapping
    @Operation(summary = "상품 등록")
    public RsData<ProductResponse> createProduct(
            @RequestHeader("Admin-Email") String email,
            @RequestBody ProductRequest request) {
        validateAdmin(email);
        ProductResponse response = new ProductResponse(
                productService.createProduct(
                        request.getName(),
                        request.getPrice(),
                        request.getQuantity()
                )
        );
        return RsData.of("200", "상품 등록 완료", response);
    }

    // 수정
    @PutMapping("/{id}")
    @Operation(summary = "상품 수정")
    public RsData<ProductResponse> updateProduct(
            @RequestHeader("Admin-Email") String email,
            @PathVariable Long id,
            @RequestBody ProductRequest request) {
        validateAdmin(email);
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
    @Operation(summary = "상품 삭제")
    public RsData<Void> deleteProduct(
            @RequestHeader("Admin-Email") String email,
            @PathVariable Long id) {
        validateAdmin(email);
        productService.deleteProduct(id);
        return RsData.of("200", "상품 삭제 완료");
    }
}
