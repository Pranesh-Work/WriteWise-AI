# Simple Banking Application

A lightweight full-stack banking application built for an OOP academic assignment.

## Stack
- Backend: Java 8+ (`com.sun.net.httpserver.HttpServer`)
- Frontend: HTML5, CSS3, vanilla JavaScript
- Communication: REST-style JSON APIs
- Storage: In-memory `HashMap`
- No Spring Boot or external dependencies

## Run

### Windows
```bat
cd SimpleBankingApplication
run.bat
```

### Linux/macOS
```bash
cd SimpleBankingApplication
chmod +x run.sh
./run.sh
```

Then open:
http://localhost:8080

## Demo accounts
- SAV001 — Alice Johnson — Savings — ₹5000
- CHK001 — Bob Smith — Checking — ₹3000

## API
- `GET /api/accounts`
- `GET /api/accounts/{id}`
- `POST /api/accounts/{id}/deposit`
- `POST /api/accounts/{id}/withdraw`
- `GET /api/accounts/{id}/interest`

POST body:
```json
{"amount":500}
```

## OOP concepts
- Encapsulation: private fields + getters/setters
- Abstraction: abstract `Account`
- Inheritance: `SavingsAccount` and `CheckingAccount`
- Polymorphism: overridden `withdraw()` and `calculateInterest()`
