# Build stage
FROM gradle:7.6.1-jdk17 AS build
WORKDIR /app
COPY . .
# Skip tests during build
RUN gradle build -x test --no-daemon

# Run stage
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/build/libs/pawnShop-0.0.1-SNAPSHOT.jar /app/app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar", "--server.port=$PORT"]