# NBE9-11-1-Team2

# ☕ Grids & Circles Coffee

## 📌 프로젝트 소개
Grids & Circles Coffee는 소규모 카페의 온라인 원두 패키지 주문 서비스입니다.  
고객은 웹사이트를 통해 원두를 주문하고, 관리자는 상품 및 주문을 관리할 수 있습니다.

## 👨‍👩‍👧‍👦 팀원 및 역할
| 이름 | 역할 |
|------|------|
| 안수빈 | 상품 CRUD, 재고 차감/복구, 동시성 제어 |
| 문서희 | 주문 생성, 배송일 계산 |
| 곽민우 | 주문 취소, 상태 관리 |
| 최민호 | 주문 조회 |
| 김강산 | 배송 관리 |

## 🚀 주요 기능
- 상품 목록 조회 (전체 공개)
- 상품 등록/수정/삭제 (관리자 전용)
- 주문 생성 및 취소
- 주문 목록/상세 조회
- 합배송 주문 조회
- 배송 생성 및 상태 관리
- 관리자 로그인
- 재고 차감/복구 (동시성 제어 적용)

## 🛠 기술 스택
### Backend
- Java 25
- Spring Boot
- Spring Data JPA
- H2 Database
- Swagger (SpringDoc OpenAPI)

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

### 협업 도구
- Git / GitHub
- Notion

## 🏗 아키텍처
```
NBE9-11-1-Team02/
├── backend/   # Spring Boot
└── frontend/  # Next.js
```

## 📡 API 문서
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

| 기능 | HTTP Method | URL | 접근 권한 |
|------|-------------|-----|----------|
| 상품 목록 조회 | GET | /api/products | 전체 |
| 상품 등록 | POST | /api/products | 관리자 |
| 상품 수정 | PUT | /api/products/{id} | 관리자 |
| 상품 삭제 | DELETE | /api/products/{id} | 관리자 |
| 주문 생성 | POST | /api/orders | 전체 |
| 주문 목록 조회 | GET | /api/orders | 사용자/관리자 |
| 주문 상세 조회 | GET | /api/orders/{orderId} | 사용자/관리자 |
| 주문 취소 | PATCH | /api/orders/{orderId}/cancel | 사용자 |
| 합배송 주문 조회 | GET | /api/orders/merged | 관리자 |
| 배송 생성 | POST | /api/delivery | 관리자 |
| 관리자 로그인 | POST | /api/admin/login | 전체 |

## 🔥 트러블슈팅
| 문제 | 해결 |
|------|------|
| 동시 주문 시 재고 마이너스 발생 | ProductRepository에 비관적 락(PESSIMISTIC_WRITE) 적용 |
| 프론트-백엔드 CORS 오류 | WebConfig에 CORS 설정 추가 |
| 응답 구조 불일치 | RsData 공통 응답 구조 도입 |

## 🤝 협업 방식
### Git 전략
- `main` : 최종 배포 브랜치
- `develop` : 통합 개발 브랜치
- `feature/*` : 기능 개발 브랜치

### 작업 흐름
1. develop에서 feature 브랜치 생성
2. 기능 개발
3. PR 생성 및 코드 리뷰
4. develop 브랜치에 merge

### 코드 리뷰
- PR 단위로 코드 리뷰 진행
- 기능별로 PR 분리

## ⚙️ 실행 방법
### Backend
```bash
cd backend
./gradlew bootRun
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### H2 Console
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (없음)

## ERD
