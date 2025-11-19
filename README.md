# Lead Manager Pro

A comprehensive lead tracking and billing platform designed for Fixfindr to manage incoming customer leads for multiple service businesses.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## Dashboard Screenshot

![Lead Manager Pro Dashboard](https://raw.githubusercontent.com/theolecuyer/lead-manager-pro/main/docs/screenshots/hero.jpeg)

_Lead Manager Pro Dashboard - Real-time lead tracking and client management_

## Table of Contents

-   [Overview](#overview)
-   [Features](#features)
-   [Architecture](#architecture)
-   [Tech Stack](#tech-stack)
-   [Screenshots](#screenshots)

## Overview

Lead Manager Pro is a lead tracking and billing platform built for Fixfindr to manage incoming customer leads for multiple service businesses. The platform automates lead tracking, client billing, credit management, and performance reporting to ensure every lead is properly accounted for and billed.

### How It Works

1. **Lead Tracking**: Captures and records customer leads from multiple sources (ads, landing pages, forms, call centers) as they're distributed to client businesses
2. **Lead Accountability**: Tracks which client received each lead with complete audit trails
3. **Automated Billing**: Monitors lead delivery and manages per-lead billing with credit balance tracking
4. **Dispute Resolution**: Handles refunds, credits, and adjustments with complete documentation
5. **Performance Reporting**: Generates automated daily reports across all clients and operations

### Key Benefits

-   ✅ Complete lead tracking and accountability
-   ✅ Real-time billing and payment processing via EasyPay Direct
-   ✅ Transparent credit management system
-   ✅ Complete audit trail for all transactions
-   ✅ Multi-client management dashboard
-   ✅ Automated daily performance reports

## Features

### Lead Tracking & Management

-   Real-time lead capture and recording
-   Track lead assignments to clients
-   Comprehensive lead history tracking
-   Lead status monitoring
-   Duplicate detection

### Billing & Credits

-   Per-lead billing automation
-   Credit balance tracking
-   Refund and adjustment handling
-   Payment processing integration
-   Prepaid credit system
-   Billing accuracy verification

### Client Management

-   Multi-client dashboard
-   Individual client performance tracking
-   Credit balance monitoring
-   Lead distribution analytics
-   Client-specific reporting

### Reporting & Analytics

-   Automated daily performance reports (via scheduled cron jobs)
-   Revenue tracking and forecasting
-   Lead volume metrics
-   Credit/refund summaries
-   Client performance comparisons

### Audit & Compliance

-   Complete transaction logging
-   User action tracking
-   Change history with timestamps
-   Dispute documentation
-   Automated audit trails

## Architecture

![System Architecture](https://raw.githubusercontent.com/theolecuyer/lead-manager-pro/main/docs/screenshots/lead_manager_pro_architecture.png)

_System Architecture Diagram_

### Integration Flow

1. **Slack Integration**: Slack App receives lead notifications and sends inbound webhook requests to Supabase Edge Functions for tracking
2. **API Layer**: Supabase Edge Functions handle all business logic, and data processing
3. **Database**: PostgreSQL database with custom database functions stores leads, clients, transactions, and audit logs
4. **Automation**: Scheduled cron jobs generate daily reports and perform maintenance tasks
5. **Frontend**: Next.js application provides real-time dashboard and management interface
6. **Payment Processing**: EasyPay Direct API integration handles billing and payment processing
7. **Email Notifications**: Resend SMTP for transactional emails and report delivery

## Tech Stack

### Frontend

-   **Framework**: Next.js 15.5.4 (with Turbopack)
-   **UI Library**: React 19.1.0
-   **Language**: TypeScript 5.x
-   **Styling**: Tailwind CSS 4.x
-   **UI Components**: Hero UI 2.8.4
-   **Icons**: Heroicons 2.2.0
-   **Hosting**: AWS Amplify

### Backend

-   **Database**: PostgreSQL (Supabase)
-   **API**: Supabase Edge Functions
-   **Authentication**: Supabase Auth
-   **Database Functions**: Custom PostgreSQL functions
-   **Scheduled Jobs**: Supabase Cron Jobs

### External Integrations

-   **Slack API**: Webhook-based lead notifications via Slack App inbound requests
-   **Payment Gateway**: EasyPay Direct API
-   **Email Service**: Resend SMTP for report and transaction emails

### Development Tools

-   **Linting**: ESLint 9.x
-   **Type Checking**: TypeScript
-   **Database CLI**: Supabase CLI 2.48.3

## Screenshots

### Login Page

![Login Page](https://raw.githubusercontent.com/theolecuyer/lead-manager-pro/main/docs/screenshots/login.jpeg)

_Secure authentication with Supabase Auth_

### Clients List

![Clients Management](https://raw.githubusercontent.com/theolecuyer/lead-manager-pro/main/docs/screenshots/clients.jpeg)

_Manage all client accounts and credit balances_

### Client Detail

![Client Detail View](https://raw.githubusercontent.com/theolecuyer/lead-manager-pro/main/docs/screenshots/client-detail.jpeg)

_Individual client performance and lead history_

### Reports Overview

![Reports Dashboard](https://raw.githubusercontent.com/theolecuyer/lead-manager-pro/main/docs/screenshots/reports.jpeg)

_Automated daily performance reports_

### Report Detail

![Report Detail View](https://raw.githubusercontent.com/theolecuyer/lead-manager-pro/main/docs/screenshots/report-detail.jpeg)

_Detailed breakdown of daily operations_

### Settings

![Settings Page](https://raw.githubusercontent.com/theolecuyer/lead-manager-pro/main/docs/screenshots/settings.jpeg)

_System configuration and user preferences_

## License

This project is licensed under the MIT License. Feel free to use this code for learning and reference.

Built as a lead management and billing platform for real-world business operations.

## Contact

For inquiries, email theo@clickroot.biz

---

Theo Lecuyer | Updated 11.14.25
