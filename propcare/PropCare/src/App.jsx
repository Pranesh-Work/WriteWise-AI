import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight, Bell, Building2, CalendarDays, CheckCircle2, ChevronRight, CircleDollarSign,
  ClipboardCheck, ClipboardList, Clock3, CreditCard, Droplets, FileText, Home, KeyRound,
  LayoutDashboard, LogIn, Menu, MessageSquare, MoreHorizontal, PackageCheck, Plus, Search,
  Settings, ShieldCheck, SlidersHorizontal, Sparkles, UserRound, Users, WalletCards, Wrench,
  X, Zap, LogOut, House, MapPin, BedDouble, Bath, Ruler, Check, AlertTriangle, Info
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import {
  properties, tenants, owners, rentalRequests, serviceRequests, bills, payments, inspections,
  notifications, incomeData, usageData
} from "./data";

const money = n => `₹${Number(n).toLocaleString("en-IN")}`;
const propertyById = id => properties.find(p => p.id === id);
const currentTenant = tenants[0];

function useDemoStore() {
  const [requests, setRequests] = useState(() => JSON.parse(localStorage.getItem("propcare_requests") || "null") || rentalRequests);
  const [services, setServices] = useState(() => JSON.parse(localStorage.getItem("propcare_services") || "null") || serviceRequests);
  useEffect(() => localStorage.setItem("propcare_requests", JSON.stringify(requests)), [requests]);
  useEffect(() => localStorage.setItem("propcare_services", JSON.stringify(services)), [services]);
  const addRequest = r => setRequests(prev => [r, ...prev]);
  const addService = r => setServices(prev => [r, ...prev]);
  const updateRequest = (id, status) => setRequests(prev => prev.map(r => r.id === id ? {...r, status} : r));
  const updateService = (id, patch) => setServices(prev => prev.map(r => r.id === id ? {...r, ...patch} : r));
  return { requests, services, addRequest, addService, updateRequest, updateService };
}

const StoreContext = React.createContext(null);
function useStore() { return React.useContext(StoreContext); }

function App() {
  const store = useDemoStore();
  return <StoreContext.Provider value={store}><Routes>
    <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
    <Route path="/properties" element={<PublicLayout><PropertiesPage /></PublicLayout>} />
    <Route path="/properties/:id" element={<PublicLayout><PropertyDetails /></PublicLayout>} />
    <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
    <Route path="/how-it-works" element={<PublicLayout><HowItWorks /></PublicLayout>} />
    <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/owner/apply" element={<PublicLayout><OwnerApply /></PublicLayout>} />
    <Route path="/tenant/*" element={<DashboardShell role="tenant" />} />
    <Route path="/owner/*" element={<DashboardShell role="owner" />} />
    <Route path="/admin/*" element={<DashboardShell role="admin" />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></StoreContext.Provider>;
}

function PublicLayout({children}) {
  const [open, setOpen] = useState(false);
  return <div className="public-app">
    <header className="topbar">
      <Link to="/" className="brand"><span className="brand-mark"><Building2 size={20}/></span><span>Prop<span>Care</span></span></Link>
      <button className="mobile-menu" onClick={() => setOpen(!open)}><Menu/></button>
      <nav className={open ? "public-nav open" : "public-nav"}>
        <NavLink to="/properties">Properties</NavLink>
        <NavLink to="/services">Services</NavLink>
        <NavLink to="/how-it-works">How It Works</NavLink>
        <NavLink to="/about">About</NavLink>
        <Link className="btn btn-ghost" to="/login"><LogIn size={16}/> Login</Link>
        <Link className="btn btn-dark" to="/owner/apply">List Your Property</Link>
      </nav>
    </header>
    <main>{children}</main>
    <Footer/>
  </div>;
}

function Footer() {
  return <footer className="footer">
    <div className="footer-main">
      <div><div className="brand"><span className="brand-mark"><Building2 size={18}/></span><span>Prop<span>Care</span></span></div><p>Every property managed. Every rupee collected. Every request resolved — on one platform.</p></div>
      <div><h4>Platform</h4><Link to="/properties">Find a Home</Link><Link to="/owner/apply">List Your Property</Link><Link to="/services">Services</Link></div>
      <div><h4>Company</h4><Link to="/how-it-works">How It Works</Link><Link to="/about">About</Link><a href="mailto:hello@propcare.demo">Contact</a></div>
      <div><h4>Demo</h4><Link to="/login">Tenant / Owner / Admin Login</Link><span className="muted">Chennai, Tamil Nadu</span></div>
    </div>
    <div className="footer-bottom"><span>© 2026 PropCare. MVP demo.</span><span>Built for rental operations, not just listings.</span></div>
  </footer>;
}

function HomePage() {
  const featured = properties.filter(p => p.available).slice(0, 3);
  return <div>
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={15}/> PROPERTY MANAGEMENT, SIMPLIFIED</div>
        <h1>Your Property.<br/><em>Our Responsibility.</em></h1>
        <p>Find your next home or hand over the day-to-day management of your property to PropCare. Rent, bills, maintenance and services — all in one place.</p>
        <div className="hero-actions"><Link className="btn btn-dark btn-lg" to="/properties">Find a Home <ArrowRight size={18}/></Link><Link className="btn btn-light btn-lg" to="/owner/apply">Partner With PropCare</Link></div>
        <div className="hero-trust"><span><CheckCircle2 size={17}/> Managed properties</span><span><ShieldCheck size={17}/> Transparent records</span><span><Clock3 size={17}/> Fast service</span></div>
      </div>
      <div className="hero-visual">
        <img src={properties[0].image} alt="PropCare managed home"/>
        <div className="floating-card fc-top"><span className="icon-box"><CircleDollarSign/></span><div><b>{money(153000)}</b><small>rent collected this month</small></div><span className="trend">+8.4%</span></div>
        <div className="floating-card fc-bottom"><span className="avatar">PC</span><div><b>Maintenance resolved</b><small>SR1022 • 2 hrs ago</small></div><CheckCircle2 className="success-icon"/></div>
      </div>
    </section>

    <section className="search-strip">
      <div><span className="eyebrow">FIND YOUR NEXT HOME</span><h2>Search managed rentals</h2></div>
      <Link className="btn btn-dark" to="/properties">Browse Properties <ArrowRight size={16}/></Link>
      <div className="quick-search">
        <div><MapPin size={18}/><input placeholder="Chennai, neighborhood or property"/></div>
        <div><CircleDollarSign size={18}/><select defaultValue=""><option value="" disabled>Budget</option><option>Under ₹20k</option><option>₹20k – ₹30k</option><option>₹30k – ₹50k</option></select></div>
        <Link className="btn btn-dark" to="/properties"><Search size={18}/> Search</Link>
      </div>
    </section>

    <section className="section">
      <div className="section-heading"><div><span className="eyebrow">FEATURED HOMES</span><h2>Properties ready for you</h2></div><Link to="/properties" className="text-link">View all <ArrowRight size={16}/></Link></div>
      <div className="property-grid">{featured.map(p => <PropertyCard key={p.id} p={p}/>)}</div>
    </section>

    <section className="split-section muted-section">
      <div className="split-copy"><span className="eyebrow">MORE THAN A MARKETPLACE</span><h2>One continuous system from listing to living.</h2><p>PropCare stays involved after the keys change hands. Owners get transparent rental operations. Tenants get one digital home for rent, utilities, complaints and services.</p><Link className="btn btn-dark" to="/how-it-works">See how it works <ArrowRight size={16}/></Link></div>
      <div className="flow-card">
        {["Owner registers property","PropCare lists & manages","Tenant moves in","Rent, bills & services","Owner receives payout"].map((x,i)=><div className="flow-step" key={x}><span>{String(i+1).padStart(2,"0")}</span><div><b>{x}</b>{i<4 && <ChevronRight size={16}/>}</div></div>)}
      </div>
    </section>

    <section className="section benefits">
      <div className="section-heading centered"><div><span className="eyebrow">BUILT FOR BOTH SIDES</span><h2>Less friction. More visibility.</h2></div></div>
      <div className="benefit-grid">
        <BenefitCard icon={<House/>} title="For tenants" text="Discover managed homes and handle rent, bills, maintenance and requests from one dashboard." bullets={["Rental request tracking","Digital rent & utility records","Maintenance service timeline"]}/>
        <BenefitCard icon={<WalletCards/>} title="For property owners" text="Keep earning without chasing tenants, collecting rent or coordinating everyday repairs." bullets={["Rent collection & owner payout","Property inspections","Tenant & maintenance visibility"]}/>
        <BenefitCard icon={<ClipboardCheck/>} title="For PropCare" text="Operate every managed property with structured workflows and transparent records." bullets={["Operations dashboard","Service assignment","Inspection & property status"]}/>
      </div>
    </section>

    <section className="stats-band"><div><b>10+</b><span>Demo properties</span></div><div><b>5</b><span>Owner accounts</span></div><div><b>8+</b><span>Tenant accounts</span></div><div><b>24/7</b><span>Digital visibility</span></div></section>

    <section className="cta"><div><span className="eyebrow">READY TO GET STARTED?</span><h2>Property management without the daily headache.</h2><p>Explore a home, partner a property, or see how the operations team keeps everything moving.</p><div className="hero-actions"><Link className="btn btn-light btn-lg" to="/properties">Explore Properties</Link><Link className="btn btn-outline-light btn-lg" to="/owner/apply">List Your Property</Link></div></div></section>
  </div>;
}

function BenefitCard({icon,title,text,bullets}) {
  return <div className="benefit-card"><div className="icon-box">{icon}</div><h3>{title}</h3><p>{text}</p><ul>{bullets.map(b=><li key={b}><Check size={16}/>{b}</li>)}</ul></div>;
}

function PropertyCard({p}) {
  return <article className="property-card">
    <Link to={`/properties/${p.id}`} className="property-image"><img src={p.image} alt={p.title}/><span className={p.available ? "status-pill success" : "status-pill neutral"}>{p.available ? "Available" : "Occupied"}</span><span className="managed-pill"><ShieldCheck size={13}/> PropCare Managed</span></Link>
    <div className="property-body"><div className="property-top"><div><h3>{p.title}</h3><p><MapPin size={14}/>{p.location}</p></div><strong>{money(p.rent)}<small>/ month</small></strong></div>
      <div className="property-specs"><span><BedDouble size={15}/>{p.beds} Beds</span><span><Bath size={15}/>{p.baths} Baths</span><span><Ruler size={15}/>{p.area} sqft</span></div>
      <div className="property-footer"><span>{p.furnishing}</span><Link to={`/properties/${p.id}`} className="text-link">View Details <ArrowRight size={15}/></Link></div>
    </div>
  </article>;
}

function PropertiesPage() {
  const [q,setQ]=useState(""); const [type,setType]=useState("All"); const [max,setMax]=useState("All"); const [beds,setBeds]=useState("All"); const [sort,setSort]=useState("Newest");
  const filtered = useMemo(() => {
    let arr = properties.filter(p => p.title.toLowerCase().includes(q.toLowerCase()) || p.location.toLowerCase().includes(q.toLowerCase()));
    if(type!=="All") arr=arr.filter(p=>p.type===type);
    if(max!=="All") arr=arr.filter(p=>p.rent<=Number(max));
    if(beds!=="All") arr=arr.filter(p=>p.beds>=Number(beds));
    if(sort==="Price: Low") arr.sort((a,b)=>a.rent-b.rent);
    if(sort==="Price: High") arr.sort((a,b)=>b.rent-a.rent);
    return arr;
  },[q,type,max,beds,sort]);
  return <div className="page-wrap">
    <div className="page-hero"><div><span className="eyebrow">CHENNAI RENTALS</span><h1>Find a home that fits.</h1><p>Every property below is demo data for the PropCare MVP.</p></div><div className="result-count">{filtered.length}<span>properties</span></div></div>
    <div className="filters">
      <div className="filter-search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search property or location"/></div>
      <select value={type} onChange={e=>setType(e.target.value)}><option>All</option>{[...new Set(properties.map(p=>p.type))].map(x=><option key={x}>{x}</option>)}</select>
      <select value={max} onChange={e=>setMax(e.target.value)}><option value="All">Any budget</option><option value="20000">Up to ₹20k</option><option value="25000">Up to ₹25k</option><option value="30000">Up to ₹30k</option><option value="40000">Up to ₹40k</option></select>
      <select value={beds} onChange={e=>setBeds(e.target.value)}><option>All</option><option value="1">1+ Beds</option><option value="2">2+ Beds</option><option value="3">3+ Beds</option></select>
      <select value={sort} onChange={e=>setSort(e.target.value)}><option>Newest</option><option>Price: Low</option><option>Price: High</option></select>
    </div>
    <div className="property-grid wide">{filtered.map(p=><PropertyCard p={p} key={p.id}/>)}</div>
    {!filtered.length && <EmptyState icon={<Search/>} title="No properties found" text="Try a different location, budget or property type."/>}
  </div>;
}

function PropertyDetails() {
  const {id}=useParams(); const p=propertyById(id); const [modal,setModal]=useState(false); const [submitted,setSubmitted]=useState(false); const {addRequest}=useStore();
  if(!p) return <Navigate to="/properties"/>;
  const submit=e=>{e.preventDefault(); const f=new FormData(e.currentTarget); addRequest({id:`REQ-${1025+Math.floor(Math.random()*100)}`,propertyId:p.id,applicant:f.get("name"),email:f.get("email"),phone:f.get("phone"),occupation:f.get("occupation"),occupants:Number(f.get("occupants")),moveIn:f.get("moveIn"),status:"Pending",created:new Date().toISOString().slice(0,10)}); setModal(false); setSubmitted(true);};
  return <div className="page-wrap details-page">
    <div className="breadcrumbs"><Link to="/properties">Properties</Link><ChevronRight size={14}/><span>{p.title}</span></div>
    <div className="details-gallery"><img className="details-main-image" src={p.image} alt={p.title}/><div><img src={properties[(properties.indexOf(p)+1)%properties.length].image}/><img src={properties[(properties.indexOf(p)+2)%properties.length].image}/></div></div>
    <div className="details-layout"><div>
      <div className="detail-heading"><div><span className="managed-badge"><ShieldCheck size={14}/> Managed by PropCare</span><h1>{p.title}</h1><p><MapPin size={16}/>{p.location}</p></div><div className="detail-price"><b>{money(p.rent)}</b><span>/ month</span></div></div>
      <div className="detail-specs"><Spec icon={<BedDouble/>} value={`${p.beds} Bedrooms`}/><Spec icon={<Bath/>} value={`${p.baths} Bathrooms`}/><Spec icon={<Ruler/>} value={`${p.area} sqft`}/><Spec icon={<Home/>} value={p.furnishing}/></div>
      <section className="detail-section"><h2>About this property</h2><p>{p.description} PropCare handles the operational side of the rental so tenants have a clear channel for rent, utilities and maintenance.</p></section>
      <section className="detail-section"><h2>Amenities</h2><div className="amenity-grid">{p.amenities.map(a=><span key={a}><CheckCircle2 size={16}/>{a}</span>)}</div></section>
      <section className="detail-section"><h2>Nearby</h2><div className="nearby"><span>Schools <b>1.2 km</b></span><span>Metro <b>2.1 km</b></span><span>Hospital <b>2.8 km</b></span><span>Supermarket <b>0.8 km</b></span></div></section>
    </div><aside className="details-aside"><div className="aside-card"><span className="eyebrow">RENTAL SUMMARY</span><div className="summary-row"><span>Monthly rent</span><b>{money(p.rent)}</b></div><div className="summary-row"><span>Security deposit</span><b>{money(p.deposit)}</b></div><div className="summary-row"><span>Availability</span><StatusBadge status={p.available?"Available":"Occupied"}/></div><button className="btn btn-dark full" disabled={!p.available} onClick={()=>setModal(true)}>{p.available ? "Request to Rent" : "Currently Occupied"} <ArrowRight size={16}/></button><button className="btn btn-light full">Schedule Visit</button><button className="btn btn-plain full"><MessageSquare size={16}/> Contact PropCare</button></div><div className="aside-note"><ShieldCheck size={20}/><div><b>Managed property</b><p>PropCare coordinates rent, bills, maintenance and inspections after move-in.</p></div></div></aside></div>
    {submitted && <Toast onClose={()=>setSubmitted(false)} text="Rental request submitted successfully. Admin can now review it."/>}
    {modal && <Modal title="Request to Rent" onClose={()=>setModal(false)}><form onSubmit={submit} className="form-grid"><Input name="name" label="Full name" required/><Input name="phone" label="Phone number" required/><Input name="email" label="Email" type="email" required/><Input name="occupation" label="Occupation" required/><Input name="occupants" label="Number of occupants" type="number" min="1" defaultValue="2" required/><Input name="moveIn" label="Preferred move-in date" type="date" required/><label className="field span-2"><span>Message</span><textarea name="message" rows="3" placeholder="Tell PropCare anything useful about your rental request"/></label><button className="btn btn-dark span-2">Submit Rental Request <ArrowRight size={16}/></button></form></Modal>}
  </div>;
}

function Spec({icon,value}) { return <div>{icon}<span>{value}</span></div>; }

function ServicesPage() {
  const services=[["Property Management","End-to-end rental operations for owners.",<Building2/>],["Rent Collection","Structured collection, fee calculation and owner payout records.",<WalletCards/>],["Tenant Management","Requests, tenant records and communication workflows.",<Users/>],["Housekeeping","Scheduled cleaning and property upkeep.",<Sparkles/>],["Electrical","Fault reporting, assignment and resolution tracking.",<Zap/>],["Plumbing & Water","Plumbing, water systems and utility issue coordination.",<Droplets/>],["Painting & Repairs","Property touch-ups and general repairs.",<Wrench/>],["Property Inspection","Periodic condition reports with maintenance notes.",<ClipboardCheck/>]];
  return <div className="page-wrap"><div className="page-hero"><div><span className="eyebrow">PROPCARE SERVICES</span><h1>We manage what happens after the listing.</h1><p>From rent collection to repairs, PropCare turns day-to-day rental work into a structured digital workflow.</p></div></div><div className="service-grid">{services.map(([t,d,i])=><div className="service-card" key={t}><div className="icon-box">{i}</div><h3>{t}</h3><p>{d}</p><span className="service-arrow"><ArrowRight size={16}/></span></div>)}</div><div className="split-section service-cta"><div><span className="eyebrow">FOR PROPERTY OWNERS</span><h2>Keep the income. Hand off the operational load.</h2><p>Partner with PropCare for rent, tenant coordination, utility visibility, maintenance and inspections.</p><Link className="btn btn-dark" to="/owner/apply">Partner With PropCare <ArrowRight size={16}/></Link></div><div className="service-list">{["Rental operations","Monthly owner payout","Tenant service requests","Property inspections"].map(x=><div key={x}><CheckCircle2 size={18}/><b>{x}</b></div>)}</div></div></div>;
}

function HowItWorks() {
  return <div className="page-wrap"><div className="page-hero"><div><span className="eyebrow">HOW PROPCARE WORKS</span><h1>One property loop. One source of truth.</h1><p>PropCare connects the owner, tenant and operations team across the entire rental lifecycle.</p></div></div><div className="timeline">{["Owner registers property","PropCare lists and manages the property","Tenant moves in","Rent and service requests are managed digitally","Owner receives the agreed rental share"].map((x,i)=><div className="timeline-row" key={x}><div className="timeline-num">{String(i+1).padStart(2,"0")}</div><div className="timeline-content"><h2>{x}</h2><p>{[
    "Owner submits property details, expected rent and management preferences.",
    "PropCare reviews the property, creates the listing and maintains operational records.",
    "The tenant gets a managed rental experience with a clear digital channel.",
    "Rent, utilities, complaints, maintenance and inspections are recorded in one workflow.",
    "PropCare calculates its agreed service fee and records the owner payout."
  ][i]}</p></div></div>)}</div><div className="info-banner"><Info/><div><b>Important MVP note</b><p>Payments, authentication, messaging and external integrations are simulated locally. Replace the service layer with real APIs before production.</p></div></div></div>;
}

function AboutPage() {
  return <div className="page-wrap"><div className="page-hero"><div><span className="eyebrow">ABOUT PROPCARE</span><h1>Rental management, not just rental discovery.</h1><p>PropCare is designed around the operational reality of residential rentals: properties need attention before, during and after a tenant moves in.</p></div></div><div className="about-grid"><div className="about-card"><span>01</span><h2>For owners</h2><p>Reduce the daily coordination around tenants, rent, bills and maintenance while keeping visibility into property performance.</p></div><div className="about-card"><span>02</span><h2>For tenants</h2><p>Get one digital place to manage rent, utility records, maintenance requests, property information and notifications.</p></div><div className="about-card"><span>03</span><h2>For operations</h2><p>Give the PropCare team structured workflows for property status, inspections, assignments and service resolution.</p></div></div></div>;
}

function OwnerApply() {
  const [done,setDone]=useState(false);
  return <div className="page-wrap owner-apply"><div className="application-layout"><div><span className="eyebrow">PROPERTY OWNER PARTNERSHIP</span><h1>Own a rental property? Let PropCare run the day-to-day.</h1><p>Tell us about your property and we'll use this demo flow to capture a partnership lead.</p><div className="owner-points">{["Rent collection and payout records","Tenant coordination","Bills and maintenance visibility","Periodic property inspections"].map(x=><div key={x}><CheckCircle2 size={18}/>{x}</div>)}</div></div><div className="application-card">{done?<div className="success-state"><CheckCircle2 size={52}/><h2>Thanks — your property lead is recorded.</h2><p>This MVP simulates lead capture locally. A real backend/CRM can be connected later.</p><Link className="btn btn-dark" to="/login">Go to Demo Login</Link></div>:<form className="form-grid" onSubmit={e=>{e.preventDefault();setDone(true)}}><h2 className="span-2">Partner with PropCare</h2><Input label="Name" required/><Input label="Phone" required/><Input label="Email" type="email" required/><Input label="Property location" placeholder="e.g. Anna Nagar" required/><Input label="Property type" placeholder="Apartment / Villa" required/><Input label="Number of properties" type="number" defaultValue="1" required/><Input label="Expected monthly rent" placeholder="₹" required/><label className="field span-2"><span>Message</span><textarea rows="3" placeholder="Anything we should know?"/></label><button className="btn btn-dark span-2">Submit Property <ArrowRight size={16}/></button></form>}</div></div></div>;
}

function LoginPage() {
  const nav=useNavigate(); const [role,setRole]=useState("tenant"); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState("");
  const demos={tenant:["tenant@propcare.demo","demo123"],owner:["owner@propcare.demo","demo123"],admin:["admin@propcare.demo","admin123"]};
  const login=e=>{e.preventDefault(); const [de,dp]=demos[role]; if(email!==de||password!==dp){setError("Use the demo credentials shown below.");return;} localStorage.setItem("propcare_role",role); nav(`/${role}/dashboard`);};
  return <div className="login-page"><div className="login-brand"><Link to="/" className="brand"><span className="brand-mark"><Building2 size={20}/></span><span>Prop<span>Care</span></span></Link></div><div className="login-shell"><div className="login-copy"><span className="eyebrow">PROPCARE DEMO</span><h1>Welcome back.</h1><p>Choose a role to explore the complete rental management workflow.</p><div className="role-cards">{["tenant","owner","admin"].map(r=><button key={r} className={role===r?"role-card active":"role-card"} onClick={()=>{setRole(r);setEmail("");setPassword("")}}><span>{r==="tenant"?<UserRound/>:r==="owner"?<Building2/>:<ShieldCheck/>}</span><div><b>{r[0].toUpperCase()+r.slice(1)}</b><small>{r==="tenant"?"Manage your rental":"Manage properties & operations"}</small></div></button>)}</div></div><form className="login-card" onSubmit={login}><h2>Sign in</h2><p className="muted">Demo accounts are pre-configured.</p><label className="field"><span>Email</span><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com" required/></label><label className="field"><span>Password</span><input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••" required/></label>{error&&<div className="form-error"><AlertTriangle size={16}/>{error}</div>}<button className="btn btn-dark full">Sign in <ArrowRight size={16}/></button><div className="demo-credentials"><b>Demo credentials</b><code>{demos[role][0]}</code><code>{demos[role][1]}</code></div><Link to="/" className="back-link">← Back to website</Link></form></div></div>;
}

const navConfig={
 tenant:[["dashboard","Dashboard",LayoutDashboard],["property","My Property",House],["rent","Rent",WalletCards],["bills","Bills",FileText],["services","Services",Wrench],["requests","Requests",ClipboardList],["notifications","Notifications",Bell],["profile","Profile",UserRound]],
 owner:[["dashboard","Dashboard",LayoutDashboard],["properties","Properties",Building2],["tenants","Tenants",Users],["payments","Rent & Payments",WalletCards],["bills","Bills",FileText],["maintenance","Maintenance",Wrench],["inspections","Inspections",ClipboardCheck],["reports","Reports",BarChart],["notifications","Notifications",Bell],["profile","Profile",UserRound]],
 admin:[["dashboard","Dashboard",LayoutDashboard],["properties","Properties",Building2],["owners","Owners",Users],["tenants","Tenants",Users],["requests","Rental Requests",ClipboardList],["payments","Rent Collection",WalletCards],["services","Services",Wrench],["maintenance","Maintenance",Wrench],["inspections","Inspections",ClipboardCheck],["reports","Reports",BarChart],["settings","Settings",Settings]]
};

function DashboardShell({role}) {
  const [mobile,setMobile]=useState(false);
  const nav=navConfig[role];
  return <div className="dashboard-app"><aside className={mobile?"sidebar open":"sidebar"}><div className="sidebar-head"><Link to="/" className="brand"><span className="brand-mark"><Building2 size={18}/></span><span>Prop<span>Care</span></span></Link><button onClick={()=>setMobile(false)} className="sidebar-close"><X/></button></div><div className="role-label">{role==="admin"?"PROPCARE OPERATIONS":`${role.toUpperCase()} PORTAL`}</div><nav className="side-nav">{nav.map(([path,label,Icon])=><NavLink key={path} to={`/${role}/${path}`} end={path==="dashboard"} onClick={()=>setMobile(false)}><Icon size={17}/><span>{label}</span>{label==="Notifications"&&<i>3</i>}</NavLink>)}</nav><div className="sidebar-bottom"><div className="mini-user"><span>{role==="tenant"?"PK":role==="owner"?"AK":"PC"}</span><div><b>{role==="tenant"?"Pranav Kumar":role==="owner"?"Arun Kumar":"PropCare Admin"}</b><small>{role}@propcare.demo</small></div></div><button onClick={()=>{localStorage.removeItem("propcare_role");window.location.href="/login"}}><LogOut size={16}/> Sign out</button></div></aside><div className="dash-main"><header className="dash-topbar"><button className="mobile-menu dash-menu" onClick={()=>setMobile(true)}><Menu/></button><div className="dash-title">{role==="admin"?"Operations Center":role==="owner"?"Owner Dashboard":"Tenant Dashboard"}</div><div className="dash-actions"><button className="icon-btn"><Search size={18}/></button><button className="icon-btn notif"><Bell size={18}/><i>3</i></button><span className="dash-avatar">{role==="tenant"?"PK":role==="owner"?"AK":"PC"}</span></div></header><div className="dash-content"><Routes>
    <Route path="dashboard" element={<Dashboard role={role}/>}/>
    <Route path="property" element={<TenantProperty/>}/>
    <Route path="rent" element={<TenantRent/>}/>
    <Route path="bills" element={<BillsPage role={role}/>}/>
    <Route path="services" element={<ServicesDashboard/>}/>
    <Route path="requests" element={role==="tenant"?<RentalRequests/>:<AdminRequests/>}/>
    <Route path="properties" element={<OwnerProperties role={role}/>}/>
    <Route path="tenants" element={<PeoplePage title="Tenants" data={tenants}/>}/>
    <Route path="owners" element={<PeoplePage title="Owners" data={owners}/>}/>
    <Route path="payments" element={<PaymentsPage role={role}/>}/>
    <Route path="maintenance" element={<MaintenancePage/>}/>
    <Route path="inspections" element={<InspectionsPage/>}/>
    <Route path="reports" element={<ReportsPage/>}/>
    <Route path="notifications" element={<NotificationsPage role={role}/>}/>
    <Route path="profile" element={<ProfilePage role={role}/>}/>
    <Route path="settings" element={<SettingsPage/>}/>
    <Route path="*" element={<Navigate to="dashboard" replace/>}/>
  </Routes></div></div></div>;
}

function Dashboard({role}) {
  if(role==="tenant") return <TenantDashboard/>;
  if(role==="owner") return <OwnerDashboard/>;
  return <AdminDashboard/>;
}

function DashHeader({eyebrow,title,text,action}) { return <div className="dash-header"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>{action}</div>; }
function StatCard({label,value,sub,icon,trend}) { return <div className="stat-card"><div className="stat-top"><span className="stat-icon">{icon}</span>{trend&&<span className="trend">{trend}</span>}</div><b>{value}</b><span>{label}</span>{sub&&<small>{sub}</small>}</div>; }

function TenantDashboard() {
  const p=propertyById(currentTenant.propertyId);
  return <><DashHeader eyebrow="OVERVIEW" title="Good evening, Pranav." text="Here’s what’s happening with your rental today." action={<button className="btn btn-dark"><CreditCard size={16}/> Pay Rent</button>}/><div className="stats-grid"><StatCard label="Current rent" value={money(currentTenant.rent)} sub="September 2026" icon={<WalletCards/>}/><StatCard label="Next due date" value="28 Sep" sub="3 days left" icon={<CalendarDays/>}/><StatCard label="Electricity bill" value={money(1860)} sub="Pending" icon={<Zap/>}/><StatCard label="Open requests" value="1" sub="SR1024" icon={<Wrench/>}/></div><div className="dash-grid two"><div className="panel"><PanelHead title="My Property" link="/tenant/property"/><div className="mini-property"><img src={p.image}/><div><span className="managed-badge">Managed by PropCare</span><h3>{p.title}</h3><p><MapPin size={14}/>{p.location}</p><div className="property-specs"><span><BedDouble size={14}/>{p.beds} Beds</span><span><Bath size={14}/>{p.baths} Baths</span></div></div><StatusBadge status="Active Lease"/></div></div><div className="panel"><PanelHead title="Recent activity" link="/tenant/requests"/><Activity icon={<CreditCard/>} title="Rent payment recorded" text="September rent • ₹30,000" time="Sep 02"/><Activity icon={<Wrench/>} title="Plumbing request assigned" text="SR1024 • High priority" time="Sep 21"/><Activity icon={<FileText/>} title="Electricity bill added" text="September • ₹1,860" time="Sep 22"/></div></div><div className="dash-grid two"><div className="panel"><PanelHead title="Utility usage" link="/tenant/bills"/><UsageChart/></div><div className="panel"><PanelHead title="Service request" link="/tenant/services"/><div className="request-highlight"><div className="request-id">SR1024 <StatusBadge status="Assigned"/></div><h3>Kitchen sink is leaking</h3><p>Plumbing • High priority • Assigned to Ramesh</p><div className="progress-line"><span style={{width:"48%"}}/></div><div className="request-steps"><span className="done">Submitted</span><span className="done">Assigned</span><span>In Progress</span><span>Resolved</span></div></div></div></div></>;
}

function OwnerDashboard() {
  return <><DashHeader eyebrow="OWNER PORTAL" title="Good evening, Arun." text="Your rental portfolio at a glance." action={<Link to="/owner/properties" className="btn btn-dark"><Plus size={16}/> Add Property</Link>}/><div className="stats-grid"><StatCard label="Total properties" value="2" sub="1 occupied • 1 vacant" icon={<Building2/>}/><StatCard label="Monthly rent" value={money(63000)} sub="Gross collected" icon={<WalletCards/>}/><StatCard label="PropCare fee" value={money(3150)} sub="5% demo agreement" icon={<CircleDollarSign/>}/><StatCard label="Owner payout" value={money(59850)} sub="Scheduled" icon={<CreditCard/>}/></div><div className="dash-grid two"><div className="panel chart-panel"><PanelHead title="Rental income" subtitle="Gross rent vs owner payout"/><IncomeChart/></div><div className="panel"><PanelHead title="Portfolio status" link="/owner/properties"/><div className="donut-wrap"><div className="donut"><span><b>50%</b><small>occupied</small></span><PieChart width={190} height={190}><Pie data={[{v:1},{v:1}]} innerRadius={65} outerRadius={82} dataKey="v" startAngle={90} endAngle={-270}><Cell fill="#18251f"/><Cell fill="#dfe7e2"/></Pie></PieChart></div><div className="legend-list"><span><i className="dot dark"/>Occupied <b>1</b></span><span><i className="dot light"/>Vacant <b>1</b></span><span><i className="dot amber"/>Maintenance <b>1</b></span></div></div></div></div><div className="panel"><PanelHead title="Properties" link="/owner/properties"/><PropertyTable rows={properties.slice(0,4)}/></div></>;
}

function AdminDashboard() {
  const open=serviceRequests.filter(x=>!["Closed","Resolved"].includes(x.status)).length;
  return <><DashHeader eyebrow="OPERATIONS CENTER" title="Good evening, PropCare." text="Here’s the operational pulse across managed properties." action={<button className="btn btn-dark"><Plus size={16}/> Add Property</button>}/><div className="stats-grid"><StatCard label="Total properties" value="10" sub="7 occupied • 3 vacant" icon={<Building2/>}/><StatCard label="Active tenants" value="5" sub="Across 5 properties" icon={<Users/>}/><StatCard label="Rent collected" value={money(153000)} sub="September 2026" icon={<WalletCards/>}/><StatCard label="PropCare revenue" value={money(7650)} sub="5% demo fee" icon={<CircleDollarSign/>}/><StatCard label="Open requests" value={open} sub="Needs operations" icon={<Wrench/>}/><StatCard label="Upcoming inspections" value="6" sub="Next 30 days" icon={<ClipboardCheck/>}/></div><div className="dash-grid two"><div className="panel"><PanelHead title="Rental requests" link="/admin/requests"/><DataRows data={rentalRequests.slice(0,4).map(r=>({title:r.applicant,text:`${propertyById(r.propertyId).title} • ${r.moveIn}`,status:r.status}))}/></div><div className="panel"><PanelHead title="Pending maintenance" link="/admin/services"/><DataRows data={serviceRequests.filter(r=>!["Closed","Resolved"].includes(r.status)).slice(0,4).map(r=>({title:r.issue,text:`${r.propertyId} • ${r.category}`,status:r.priority}))}/></div></div><div className="panel"><PanelHead title="Collection trend" subtitle="Gross rent and PropCare fee"/><IncomeChart/></div></>;
}

function PanelHead({title,subtitle,link}) { return <div className="panel-head"><div><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div>{link&&<Link className="text-link" to={link}>View all <ArrowRight size={15}/></Link>}</div>; }
function Activity({icon,title,text,time}) { return <div className="activity"><span className="activity-icon">{icon}</span><div><b>{title}</b><p>{text}</p></div><small>{time}</small></div>; }
function DataRows({data}) { return <div className="data-rows">{data.map((x,i)=><div className="data-row" key={i}><span className="row-avatar">{x.title.slice(0,2).toUpperCase()}</span><div><b>{x.title}</b><p>{x.text}</p></div><StatusBadge status={x.status}/></div>)}</div>; }

function UsageChart() {
  return <div className="chart"><ResponsiveContainer width="100%" height={245}><LineChart data={usageData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8ece9"/><XAxis dataKey="month" tickLine={false} axisLine={false}/><YAxis tickLine={false} axisLine={false}/><Tooltip/><Legend/><Line type="monotone" dataKey="electricity" stroke="#18251f" strokeWidth={2.5} dot={false} name="Electricity units"/><Line type="monotone" dataKey="water" stroke="#8aa69a" strokeWidth={2.5} dot={false} name="Water units"/></LineChart></ResponsiveContainer></div>;
}
function IncomeChart() {
  return <div className="chart"><ResponsiveContainer width="100%" height={270}><BarChart data={incomeData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8ece9"/><XAxis dataKey="month" tickLine={false} axisLine={false}/><YAxis tickLine={false} axisLine={false} tickFormatter={v=>`₹${v/1000}k`}/><Tooltip formatter={v=>money(v)}/><Legend/><Bar dataKey="gross" fill="#18251f" radius={[4,4,0,0]} name="Gross rent"/><Bar dataKey="payout" fill="#91aa9f" radius={[4,4,0,0]} name="Owner payout"/></BarChart></ResponsiveContainer></div>;
}

function TenantProperty() {
  const p=propertyById(currentTenant.propertyId);
  return <><DashHeader eyebrow="MY PROPERTY" title={p.title} text={p.location}/><div className="property-overview"><img src={p.image}/><div><span className="managed-badge">Managed by PropCare</span><h2>{p.title}</h2><p>{p.description}</p><div className="detail-specs"><Spec icon={<BedDouble/>} value={`${p.beds} Bedrooms`}/><Spec icon={<Bath/>} value={`${p.baths} Bathrooms`}/><Spec icon={<Ruler/>} value={`${p.area} sqft`}/></div></div><div className="lease-box"><span>Monthly rent</span><b>{money(p.rent)}</b><span>Move-in date</span><b>01 May 2026</b><StatusBadge status="Active Lease"/></div></div><div className="panel"><PanelHead title="Property information"/><div className="info-grid"><InfoItem label="Address" value={p.location}/><InfoItem label="Furnishing" value={p.furnishing}/><InfoItem label="Security deposit" value={money(p.deposit)}/><InfoItem label="Last inspection" value="02 Sep 2026"/><InfoItem label="Next inspection" value="02 Oct 2026"/><InfoItem label="PropCare contact" value="+91 90000 12345"/></div></div></>;
}

function TenantRent() {
  const [pay,setPay]=useState(false); const [success,setSuccess]=useState(false);
  return <><DashHeader eyebrow="RENT" title="Rent & payments" text="Your payment history and current month summary." action={<button className="btn btn-dark" onClick={()=>setPay(true)}><CreditCard size={16}/> Pay ₹30,000</button>}/><div className="payment-summary"><div><span>September 2026</span><b>{money(30000)}</b><StatusBadge status="Pending"/></div><div><span>Due date</span><b>28 Sep 2026</b><small>3 days remaining</small></div><div><span>Payment method</span><b>Demo payment</b><small>No real money is transferred</small></div></div><div className="panel"><PanelHead title="Payment history"/><Table headers={["Month","Amount","Paid on","Status","Receipt"]} rows={payments.filter(p=>p.propertyId==="P005").map(p=>[p.month,money(p.rent),p.date,<StatusBadge status={p.status}/>,<button className="icon-btn"><FileText size={16}/></button>])}/></div>{pay&&<PaymentModal onClose={()=>setPay(false)} onSuccess={()=>{setPay(false);setSuccess(true)}}/>}{success&&<Toast onClose={()=>setSuccess(false)} text="Rent payment successful. Mock receipt PAY-3022 generated."/>}</>;
}

function PaymentModal({onClose,onSuccess}) { return <Modal title="Pay rent" onClose={onClose}><div className="payment-modal"><div className="pay-total"><span>Total payable</span><b>{money(30000)}</b></div><div className="pay-line"><span>Rent</span><b>{money(30000)}</b></div><div className="pay-line"><span>Processing fee</span><b>₹0</b></div><div className="demo-warning"><Info size={17}/><span>This is a mock payment flow. No real payment gateway is connected.</span></div><button className="btn btn-dark full" onClick={onSuccess}>Pay Now <Check size={16}/></button></div></Modal>; }

function BillsPage({role}) {
  const [tab,setTab]=useState("All"); const filtered=bills.filter(b=>role==="tenant"?b.propertyId==="P005":true).filter(b=>tab==="All"||b.type===tab);
  return <><DashHeader eyebrow="UTILITY BILLS" title="Bills & usage" text="Electricity, water and other utility records."/><div className="tabbar">{["All","Electricity","Water"].map(t=><button key={t} className={tab===t?"active":""} onClick={()=>setTab(t)}>{t}</button>)}</div><div className="bill-grid">{filtered.map(b=><div className="bill-card" key={b.id}><div className="bill-icon">{b.type==="Electricity"?<Zap/>:<Droplets/>}</div><div><span>{b.type} • {b.month}</span><h3>{money(b.amount)}</h3><p>{b.units} units consumed • Due {b.due}</p></div><StatusBadge status={b.status}/><div className="bill-reading"><span>Previous <b>{b.previous}</b></span><span>Current <b>{b.current}</b></span><span>Usage <b>{b.units}</b></span></div></div>)}</div><div className="panel"><PanelHead title="Usage trend" subtitle="Demo monthly consumption"/><UsageChart/></div></>;
}

function ServicesDashboard() {
  const {services,addService}=useStore(); const [modal,setModal]=useState(false); const [toast,setToast]=useState(false);
  const submit=e=>{e.preventDefault(); const f=new FormData(e.currentTarget); addService({id:`SR${1025+Math.floor(Math.random()*100)}`,propertyId:"P005",tenant:"Pranav Kumar",category:f.get("category"),issue:f.get("title"),priority:f.get("priority"),status:"Submitted",assignee:"Unassigned",created:new Date().toISOString().slice(0,10),due:"2026-09-30"});setModal(false);setToast(true)};
  return <><DashHeader eyebrow="SERVICE REQUESTS" title="Maintenance & services" text="Raise a request and follow it from submission to resolution." action={<button className="btn btn-dark" onClick={()=>setModal(true)}><Plus size={16}/> New Request</button>}/><div className="request-list">{services.filter(s=>s.propertyId==="P005").map(s=><div className="service-request-card" key={s.id}><div className="request-card-top"><span className="request-id">{s.id}</span><div><StatusBadge status={s.priority}/><StatusBadge status={s.status}/></div></div><h3>{s.issue}</h3><p>{s.category} • Created {s.created} • Due {s.due}</p><div className="service-timeline"><span className="done">Submitted</span><span className={["Assigned","In Progress","Technician Visit","Resolved","Closed"].includes(s.status)?"done":""}>Assigned</span><span className={["In Progress","Technician Visit","Resolved","Closed"].includes(s.status)?"done":""}>In Progress</span><span className={["Technician Visit","Resolved","Closed"].includes(s.status)?"done":""}>Technician Visit</span><span className={["Resolved","Closed"].includes(s.status)?"done":""}>Resolved</span></div></div>)}</div>{modal&&<Modal title="New service request" onClose={()=>setModal(false)}><form className="form-grid" onSubmit={submit}><label className="field"><span>Category</span><select name="category" required><option>Plumbing</option><option>Electricity</option><option>Water</option><option>Washing Machine</option><option>Air Conditioner</option><option>Refrigerator</option><option>Painting</option><option>Cleaning</option><option>General Maintenance</option><option>Other</option></select></label><label className="field"><span>Priority</span><select name="priority"><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></label><Input name="title" label="Issue title" required/><label className="field span-2"><span>Description</span><textarea name="description" rows="4" placeholder="Describe the issue" required/></label><Input name="preferred" label="Preferred date" type="date"/><label className="field"><span>Contact preference</span><select><option>Phone</option><option>WhatsApp</option><option>In-app</option></select></label><button className="btn btn-dark span-2">Submit Request <ArrowRight size={16}/></button></form></Modal>}{toast&&<Toast onClose={()=>setToast(false)} text="Service request submitted. Your request ID is now visible in the list."/>}</>;
}

function RentalRequests() {
  const {requests}=useStore();
  return <><DashHeader eyebrow="REQUESTS" title="My rental requests" text="Track applications submitted through PropCare."/><div className="panel"><Table headers={["Request","Property","Move-in","Created","Status"]} rows={requests.filter(r=>r.applicant==="Pranav Kumar").map(r=>[r.id,propertyById(r.propertyId)?.title,r.moveIn,r.created,<StatusBadge status={r.status}/>])}/></div><EmptyState icon={<House/>} title="Need another home?" text="Browse more managed properties and submit a new rental request." action={<Link className="btn btn-light" to="/properties">Browse properties</Link>}/></>;
}

function AdminRequests() {
  const {requests,updateRequest}=useStore();
  return <><DashHeader eyebrow="RENTAL REQUESTS" title="Review applications" text="Approve, reject and progress incoming rental requests."/><div className="panel"><Table headers={["Request","Applicant","Property","Move-in","Status","Action"]} rows={requests.map(r=>[r.id,<div><b>{r.applicant}</b><small>{r.occupation}</small></div>,propertyById(r.propertyId)?.title,r.moveIn,<StatusBadge status={r.status}/>,<div className="row-actions"><button className="btn btn-small btn-dark" onClick={()=>updateRequest(r.id,"Approved")}><Check size={14}/> Approve</button><button className="btn btn-small btn-light" onClick={()=>updateRequest(r.id,"Rejected")}>Reject</button></div>])}/></div></>;
}

function OwnerProperties({role}) {
  const list=role==="owner"?properties.filter(p=>["P001","P004"].includes(p.id)):properties;
  return <><DashHeader eyebrow="PROPERTIES" title={role==="owner"?"Your properties":"Property management"} text="Manage occupancy, rent, tenant and inspection records." action={<button className="btn btn-dark"><Plus size={16}/> Add Property</button>}/><div className="property-management-grid">{list.map(p=><div className="managed-property-card" key={p.id}><img src={p.image}/><div className="managed-property-body"><div className="managed-card-top"><div><span className="eyebrow">{p.type}</span><h3>{p.title}</h3><p><MapPin size={13}/>{p.location}</p></div><StatusBadge status={p.available?"Vacant":"Occupied"}/></div><div className="managed-meta"><span>Rent <b>{money(p.rent)}</b></span><span>Tenant <b>{p.tenant?tenants.find(t=>t.id===p.tenant)?.name:"—"}</b></span><span>Inspection <b>{p.inspection}</b></span></div><div className="managed-actions"><button className="btn btn-small btn-light">View</button><button className="btn btn-small btn-light">Edit</button><button className="btn btn-small btn-light">Bills</button><button className="btn btn-small btn-light">Inspection</button></div></div></div>)}</div></>;
}

function PaymentsPage({role}) {
  return <><DashHeader eyebrow="RENT COLLECTION" title={role==="owner"?"Rent & payouts":"Rent collection"} text="Track gross rent, PropCare management fee and owner payout."/><div className="stats-grid"><StatCard label="Gross collected" value={money(153000)} sub="September" icon={<WalletCards/>}/><StatCard label="PropCare fee" value={money(7650)} sub="5% demo fee" icon={<CircleDollarSign/>}/><StatCard label="Owner payout" value={money(145350)} sub="Scheduled" icon={<CreditCard/>}/></div><div className="panel"><PanelHead title="Transaction history"/><Table headers={["Payment","Property","Tenant","Rent","Fee","Owner payout","Status"]} rows={payments.map(p=>[p.id,propertyById(p.propertyId)?.title,p.tenant,money(p.rent),money(p.fee),money(p.payout),<StatusBadge status={p.status}/>])}/></div></>;
}

function MaintenancePage() {
  const {services,updateService}=useStore();
  return <><DashHeader eyebrow="MAINTENANCE" title="Service operations" text="Assign, prioritize and resolve property service requests."/><div className="panel"><Table headers={["Request","Property","Tenant","Category","Priority","Assignee","Status","Action"]} rows={services.map(s=>[s.id,propertyById(s.propertyId)?.title,s.tenant,s.category,<StatusBadge status={s.priority}/>,s.assignee,<StatusBadge status={s.status}/>,<select value={s.status} onChange={e=>updateService(s.id,{status:e.target.value})}><option>Submitted</option><option>Assigned</option><option>In Progress</option><option>Technician Visit</option><option>Resolved</option><option>Closed</option></select>])}/></div></>;
}

function InspectionsPage() {
  return <><DashHeader eyebrow="INSPECTIONS" title="Property inspections" text="Monthly condition checks and maintenance follow-up." action={<button className="btn btn-dark"><Plus size={16}/> New Inspection</button>}/><div className="panel"><Table headers={["Inspection","Property","Date","Employee","Condition","Maintenance","Next"]} rows={inspections.map(i=>[i.id,propertyById(i.propertyId)?.title,i.date,i.employee,<StatusBadge status={i.condition}/>,i.maintenance,i.next])}/></div><div className="inspection-grid">{inspections.map(i=><div className="inspection-card" key={i.id}><div><span className="request-id">{i.id}</span><StatusBadge status={i.condition}/></div><h3>{propertyById(i.propertyId)?.title}</h3><p>{i.employee} • {i.date}</p><div className="inspection-checks">{[["Electrical",i.electrical],["Plumbing",i.plumbing],["Appliances",i.appliances],["Water",i.water],["Cleanliness",i.cleanliness]].map(([a,b])=><span key={a}><b>{a}</b><StatusBadge status={b}/></span>)}</div><p className="inspection-note"><b>Maintenance:</b> {i.maintenance}</p></div>)}</div></>;
}

function ReportsPage() {
  return <><DashHeader eyebrow="REPORTS & ANALYTICS" title="Portfolio insights" text="Demo analytics for rental income, occupancy and service operations."/><div className="dash-grid two"><div className="panel"><PanelHead title="Rental income" subtitle="Last 6 months"/><IncomeChart/></div><div className="panel"><PanelHead title="Utility usage" subtitle="Demo tenant consumption"/><UsageChart/></div></div><div className="stats-grid"><StatCard label="Occupancy rate" value="70%" sub="7 of 10 properties" icon={<Building2/>}/><StatCard label="Service resolution" value="80%" sub="Closed/resolved requests" icon={<CheckCircle2/>}/><StatCard label="Average rent" value={money(27500)} sub="Managed portfolio" icon={<CircleDollarSign/>}/></div></>;
}

function NotificationsPage({role}) {
  const list=notifications.filter(n=>n.role===role);
  return <><DashHeader eyebrow="NOTIFICATIONS" title="Stay in the loop" text="Important updates from the PropCare workflow."/><div className="notification-list">{list.map(n=><div className={n.unread?"notification unread":"notification"} key={n.id}><span className="notif-icon"><Bell size={18}/></span><div><b>{n.title}</b><p>{n.message}</p><small>{n.time}</small></div>{n.unread&&<i/>}</div>)}</div></>;
}

function ProfilePage({role}) {
  const user=role==="tenant"?{name:"Pranav Kumar",email:"tenant@propcare.demo",phone:"+91 98765 43210"}:role==="owner"?{name:"Arun Kumar",email:"owner@propcare.demo",phone:"+91 98400 11221"}:{name:"PropCare Admin",email:"admin@propcare.demo",phone:"+91 90000 12345"};
  return <><DashHeader eyebrow="PROFILE" title="Your profile" text="Demo account information."/><div className="profile-layout"><div className="profile-card"><div className="large-avatar">{user.name.split(" ").map(x=>x[0]).join("").slice(0,2)}</div><h2>{user.name}</h2><p>{role[0].toUpperCase()+role.slice(1)} account</p><button className="btn btn-light">Edit Profile</button></div><div className="panel"><h2>Account details</h2><div className="info-grid"><InfoItem label="Full name" value={user.name}/><InfoItem label="Email" value={user.email}/><InfoItem label="Phone" value={user.phone}/><InfoItem label="Role" value={role}/></div></div></div></>;
}
function SettingsPage() { return <><DashHeader eyebrow="SETTINGS" title="Operations settings" text="MVP configuration placeholders for the PropCare team."/><div className="settings-list">{["Management fee defaults","Notification preferences","Service categories","Inspection frequency","Demo data controls"].map((x,i)=><div key={x}><div><b>{x}</b><p>{i===0?"Fees remain configurable per property/owner agreement.":"Configuration can be connected to a real backend later."}</p></div><button className="btn btn-small btn-light">Configure <ChevronRight size={15}/></button></div>)}</div></>; }

function PeoplePage({title,data}) {
  return <><DashHeader eyebrow={title.toUpperCase()} title={title} text={`Manage ${title.toLowerCase()} records across PropCare.`}/><div className="panel"><Table headers={["Name","Email","Phone","Properties","Status"]} rows={data.map(x=>[x.name,x.email,x.phone,x.properties??(x.propertyId?propertyById(x.propertyId)?.title:"—"),<StatusBadge status="Active"/>])}/></div></>;
}

function InfoItem({label,value}) { return <div className="info-item"><span>{label}</span><b>{value}</b></div>; }
function StatusBadge({status}) {
  const s=String(status);
  let cls="neutral"; if(["Paid","Approved","Available","Active","Active Lease","Resolved","Closed","Good","Occupied"].includes(s))cls="success"; if(["Pending","Under Review","Assigned","In Progress","Visit Scheduled","Scheduled","Minor Issues","Maintenance Required","Medium"].includes(s))cls="warning"; if(["Rejected","Overdue","Urgent","Urgent Repair","High"].includes(s))cls="danger";
  return <span className={`status-badge ${cls}`}>{s}</span>;
}
function Table({headers,rows}) { return <div className="table-wrap"><table><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j}>{c}</td>)}</tr>)}</tbody></table></div>; }
function PropertyTable({rows}) { return <Table headers={["Property","Rent","Occupancy","Inspection","Status"]} rows={rows.map(p=>[<div className="table-property"><img src={p.image}/><div><b>{p.title}</b><small>{p.location}</small></div></div>,money(p.rent),p.available?"Vacant":"Occupied",p.inspection,<StatusBadge status={p.available?"Available":"Occupied"}/>])}/>; }
function Input({label,name,type="text",required=false,placeholder="",defaultValue="",min}) { return <label className="field"><span>{label}</span><input name={name} type={type} placeholder={placeholder} defaultValue={defaultValue} required={required} min={min}/></label>; }
function EmptyState({icon,title,text,action}) { return <div className="empty-state"><span>{icon}</span><h3>{title}</h3><p>{text}</p>{action}</div>; }
function Modal({title,onClose,children}) { return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="modal"><div className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose}><X/></button></div>{children}</div></div>; }
function Toast({text,onClose}) { useEffect(()=>{const t=setTimeout(onClose,4500);return()=>clearTimeout(t)},[onClose]); return <div className="toast"><CheckCircle2 size={20}/><span>{text}</span><button onClick={onClose}><X size={16}/></button></div>; }

export default App;