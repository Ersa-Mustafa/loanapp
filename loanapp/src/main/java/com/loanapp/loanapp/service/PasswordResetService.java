package com.loanapp.loanapp.service;

import com.loanapp.loanapp.model.PasswordResetCode;
import com.loanapp.loanapp.model.User;
import com.loanapp.loanapp.repository.PasswordResetCodeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PasswordResetService {

    private final PasswordResetCodeRepository resetCodeRepository;

    public PasswordResetService(PasswordResetCodeRepository resetCodeRepository) {
        this.resetCodeRepository = resetCodeRepository;
    }

    public void createResetCode(User user, String code, LocalDateTime expiry) {
        PasswordResetCode resetCode = new PasswordResetCode(user, code, expiry);
        resetCodeRepository.save(resetCode);
    }

    public PasswordResetCode getValidCode(String email, String code) {
        PasswordResetCode resetCode = resetCodeRepository.findByUserEmailAndCode(email, code);
        if (resetCode == null || resetCode.isUsed() || resetCode.getExpiryTime().isBefore(LocalDateTime.now())) {
            return null;
        }
        return resetCode;
    }

    public void markCodeAsUsed(PasswordResetCode code) {
        code.setUsed(true);
        resetCodeRepository.save(code);
    }
}
