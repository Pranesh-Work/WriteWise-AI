export const properties = [
  { id:"P001", title:"Green Heights", location:"Anna Nagar, Chennai", rent:28000, deposit:100000, beds:2, baths:2, area:1180, furnishing:"Semi-Furnished", type:"Apartment", available:true, owner:"Arun Kumar", image:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", amenities:["Parking","Lift","Security","Power Backup"], description:"Bright 2BHK apartment close to schools, metro access and everyday conveniences.", inspection:"2026-09-08", tenant:null },
  { id:"P002", title:"Bayview Residency", location:"Adyar, Chennai", rent:35000, deposit:140000, beds:3, baths:2, area:1560, furnishing:"Fully Furnished", type:"Apartment", available:false, owner:"Meena Srinivasan", image:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", amenities:["Parking","Gym","Security","Balcony"], description:"Premium 3BHK residence with modern interiors and excellent natural light.", inspection:"2026-09-05", tenant:"TN002" },
  { id:"P003", title:"Lakeview Nest", location:"Velachery, Chennai", rent:22000, deposit:88000, beds:2, baths:2, area:1040, furnishing:"Semi-Furnished", type:"Apartment", available:true, owner:"Suresh Babu", image:"https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80", amenities:["Parking","Lift","CCTV","Water Supply"], description:"Comfortable family apartment in a well-connected residential neighborhood.", inspection:"2026-08-28", tenant:null },
  { id:"P004", title:"Palm Grove Villa", location:"Sholinganallur, Chennai", rent:42000, deposit:168000, beds:3, baths:3, area:1900, furnishing:"Fully Furnished", type:"Villa", available:true, owner:"Karthik Raj", image:"https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80", amenities:["Garden","Parking","Security","Terrace"], description:"Spacious villa designed for families working around the OMR corridor.", inspection:"2026-09-10", tenant:null },
  { id:"P005", title:"Metro Corner", location:"T. Nagar, Chennai", rent:30000, deposit:120000, beds:2, baths:2, area:1120, furnishing:"Fully Furnished", type:"Apartment", available:false, owner:"Priya Menon", image:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80", amenities:["Lift","Security","Parking","Power Backup"], description:"City-centre 2BHK with easy access to shopping, transport and offices.", inspection:"2026-09-02", tenant:"TN001" },
  { id:"P006", title:"Orchid Homes", location:"Porur, Chennai", rent:24500, deposit:98000, beds:2, baths:2, area:1080, furnishing:"Unfurnished", type:"Apartment", available:true, owner:"Ravi Chandran", image:"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80", amenities:["Parking","Lift","CCTV","Water Supply"], description:"Practical 2BHK for professionals looking for value and connectivity.", inspection:"2026-08-25", tenant:null },
  { id:"P007", title:"OMR WorkLife", location:"Perungudi, Chennai", rent:27000, deposit:108000, beds:2, baths:2, area:1160, furnishing:"Semi-Furnished", type:"Apartment", available:true, owner:"Deepa Narayanan", image:"https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80", amenities:["Gym","Pool","Parking","Security"], description:"Modern community living near major IT parks and public transport.", inspection:"2026-09-07", tenant:null },
  { id:"P008", title:"Tambaram Family Home", location:"Tambaram, Chennai", rent:18000, deposit:72000, beds:2, baths:1, area:980, furnishing:"Semi-Furnished", type:"Independent House", available:true, owner:"Mohan Das", image:"https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80", amenities:["Parking","Terrace","Water Supply","Garden"], description:"Quiet independent home suitable for a small family.", inspection:"2026-08-31", tenant:null },
  { id:"P009", title:"Marina View Studio", location:"Adyar, Chennai", rent:19500, deposit:78000, beds:1, baths:1, area:650, furnishing:"Fully Furnished", type:"Studio", available:true, owner:"Anitha Rao", image:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", amenities:["Lift","Security","Wi-Fi","Power Backup"], description:"Compact furnished studio for a professional or student.", inspection:"2026-09-01", tenant:null },
  { id:"P010", title:"Thoraipakkam Square", location:"Thoraipakkam, Chennai", rent:26000, deposit:104000, beds:2, baths:2, area:1100, furnishing:"Semi-Furnished", type:"Apartment", available:false, owner:"Vijay Anand", image:"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80", amenities:["Parking","Lift","CCTV","Gym"], description:"Well-planned apartment close to OMR offices and restaurants.", inspection:"2026-09-03", tenant:"TN003" }
];

export const tenants = [
  { id:"TN001", name:"Pranav Kumar", email:"tenant@propcare.demo", phone:"+91 98765 43210", propertyId:"P005", moveIn:"2026-05-01", rent:30000 },
  { id:"TN002", name:"Divya Shankar", email:"divya@example.com", phone:"+91 98421 65432", propertyId:"P002", moveIn:"2026-04-15", rent:35000 },
  { id:"TN003", name:"Arjun Prakash", email:"arjun@example.com", phone:"+91 90030 11223", propertyId:"P010", moveIn:"2026-06-01", rent:26000 },
  { id:"TN004", name:"Keerthana S", email:"keerthana@example.com", phone:"+91 97890 22334", propertyId:"P003", moveIn:"2026-07-01", rent:22000 },
  { id:"TN005", name:"Rahul Nair", email:"rahul@example.com", phone:"+91 99620 77881", propertyId:"P007", moveIn:"2026-03-01", rent:27000 }
];

export const owners = [
  { id:"O001", name:"Arun Kumar", email:"arun@example.com", phone:"+91 98400 11221", properties:2 },
  { id:"O002", name:"Meena Srinivasan", email:"meena@example.com", phone:"+91 98402 33445", properties:2 },
  { id:"O003", name:"Suresh Babu", email:"suresh@example.com", phone:"+91 98840 44556", properties:1 },
  { id:"O004", name:"Karthik Raj", email:"karthik@example.com", phone:"+91 99520 55667", properties:2 },
  { id:"O005", name:"Priya Menon", email:"priya@example.com", phone:"+91 97877 66778", properties:3 }
];

export const rentalRequests = [
  { id:"REQ-1024", propertyId:"P001", applicant:"Naveen Kumar", email:"naveen@example.com", phone:"+91 90000 11223", occupation:"Software Engineer", occupants:2, moveIn:"2026-10-01", status:"Pending", created:"2026-09-22" },
  { id:"REQ-1023", propertyId:"P003", applicant:"Harini Devi", email:"harini@example.com", phone:"+91 90000 22334", occupation:"Designer", occupants:2, moveIn:"2026-10-05", status:"Under Review", created:"2026-09-21" },
  { id:"REQ-1022", propertyId:"P004", applicant:"Vishal R", email:"vishal@example.com", phone:"+91 90000 33445", occupation:"Product Manager", occupants:3, moveIn:"2026-10-15", status:"Visit Scheduled", created:"2026-09-20" },
  { id:"REQ-1021", propertyId:"P006", applicant:"Aishwarya P", email:"aishwarya@example.com", phone:"+91 90000 44556", occupation:"Teacher", occupants:3, moveIn:"2026-09-28", status:"Approved", created:"2026-09-18" },
  { id:"REQ-1020", propertyId:"P008", applicant:"Sanjay M", email:"sanjay@example.com", phone:"+91 90000 55667", occupation:"Analyst", occupants:2, moveIn:"2026-10-10", status:"Rejected", created:"2026-09-17" }
];

export const serviceRequests = [
  { id:"SR1024", propertyId:"P005", tenant:"Pranav Kumar", category:"Plumbing", issue:"Kitchen sink is leaking", priority:"High", status:"Assigned", assignee:"Ramesh - Plumbing", created:"2026-09-21", due:"2026-09-24" },
  { id:"SR1023", propertyId:"P002", tenant:"Divya Shankar", category:"Air Conditioner", issue:"AC is not cooling properly", priority:"Medium", status:"In Progress", assignee:"CoolCare Services", created:"2026-09-20", due:"2026-09-23" },
  { id:"SR1022", propertyId:"P010", tenant:"Arjun Prakash", category:"Electricity", issue:"Bedroom switchboard sparking", priority:"Urgent", status:"Technician Visit", assignee:"PropCare Electrical Team", created:"2026-09-20", due:"2026-09-20" },
  { id:"SR1021", propertyId:"P003", tenant:"Keerthana S", category:"Cleaning", issue:"Deep cleaning requested", priority:"Low", status:"Resolved", assignee:"CleanNest", created:"2026-09-18", due:"2026-09-19" },
  { id:"SR1020", propertyId:"P007", tenant:"Rahul Nair", category:"Painting", issue:"Wall paint touch-up needed", priority:"Medium", status:"Submitted", assignee:"Unassigned", created:"2026-09-17", due:"2026-09-27" },
  { id:"SR1019", propertyId:"P002", tenant:"Divya Shankar", category:"Water", issue:"Low water pressure in bathroom", priority:"High", status:"Closed", assignee:"Ramesh - Plumbing", created:"2026-09-12", due:"2026-09-14" },
  { id:"SR1018", propertyId:"P010", tenant:"Arjun Prakash", category:"Washing Machine", issue:"Machine not draining water", priority:"Medium", status:"Resolved", assignee:"HomeFix Appliances", created:"2026-09-10", due:"2026-09-13" },
  { id:"SR1017", propertyId:"P005", tenant:"Pranav Kumar", category:"Door/Lock", issue:"Main door lock feels loose", priority:"High", status:"Closed", assignee:"SecureFix", created:"2026-09-05", due:"2026-09-07" },
  { id:"SR1016", propertyId:"P007", tenant:"Rahul Nair", category:"General Maintenance", issue:"Balcony drain cleaning", priority:"Low", status:"Closed", assignee:"PropCare Maintenance", created:"2026-09-02", due:"2026-09-04" },
  { id:"SR1015", propertyId:"P002", tenant:"Divya Shankar", category:"Refrigerator", issue:"Fridge making unusual noise", priority:"Medium", status:"Closed", assignee:"HomeFix Appliances", created:"2026-08-30", due:"2026-09-01" }
];

export const bills = [
  { id:"B001", propertyId:"P005", type:"Electricity", month:"Sep 2026", previous:1204, current:1328, units:124, amount:1860, due:"2026-09-28", status:"Pending" },
  { id:"B002", propertyId:"P005", type:"Water", month:"Sep 2026", previous:88, current:96, units:8, amount:480, due:"2026-09-28", status:"Pending" },
  { id:"B003", propertyId:"P005", type:"Electricity", month:"Aug 2026", previous:1089, current:1204, units:115, amount:1725, due:"2026-08-28", status:"Paid" },
  { id:"B004", propertyId:"P005", type:"Water", month:"Aug 2026", previous:81, current:88, units:7, amount:420, due:"2026-08-28", status:"Paid" },
  { id:"B005", propertyId:"P002", type:"Electricity", month:"Sep 2026", previous:2201, current:2344, units:143, amount:2145, due:"2026-09-28", status:"Paid" },
  { id:"B006", propertyId:"P002", type:"Water", month:"Sep 2026", previous:112, current:121, units:9, amount:540, due:"2026-09-28", status:"Paid" },
  { id:"B007", propertyId:"P010", type:"Electricity", month:"Sep 2026", previous:910, current:1038, units:128, amount:1920, due:"2026-09-28", status:"Pending" },
  { id:"B008", propertyId:"P010", type:"Water", month:"Sep 2026", previous:64, current:72, units:8, amount:480, due:"2026-09-28", status:"Paid" }
];

export const payments = [
  { id:"PAY-3021", propertyId:"P005", tenant:"Pranav Kumar", month:"Sep 2026", rent:30000, fee:1500, payout:28500, date:"2026-09-02", status:"Paid" },
  { id:"PAY-3020", propertyId:"P002", tenant:"Divya Shankar", month:"Sep 2026", rent:35000, fee:1750, payout:33250, date:"2026-09-01", status:"Paid" },
  { id:"PAY-3019", propertyId:"P010", tenant:"Arjun Prakash", month:"Sep 2026", rent:26000, fee:1300, payout:24700, date:"2026-09-03", status:"Paid" },
  { id:"PAY-3018", propertyId:"P007", tenant:"Rahul Nair", month:"Sep 2026", rent:27000, fee:1350, payout:25650, date:"2026-09-02", status:"Paid" },
  { id:"PAY-3017", propertyId:"P005", tenant:"Pranav Kumar", month:"Aug 2026", rent:30000, fee:1500, payout:28500, date:"2026-08-02", status:"Paid" },
  { id:"PAY-3016", propertyId:"P002", tenant:"Divya Shankar", month:"Aug 2026", rent:35000, fee:1750, payout:33250, date:"2026-08-01", status:"Paid" }
];

export const inspections = [
  { id:"INS-0821", propertyId:"P005", date:"2026-09-02", employee:"Vijay - PropCare", condition:"Good", electrical:"Good", plumbing:"Minor Issue", appliances:"Good", walls:"Good", doors:"Good", water:"Good", cleanliness:"Good", maintenance:"Kitchen tap gasket replacement", next:"2026-10-02" },
  { id:"INS-0820", propertyId:"P002", date:"2026-09-05", employee:"Meena - PropCare", condition:"Minor Issues", electrical:"Good", plumbing:"Good", appliances:"Minor Issue", walls:"Good", doors:"Good", water:"Good", cleanliness:"Good", maintenance:"AC service recommended", next:"2026-10-05" },
  { id:"INS-0819", propertyId:"P010", date:"2026-09-03", employee:"Vijay - PropCare", condition:"Maintenance Required", electrical:"Urgent Repair", plumbing:"Good", appliances:"Good", walls:"Good", doors:"Good", water:"Good", cleanliness:"Good", maintenance:"Switchboard replacement", next:"2026-10-03" },
  { id:"INS-0818", propertyId:"P007", date:"2026-09-07", employee:"Asha - PropCare", condition:"Good", electrical:"Good", plumbing:"Good", appliances:"Good", walls:"Good", doors:"Good", water:"Good", cleanliness:"Good", maintenance:"None", next:"2026-10-07" }
];

export const notifications = [
  { id:1, role:"tenant", title:"Rent due reminder", message:"Your September rent is due in 3 days.", time:"2 hours ago", unread:true },
  { id:2, role:"tenant", title:"Service request assigned", message:"SR1024 has been assigned to Ramesh - Plumbing.", time:"5 hours ago", unread:true },
  { id:3, role:"owner", title:"Rent collected", message:"₹30,000 has been collected for Green Heights.", time:"Yesterday", unread:true },
  { id:4, role:"owner", title:"Inspection completed", message:"September inspection is available for your property.", time:"Yesterday", unread:false },
  { id:5, role:"admin", title:"New rental request", message:"REQ-1024 requires review.", time:"20 minutes ago", unread:true },
  { id:6, role:"admin", title:"Urgent maintenance", message:"SR1022 requires immediate attention.", time:"1 hour ago", unread:true }
];

export const incomeData = [
  {month:"Apr", gross:112000, fee:5600, payout:106400},
  {month:"May", gross:124000, fee:6200, payout:117800},
  {month:"Jun", gross:131000, fee:6550, payout:124450},
  {month:"Jul", gross:138000, fee:6900, payout:131100},
  {month:"Aug", gross:153000, fee:7650, payout:145350},
  {month:"Sep", gross:153000, fee:7650, payout:145350}
];

export const usageData = [
  {month:"Apr", electricity:108, water:7},
  {month:"May", electricity:124, water:8},
  {month:"Jun", electricity:116, water:8},
  {month:"Jul", electricity:139, water:9},
  {month:"Aug", electricity:115, water:7},
  {month:"Sep", electricity:124, water:8}
];