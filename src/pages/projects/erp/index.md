# Small Business ERP Project

Posting Date: 2022-05-19

---

![ERP Demo 1](/imgs/erpdemo1.webp)

{{anchor "intro"}}

This Small Business ERP was created for a small manufacturing business, [Molded Magnesium Products, LLC](http://mmpmg.com) The bulk of the project was completed and usable in a couple months. I continue to maintain and add features as needed. This application has been successfully deployed and used since the beginning of 2022.

![ERP Demo 2](/imgs/erpdemo2.webp)

---

{{anchor "features"}}

### Features

<div style="letter-spacing: 1px; line-height: 22px;">

- Dashboard
  - Open/Late Sales Orders
  - Open/Late Purchase Orders
  - Live Manufacturing Machine Statistics
  - Parts Tracking
- CRM Module
- Quoting Module
- Sales/RMA Modules
- Purchasing Module
- Production Module
- Maintenance Module
- Quality Module
- Move Document Management/Generation Modules
  - Shippers (To Suppliers)
  - Receivers (From Suppliers)
  - Delivery Notes (To Customer)
- Items needing Invoicing Report/Management
- A Novel, Rule Based, Perpetual Inventory System w/ FIFO & Stock Recs
- Parts (Pipeline) Tracking / Traceability
- [OwnCloud](https://owncloud.com) File Integration
- [OnlyOffice](https://www.onlyoffice.com/) Integration
  - Microsoft Office Compatibility
  - Docs, Spreadsheets, Presentations
- [JSReports](https://jsreport.net/) Integration
  - Custom Reports, PDF, HTML, CSV, Excel

</div>

---

{{anchor "techstack"}}

### Technology Stack

<div style="letter-spacing: 1px; line-height: 22px;">

- App Stack
  - Node.js / TypeScript
  - Next.js / React
  - Next Auth (to enable sign in with google/facebook)
  - CouchDB
  - PHP / MySQL (OwnCloud)
  - Handwritten CSS (No frontend libraries)
- Deployment Infrastructure
  - 2 Physical Servers
    - One Colocated in Detroit
    - One On Site at the manufacturing facility
    - Proxmox Installed on each physical server
    - Wireguard VPN protecting both.
  - Entirely Containerized (Docker & LXC) Deployment
    - Docker / Portainer installed on VM's
    - CouchDB LXC installed directly onto Server
  - 2 Replicated Deployments
    - Zero Downtime Maintenance and Failover
    - Active-Active 2 way Sync
    - DB sync is practically instant
    - File sync is near instant thanks to [mirror](https://github.com/stephenh/mirror)
      - But owncloud refresh is delayed by 15 minute cron scan
  - 1 Deployment Live in Cloud (accessible through Wireguard VPN)
  - 1 Deployment Available On and Offline on Premises
  - Network Failures are assumed and sync resumes upon restoration.

</div>

---

{{anchor "cost-analysis"}}

### Cost Analysis

#### Server Costs

Each Server Runs $75/mo \* 2 = $150/mo

Each Server has atleast

- 12 Cores
- 32GB Ram
- 500GB NVME
- 2TB HDD
- 300 Mbps Public Network

Comparable AWS Servers at these Specs: ~ $1500/mo

90% Savings in monthly server costs.

#### Software Costs

Software Includes:

- CRM
- Sales
- Manufacturing
- Purchasing
- Quality
- Maintenance
- Documents
- Unlimited Users

Costs:

- $0 recurring/monthly
- Estimated $20,000 Cost to Build

Comparable [Odoo](https://odoo.com/pricing) Software Package (10 Users): $600/mo

#### ROI Calculation

- Estimated Up Front Cost: $20,000
- Estimate Yearly Cost: $1800
- Estimated Total First Year: $21,800

Compared to ONGOING Every Year:

- Estimated Yearly Cost AWS & Odoo: $25,200

**ROI: Less than 1 year**

---

{{anchor "sales-pitch"}}

### Sales Pitch

Like what you see? This application could be customized to your exact needs!

Are you looking for someone who can do this for your company?

[Contact Me](/contact)
