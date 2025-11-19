package com.dominik.crafthub.jwt.service;

import com.dominik.crafthub.jwt.config.JwtConfig;
import com.dominik.crafthub.jwt.entity.JwtEntity;
import com.dominik.crafthub.user.entity.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import java.util.Date;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class JwtService {
  private final JwtConfig jwtConfig;

  public JwtEntity generateAccessToken(UserEntity user) {
    return generateToken(user, jwtConfig.getAccessTokenExpiration());
  }

  public JwtEntity generateRefreshToken(UserEntity user) {
    return generateToken(user, jwtConfig.getRefreshTokenExpiraion());
  }

  private JwtEntity generateToken(UserEntity user, long tokenExpriation) {
    var claims =
        Jwts.claims()
            .subject(user.getId().toString())
            .add("email", user.getEmail())
            .add("role", user.getRole())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 1000 * tokenExpriation))
            .build();
    return new JwtEntity(claims, jwtConfig.getSecretKey());
  }

  public JwtEntity parseToken(String token) {
    try {
      var claims = getClaims(token);
      return new JwtEntity(claims, jwtConfig.getSecretKey());
    } catch (JwtException e) {
      return null;
    }
  }

  private Claims getClaims(String token) {
    return Jwts.parser()
        .verifyWith(jwtConfig.getSecretKey())
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }
}
