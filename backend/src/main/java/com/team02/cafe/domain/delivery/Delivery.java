import com.back.backend.global.jpa.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity
@Getter
@NoArgsConstructor
public class Delivery {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "delivery_id")
    private Long id;

    private String address; // 배송지 주소

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;

    // 객체 생성
    public static Delivery createDelivery(String address) {
        Delivery delivery = new Delivery();
        delivery.address = address;
        delivery.status = DeliveryStatus.READY;
        return delivery;
    }

    // 상태 전송
    public void changeStatus(DeliveryStatus status) {
        this.status = status;
    }
}