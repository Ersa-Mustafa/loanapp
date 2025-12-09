package com.loanapp.loanapp.controller.loan;

import com.loanapp.loanapp.dto.CreateLoanApplicationDTO;
import com.loanapp.loanapp.dto.LoanApplicationDTO;
import com.loanapp.loanapp.mapper.LoanMapper;
import com.loanapp.loanapp.model.LoanApplication;
import com.loanapp.loanapp.model.User;
import com.loanapp.loanapp.service.JwtService;
import com.loanapp.loanapp.service.LoanService;
import com.loanapp.loanapp.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/client")
public class ClientController {

    private final LoanService loanService;
    private final UserService userService;
    private final JwtService jwtService;

    public ClientController(LoanService loanService, UserService userService, JwtService jwtService) {
        this.loanService = loanService;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    private String extractUsernameFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        return jwtService.extractUsername(authHeader.substring(7));
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyForLoan(@RequestBody CreateLoanApplicationDTO dto, HttpServletRequest request) {
        String username = extractUsernameFromRequest(request);
        if (username == null) return ResponseEntity.status(401).body("Missing or invalid token");

        User user = userService.findByUsername(username);
        if (user == null) return ResponseEntity.badRequest().body("User not found");

        LoanApplication application = LoanMapper.toEntity(dto, user);
        LoanApplication saved = loanService.save(application);
        return ResponseEntity.ok(saved.getId());
    }

    @GetMapping("/loans")
    public ResponseEntity<?> getUserLoans(HttpServletRequest request) {
        String username = extractUsernameFromRequest(request);
        if (username == null) return ResponseEntity.status(401).body("Missing or invalid token");

        User user = userService.findByUsername(username);
        List<LoanApplication> loans = loanService.getLoansByUser(user);

        List<LoanApplicationDTO> sortedLoanDTOs = loans.stream()
                .sorted(Comparator.comparing(LoanApplication::getId).reversed())
                .map(LoanMapper::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(sortedLoanDTOs);
    }

    @GetMapping("/loans/{id}")
    public ResponseEntity<?> getLoanDetails(@PathVariable Long id, HttpServletRequest request) {
        String username = extractUsernameFromRequest(request);
        if (username == null) return ResponseEntity.status(401).body("Missing or invalid token");

        LoanApplication loan = loanService.getLoanById(id);
        if (!loan.getUser().getUsername().equals(username)) {
            return ResponseEntity.status(403).body("Unauthorized");
        }
        return ResponseEntity.ok(LoanMapper.toDTO(loan));
    }

    @DeleteMapping("/loans/{id}")
    public ResponseEntity<?> deleteLoan(@PathVariable Long id, HttpServletRequest request) {
        String username = extractUsernameFromRequest(request);
        if (username == null) return ResponseEntity.status(401).body("Missing or invalid token");

        LoanApplication loan = loanService.getLoanById(id);
        if (!loan.getUser().getUsername().equals(username) || !loan.getStatus().equals("Applied")) {
            return ResponseEntity.status(403).body("Cannot delete this loan");
        }
        loanService.delete(id);
        return ResponseEntity.ok("Deleted");
    }

    @PutMapping("/loans/{id}")
    public ResponseEntity<?> updateLoan(@PathVariable Long id,
                                        @RequestBody CreateLoanApplicationDTO dto,
                                        HttpServletRequest request) {
        String username = extractUsernameFromRequest(request);
        if (username == null) return ResponseEntity.status(401).body("Missing or invalid token");

        LoanApplication loan = loanService.getLoanById(id);
        if (!loan.getUser().getUsername().equals(username) || !loan.getStatus().equals("Applied")) {
            return ResponseEntity.status(403).body("Cannot update this loan");
        }

        loanService.updateLoan(id, dto);
        return ResponseEntity.ok("Updated");
    }
}