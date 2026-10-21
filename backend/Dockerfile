FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Add curl for healthcheck
RUN apk add --no-cache curl

COPY target/vanseva-backend-1.0.0.jar app.jar

EXPOSE 8081

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8081/actuator/health || exit 1

ENTRYPOINT ["java", "-XX:+UseG1GC", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
