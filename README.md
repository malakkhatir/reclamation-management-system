<h1 align="center">📋 Reclamation Management System</h1>

<p align="center">
  Plateforme de gestion des réclamations clients pour boutique en ligne<br>
  <b>Spring Boot (backend) · Angular 18 (frontend) · MySQL</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white" alt="Spring Security">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/Angular_18-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/SCSS-C6538C?style=for-the-badge&logo=sass&logoColor=white" alt="SCSS">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white" alt="Maven">
</p>

---

## 📌 Présentation

Plateforme **full-stack** de gestion des réclamations clients pour une boutique e-commerce.  
Deux types d'utilisateurs :

- 🧑 **Client** : crée et suit l'état de ses réclamations
- 🧑‍💼 **Agent** : traite les réclamations et change leur statut

Workflow : **Nouveau → En cours → Résolu**

---

## 🏗️ Architecture

```text
┌────────────────────────┐
│   Frontend Angular 18  │
│   localhost:4200       │
└───────────┬────────────┘
            │  HTTP / JSON + JWT
            ▼
┌────────────────────────┐
│   Backend Spring Boot  │
│   localhost:8080       │
│   /api/...             │
└───────────┬────────────┘
            │  JPA / Hibernate
            ▼
┌────────────────────────┐
│        MySQL           │
│   reclamations_db      │
└────────────────────────┘
```

---

## 📁 Structure du projet

```text
gestion-reclamations/
│
├── backend/                                       # Backend Spring Boot
│   └── src/main/java/com/example/reclamationapi/
│       ├── config/
│       │   └── CorsConfig.java
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── DashboardController.java
│       │   └── ReclamationController.java
│       ├── dto/
│       │   ├── DashboardStats.java
│       │   ├── JwtResponse.java
│       │   ├── LoginRequest.java
│       │   ├── ReclamationRequest.java
│       │   ├── ReclamationResponse.java
│       │   └── RegisterRequest.java
│       ├── model/
│       │   ├── Priorite.java              (enum)
│       │   ├── Reclamation.java
│       │   ├── Role.java                  (enum)
│       │   ├── StatutReclamation.java     (enum)
│       │   └── User.java
│       ├── repository/
│       │   ├── ReclamationRepository.java
│       │   └── UserRepository.java
│       ├── security/
│       │   ├── CustomUserDetailsService.java
│       │   ├── JwtAuthenticationFilter.java
│       │   ├── JwtService.java
│       │   └── SecurityConfig.java
│       ├── service/
│       │   └── ...
│       └── ReclamationApiApplication.java
│
├── reclamation-frontend/                          # Frontend Angular 18
│   └── src/app/
│       ├── core/
│       ├── guards/
│       ├── models/
│       │   └── claim.model.ts
│       ├── pages/
│       │   ├── agent/
│       │   │   ├── claim-detail/
│       │   │   ├── claim-list/
│       │   │   └── dashboard/
│       │   ├── client/
│       │   │   ├── claim-detail/
│       │   │   ├── claim-form/
│       │   │   ├── claim-list/
│       │   │   └── dashboard/
│       │   ├── login/
│       │   └── register/
│       └── services/
│
├── gestion-reclamations.iml
└── README.md
```

---

## ✨ Fonctionnalités

### 🧑 Espace Client
- 🔐 Inscription / Connexion (JWT)
- ➕ Créer une réclamation (`claim-form`)
- 📋 Suivre ses réclamations (`claim-list`)
- 🔍 Voir le détail (`claim-detail`)
- 📊 Dashboard client

### 🧑‍💼 Espace Agent
- 🔐 Connexion sécurisée
- 📋 Voir toutes les réclamations (`claim-list`)
- 🔍 Filtrer par statut / priorité
- ✏️ Traiter une réclamation (`claim-detail`)
- 📊 Dashboard agent (statistiques)

### 🎯 Fonctionnalités transverses
- 🎨 Interface **responsive** (SCSS)
- 🔒 Authentification **JWT** stateless
- 🛡️ **Guards** Angular (`auth.guard`, `role.guard`)
- 🔔 Notifications utilisateur
- 🔄 **HTTP Interceptor** pour injecter le token

---

## 🧰 Stack technique

### Backend
- **Java 17+**
- **Spring Boot 3.x**
- **Spring Web** — REST API
- **Spring Data JPA** — Persistance
- **Spring Security** — Auth & autorisation
- **JWT** — Token stateless
- **Hibernate** — ORM
- **MySQL 8** — Base de données
- **Maven** — Build
- **Lombok** — Boilerplate

### Frontend
- **Angular 18**
- **TypeScript**
- **SCSS**
- **RxJS**
- **Angular Router**
- **Guards** : `auth`, `role`
- **HTTP Interceptor** : injection JWT

---

## 🚀 Installation & Lancement

### Prérequis

| Outil | Version |
|-------|---------|
| Java JDK | 17+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| Angular CLI | 18+ |
| MySQL | 8.0+ |

### 1️⃣ Base de données MySQL

```sql
CREATE DATABASE reclamations_db;
```

### 2️⃣ Backend Spring Boot

**Config** — `backend/src/main/resources/application.properties` :

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/reclamations_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Server
server.port=8080

# JWT
jwt.secret=maCleSecreteSuperLongueEtTresSecurisee123456789
jwt.expiration=86400000
```

**Lancer** :

```bash
cd backend
mvn spring-boot:run
```

→ API sur `http://localhost:8080`

### 3️⃣ Frontend Angular

```bash
cd reclamation-frontend
npm install
ng serve
```

→ UI sur `http://localhost:4200`

---

## 🔌 API REST — Endpoints

### 🔑 Authentification (`AuthController`)

| Méthode | Endpoint | Accès |
|---------|----------|-------|
| `POST` | `/api/auth/register` | Public |
| `POST` | `/api/auth/login` | Public |

### 📋 Réclamations (`ReclamationController`)

| Méthode | Endpoint | Rôle |
|---------|----------|------|
| `GET` | `/api/reclamations` | Agent |
| `GET` | `/api/reclamations/mes` | Client |
| `GET` | `/api/reclamations/{id}` | Client / Agent |
| `POST` | `/api/reclamations` | Client |
| `PUT` | `/api/reclamations/{id}` | Agent |
| `PUT` | `/api/reclamations/{id}/statut` | Agent |
| `DELETE` | `/api/reclamations/{id}` | Agent |

### 📊 Dashboard (`DashboardController`)

| Méthode | Endpoint | Rôle |
|---------|----------|------|
| `GET` | `/api/dashboard/stats` | Agent |

### DTOs

- `LoginRequest` / `RegisterRequest` → entrée Auth
- `JwtResponse` → réponse token
- `ReclamationRequest` / `ReclamationResponse` → entrée/sortie réclamations
- `DashboardStats` → statistiques

---

## 🗄️ Modèle de données

### `User`

| Champ | Type | Contraintes |
|-------|------|-------------|
| `id` | Long | PK, AUTO_INCREMENT |
| `username` | String | UNIQUE |
| `email` | String | UNIQUE |
| `password` | String | BCrypt |
| `role` | `Role` (enum) | `CLIENT` / `AGENT` |

### `Reclamation`

| Champ | Type | Contraintes |
|-------|------|-------------|
| `id` | Long | PK |
| `titre` | String | NOT NULL |
| `description` | Text | NOT NULL |
| `statut` | `StatutReclamation` | `NOUVEAU` / `EN_COURS` / `RESOLU` |
| `priorite` | `Priorite` | `BASSE` / `MOYENNE` / `HAUTE` |
| `client` | User | `@ManyToOne` |
| `agent` | User | `@ManyToOne` (nullable) |
| `dateCreation` | LocalDateTime | Auto |
| `dateMaj` | LocalDateTime | Auto |

### Enums

```java
public enum Role { CLIENT, AGENT }

public enum StatutReclamation { NOUVEAU, EN_COURS, RESOLU }

public enum Priorite { BASSE, MOYENNE, HAUTE }
```

---

## 🔐 Sécurité (JWT)

### Flux

1. Client/Agent s'authentifie → `POST /api/auth/login`
2. `AuthController` valide via `AuthenticationManager`
3. `JwtService` génère le token
4. Réponse : `JwtResponse` (token + infos user)
5. Frontend stocke dans `localStorage`
6. `JwtAuthenticationFilter` valide à chaque requête
7. `SecurityConfig` applique les règles d'accès

### Classes clés

| Classe | Rôle |
|--------|------|
| `SecurityConfig` | Config Spring Security + routes protégées |
| `JwtService` | Génération / validation des tokens |
| `JwtAuthenticationFilter` | Filtre exécuté à chaque requête |
| `CustomUserDetailsService` | Charge l'utilisateur depuis la BD |
| `CorsConfig` | Autorise `http://localhost:4200` |

---

## 🔄 Workflow

```text
   [Client crée]
        │
        ▼
   ┌──────────┐
   │ NOUVEAU  │
   └────┬─────┘
        │  Agent prend en charge
        ▼
   ┌──────────┐
   │ EN COURS │
   └────┬─────┘
        │  Agent résout
        ▼
   ┌──────────┐
   │  RÉSOLU  │
   └──────────┘
```

---

## 🧪 Scénarios de test

| # | Action | Résultat |
|---|--------|----------|
| 1 | S'inscrire comme client | Compte créé |
| 2 | Se connecter | JWT + redirection `/client/dashboard` |
| 3 | Créer une réclamation | Statut `NOUVEAU` |
| 4 | Agent se connecte | Redirection `/agent/dashboard` |
| 5 | Filtrer par statut | Liste filtrée |
| 6 | Changer statut → `EN_COURS` | Visible côté client |
| 7 | Agent répond | Client voit la réponse |
| 8 | Marquer `RESOLU` | Statut final |

---

## 🛣️ Améliorations possibles

- [ ] 📎 Upload de pièces jointes
- [ ] 📧 Notifications par email
- [ ] 💬 Messagerie temps réel (WebSocket)
- [ ] 📊 Graphiques (Chart.js / ngx-charts)
- [ ] 🌙 Mode sombre
- [ ] 📄 Pagination backend
- [ ] 🧪 Tests JUnit + Jasmine
- [ ] 🐳 Dockerisation
- [ ] 🔄 CI/CD GitHub Actions

---

## 📚 Ressources

- [Spring Boot](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [JWT.io](https://jwt.io)
- [Angular](https://angular.io/docs)

---

## 📄 Licence

Projet pédagogique — **Travaux Pratiques**. Libre d'utilisation à des fins éducatives.

---

## 👩‍💻 Auteure

**Malak Khatir**
