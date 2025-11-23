package com.dominik.crafthub.jwt.filters;

import com.dominik.crafthub.jwt.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
  private final JwtService jwtService;

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    String token = null;

    // 1. Try to get the token from the Cookie array
    if (request.getCookies() != null) {
      for (Cookie cookie : request.getCookies()) {
        if ("accessToken".equals(cookie.getName())) {
          token = cookie.getValue();
          break;
        }
      }
    }

    // 2. If no token is found, pass along the filter chain
    if (token == null) {
      filterChain.doFilter(request, response);
      return;
    }
    // 3. Validate the token
    var jwt = jwtService.parseToken(token);
    if (jwt == null || jwt.isExpired()) {
      filterChain.doFilter(request, response);
      return;
    }
    // 4. Set Context
    var authentication =
        new UsernamePasswordAuthenticationToken(
            jwt.getUserId(), null, List.of(new SimpleGrantedAuthority("ROLE_" + jwt.getRole())));
    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
    SecurityContextHolder.getContext().setAuthentication(authentication);
    filterChain.doFilter(request, response);
  }
}
