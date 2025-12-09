package com.loanapp.loanapp.controller.loan;

import com.loanapp.loanapp.dto.UserDTO;
import com.loanapp.loanapp.model.User;
import com.loanapp.loanapp.mapper.UserMapper;
import com.loanapp.loanapp.service.JwtService;
import com.loanapp.loanapp.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/client")
public class ProfileController {

    private final UserService userService;
    private final JwtService jwtService;

    public ProfileController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        String token = extractToken(request);
        if (token == null) return ResponseEntity.status(401).body("Unauthorized");

        String username = jwtService.extractUsername(token);
        User user = userService.findByUsername(username);
        if (user == null) return ResponseEntity.status(404).body("User not found");

        UserDTO userDto = UserMapper.toDTO(user); // your existing DTO mapping without lastLoginTime

        // Build a custom response with DTO + extra field
        Map<String, Object> response = new HashMap<>();
        response.put("user", userDto);
        response.put("lastLoginTime", user.getLoginTime()); // include the extra field here

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedUser, HttpServletRequest request) {
        String token = extractToken(request);
        if (token == null) return ResponseEntity.status(401).body("Unauthorized");

        String username = jwtService.extractUsername(token);
        User user = userService.findByUsername(username);
        if (user == null) return ResponseEntity.status(404).body("User not found");

        // Delegate the logic to service
        User savedUser = userService.updateProfile(user, updatedUser);
        return ResponseEntity.ok(savedUser);
    }

    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String loginTimeStr = body.get("loginTime");
        if (loginTimeStr == null) {
            return ResponseEntity.badRequest().body("Missing loginTime");
        }

        try {
            // Convert ISO string to LocalDateTime
            Instant instant = Instant.parse(loginTimeStr);
            LocalDateTime loginTime = instant.atZone(ZoneId.of("Europe/Tirane")).toLocalDateTime();

            // Extract username from JWT
            String token = request.getHeader("Authorization");
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            String jwt = token.substring(7);
            String username = jwtService.extractUsername(jwt);

            User user = userService.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            user.setLoginTime(loginTime);
            userService.save(user);

            return ResponseEntity.ok("Logout time saved");
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body("Invalid login time format.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error saving logout time.");
        }
    }
}