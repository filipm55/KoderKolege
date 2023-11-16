
# Container za izgradnju (build) aplikacije
FROM openjdk:17-alpine AS builder
WORKDIR /app
# Kopiranje izvornog koda u container
COPY .mvn .mvn
COPY mvnw .
COPY pom.xml .
RUN chmod +x mvnw

RUN ./mvnw dependancy:go-offline

COPY src src
# Pokretanje builda
RUN ./mvnw package

RUN /.cp target/*.jar app.jar
# Izlaganje porta
EXPOSE 8080

# Naredba kojom se pokrece aplikacija
ENTRYPOINT ["java","-jar","/app.jar"]