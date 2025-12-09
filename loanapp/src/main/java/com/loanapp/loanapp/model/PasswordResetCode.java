package com.loanapp.loanapp.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class PasswordResetCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User user;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private LocalDateTime expiryTime;

    private boolean used = false;

    public PasswordResetCode() {}

    public PasswordResetCode(User user, String code, LocalDateTime expiryTime) {
        this.user = user;
        this.code = code;
        this.expiryTime = expiryTime;
        this.used = false;
    }
}


