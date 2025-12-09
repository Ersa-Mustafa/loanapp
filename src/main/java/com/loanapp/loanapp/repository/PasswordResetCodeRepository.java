package com.loanapp.loanapp.repository;

import com.loanapp.loanapp.model.PasswordResetCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetCodeRepository extends JpaRepository<PasswordResetCode, Long> {
    PasswordResetCode findByUserEmailAndCode(String email, String code);
}