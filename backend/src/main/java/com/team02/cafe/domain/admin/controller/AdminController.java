package com.team02.cafe.domain.admin.controller;

import com.team02.cafe.global.common.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "AdminController", description = "관리자 API")
public class AdminController {

    private static final String ADMIN_EMAIL = "admin@cafe.com";

    @PostMapping("/login")
    @Operation(summary = "관리자 로그인")
    public RsData<Void> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        System.out.println("입력 이메일: [" + email + "]");

        if (email == null || !ADMIN_EMAIL.equals(email.trim())) {
            return RsData.of("403", "관리자 이메일이 아닙니다.");
        }

        return RsData.of("200", "관리자 로그인 성공");
    }
}
