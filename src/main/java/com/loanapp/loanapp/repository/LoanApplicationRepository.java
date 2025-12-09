package com.loanapp.loanapp.repository;

import com.loanapp.loanapp.model.LoanApplication;
import com.loanapp.loanapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {


    List<LoanApplication> findByUser(User user);

    List<LoanApplication> findByStatus(String status);

    List<LoanApplication> findByUserAndStatus(User user, String status);
}
