package com.dominik.crafthub.jwt.entity;

import com.dominik.crafthub.user.entity.UserRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.util.Date;
import javax.crypto.SecretKey;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class JwtEntity {
    private final Claims claims;
    private final SecretKey secretKey;

    public boolean isExpired() {
        return claims.getExpiration().before(new Date());
    }

    public Long getUserId() {
        return Long.valueOf(claims.getSubject());
    }

    public UserRole getRole() {
        return UserRole.valueOf(claims.get("role", String.class));
    }

    public String toString() {
        return Jwts.builder().claims(claims).signWith(secretKey).compact();
    }
}
