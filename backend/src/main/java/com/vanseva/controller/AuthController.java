package com.vanseva.controller;

import com.vanseva.dto.ApiResponse;
import com.vanseva.dto.AuthRequest;
import com.vanseva.dto.AuthResponse;
import com.vanseva.dto.RegisterRequest;
import com.vanseva.entity.Membership;
import com.vanseva.entity.User;
import com.vanseva.repository.MembershipRepository;
import com.vanseva.repository.UserRepository;
import com.vanseva.security.LoginAttemptService;
import com.vanseva.service.AuditService;
import com.vanseva.service.MembershipService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;
    private final MembershipService membershipService;
    private final LoginAttemptService loginAttemptService;
    private final AuditService auditService;

    public AuthController(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          MembershipRepository membershipRepository,
                          MembershipService membershipService,
                          LoginAttemptService loginAttemptService,
                          AuditService auditService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
        this.membershipService = membershipService;
        this.loginAttemptService = loginAttemptService;
        this.auditService = auditService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request,
                                                           HttpServletRequest httpRequest) {
        String clientIp = httpRequest.getRemoteAddr();
        String throttleKey = clientIp + ":" + request.getUsername();

        if (loginAttemptService.isBlocked(throttleKey)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(ApiResponse.error("Too many failed attempts. Account login is temporarily locked for 15 minutes."));
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername().trim(), request.getPassword())
            );

            SecurityContext securityContext = SecurityContextHolder.getContext();
            securityContext.setAuthentication(authentication);

            // Establish secure session
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);

            loginAttemptService.loginSucceeded(throttleKey);

            User user = userRepository.findByUsername(request.getUsername().trim())
                    .or(() -> userRepository.findByEmail(request.getUsername().trim()))
                    .orElseThrow();

            AuthResponse response = new AuthResponse(
                    user.getId(), user.getUsername(), user.getEmail(),
                    user.getFullName(), user.getRole(), "Login successful"
            );

            membershipRepository.findByUserId(user.getId()).ifPresent(m -> {
                response.setMembershipNumber(m.getMembershipNumber());
            });

            auditService.record("USER_LOGIN", "User logged in successfully: " + user.getUsername(),
                    user.getId(), user.getEmail(), clientIp, "User", user.getId());

            return ResponseEntity.ok(ApiResponse.ok("Login successful", response));

        } catch (BadCredentialsException e) {
            loginAttemptService.loginFailed(throttleKey);
            auditService.record("LOGIN_FAILED", "Failed login attempt for: " + request.getUsername(),
                    null, request.getUsername(), clientIp, "User", null);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid username or password."));
        }
    }

    @PostMapping(value = "/register", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @ModelAttribute RegisterRequest request,
            @RequestPart(value = "profilePhoto", required = false) MultipartFile profilePhoto,
            HttpServletRequest httpRequest) {

        String clientIp = httpRequest.getRemoteAddr();
        Membership membership = membershipService.registerMember(request, profilePhoto, clientIp);
        User user = membership.getUser();

        // Auto authenticate session
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getUsername(), null,
                java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority(user.getRole()))
        );
        SecurityContext securityContext = SecurityContextHolder.getContext();
        securityContext.setAuthentication(authentication);
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);

        AuthResponse response = new AuthResponse(
                user.getId(), user.getUsername(), user.getEmail(),
                user.getFullName(), user.getRole(), "Registration successful! Welcome to Vanseva."
        );
        response.setMembershipNumber(membership.getMembershipNumber());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Welcome to Vanseva! Membership registered successfully.", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User session valid but user not found in DB"));

        AuthResponse response = new AuthResponse(
                user.getId(), user.getUsername(), user.getEmail(),
                user.getFullName(), user.getRole(), "Authenticated"
        );

        membershipRepository.findByUserId(user.getId()).ifPresent(m -> {
            response.setMembershipNumber(m.getMembershipNumber());
        });

        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
