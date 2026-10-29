# PropCare MVP

PropCare is a frontend-first property rental + management MVP for Chennai residential rentals.

## Included

- Public marketing website
- Property discovery, filters and property details
- Rental request flow
- Tenant dashboard
- Owner dashboard
- PropCare admin/operations dashboard
- Rent and owner payout calculations
- Utility bills and usage charts
- Maintenance/service request workflow
- Property inspection records
- Notifications
- Demo authentication
- Mock rent payment flow
- Local persistence for newly created rental/service requests
- Responsive desktop/tablet/mobile UI

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Tenant | tenant@propcare.demo | demo123 |
| Owner | owner@propcare.demo | demo123 |
| Admin | admin@propcare.demo | admin123 |

## Run locally

Requirements: Node.js 18+ recommended.

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Production build

```bash
npm run build
npm run preview
```

## Architecture notes

This MVP intentionally uses a clean mock data/service layer in `src/data.js` plus browser `localStorage` for newly submitted rental requests and service requests.

Replace that layer with a real REST API later. The main production TODOs are:

- Real authentication + RBAC
- Backend authorization
- Database
- Real payment/UPI gateway
- File/object storage for property and service images
- SMS/WhatsApp/email notifications
- Maps
- KYC and digital agreements
- Audit logs
- Production validation and rate limiting

The management fee is represented as a configurable concept in the UI and examples use 5% demo data; it should be stored per owner/property agreement in a real backend rather than hardcoded.

All property, person, payment, bill and inspection information in this project is demo data.
