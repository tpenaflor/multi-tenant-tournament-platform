# 

Technical Architecture & MVP Requirements: Bracket Sports Platform

This document outlines the technical architecture, technology stack, and core logic components required to build the Minimum Viable Product (MVP) for the multi-tenant bracket sports website builder.

## **1\. Multi-Tenant Database Architecture**

The platform will utilize a **Shared Schema with Row Level Security (RLS)** to balance scalability with strict data isolation.

> * **Database:** PostgreSQL.  
> * **Data Isolation:** All tables will feature an organization\_id column. PostgreSQL RLS policies will be enforced at the database level to ensure queries only read/write data for the currently authenticated tenant context.  
> * **Context Injection:** A transaction-scoped configuration variable (e.g., app.current\_tenant\_id) will be set at the beginning of every request to govern the RLS policies.

## **2\. Core Technology Stack**

| Layer | Technology | Rationale   |
| :---- | :---- | :---- |
| **Frontend (App & Public Pages)** | Next.js (App Router), React | Exceptional support for Server-Side Rendering (SSR) and Static Site Generation (SSG), vital for public tournament page SEO and load performance. |
| **Backend API** | Next.js API Routes (or dedicated Node.js/NestJS) | Seamless integration with the frontend stack, capable of handling tournament data endpoints and webhooks. |
| **Database ORM** | Prisma or Drizzle ORM | Type-safe database interactions with streamlined schema migrations for PostgreSQL. |
| **Real-Time Updates** | WebSockets (Socket.io or Pusher) | Required for pushing live bracket score updates to spectator and player devices without manual refreshes. |

## **3\. Drag-and-Drop Builder Engine**

The visual page builder will eschew generating raw HTML in favor of a structured JSON representation mapped to React components.

> * **Component Library:** Leveraging dnd-kit or react-beautiful-dnd for accessible, high-performance drag-and-drop interactions.  
> * **Data Serialization:** Page layouts are stored in the database as a JSON array representing the component hierarchy and props.

>   `[`  
>     `{ "type": "HeroBanner", "props": { "title": "Summer Smash Pickleball" } },`  
>     `{ "type": "LiveBracketEmbed", "props": { "division_id": "div_8910" } }`  
>   `]`  
>           
> * **Dynamic Rendering:** The frontend application consumes this JSON and dynamically imports/renders the corresponding React components on the public-facing pages.

## **4\. Bracket Logic & Tournament Engine**

To accelerate MVP development and avoid the immense overhead of calculating edge cases (byes, dropouts, tie-breakers), the platform will integrate a headless open-source engine.

> * **Library Selection:** Implement a robust headless TypeScript/JavaScript library such as brackets-manager.js.  
> * **Architecture Flow:** The open-source engine handles the mathematical state machine (generating match dependencies, double-elimination routing), while the platform stores the generated state in the PostgreSQL database and renders it via custom React components.

## **5\. White-Labeling & Routing Infrastructure**

Providing custom domains for tournament organizers is a core value proposition.

> * **Next.js Middleware:** Request interception at the edge to examine the incoming host header.  
> * **Tenant Resolution:** The middleware rewrites requests from custom domains (e.g., www.atlantapickleball.com) to the internal routing structure (e.g., /\[tenant\_id\]/pages/...) seamlessly.