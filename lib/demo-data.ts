import type { DemoAccount, Product } from "./types";

export const demoProducts: Product[] = [
  { id:"1", name:"Poludisperzija bela 15L", category:"Boje", retail_price:3890, manufacturer:"DIM Color", color_name:"Bela", package_size:"15L", base:"Vodena", purpose:"Zidovi", description:"Bela unutrasnja boja za zidove i plafone.", in_stock:true },
  { id:"2", name:"Akrilna fasadna boja 25kg", category:"Fasade", retail_price:6490, manufacturer:"Fasadex", color_name:"Bela", package_size:"25kg", base:"Vodena", purpose:"Fasada", description:"Otporna akrilna boja za spoljne zidove.", in_stock:true },
  { id:"3", name:"Auto lak set 1L", category:"Auto program", retail_price:2850, manufacturer:"AutoPro", color_name:"Plava", package_size:"1L", base:"Nitro", purpose:"Metal", description:"Set za zavrsno lakiranje automobilskih povrsina.", in_stock:false },
  { id:"4", name:"Valjak profesionalni 25cm", category:"Alat", retail_price:740, manufacturer:"Master Tool", color_name:"Zelena", package_size:"25cm", base:"Nije primenljivo", purpose:"Zidovi", description:"Profesionalni valjak za brzo i ravnomerno nanosenje.", in_stock:true },
  { id:"5", name:"Podloga za zidove 10L", category:"Boje", retail_price:2190, manufacturer:"DIM Color", color_name:"Providna", package_size:"10L", base:"Vodena", purpose:"Zidovi", description:"Podloga za pripremu zidova pre bojenja.", in_stock:true },
  { id:"6", name:"Lepak za stiropor 25kg", category:"Fasade", retail_price:980, manufacturer:"Fasadex", color_name:"Siva", package_size:"25kg", base:"Nije primenljivo", purpose:"Fasada", description:"Lepak za fasadne izolacione sisteme.", in_stock:true }
];

export const demoAccounts: DemoAccount[] = [
  { username:"firmaA", password:"1234", role:"customer", label:"Firma A", email:"firmaa@example.com", phone:"+381 60 111 222", credit:350000, permissions:[], invoices:[
    { id:"1", name:"FA-2026-014", amount:42800, status:"U obradi", is_paid:false },
    { id:"2", name:"FA-2026-009", amount:18600, status:"Dostavljeno", is_paid:true }
  ]},
  { username:"firmaB", password:"1234", role:"customer", label:"Firma B", email:"firmab@example.com", phone:"+381 60 333 444", credit:180000, permissions:[], invoices:[
    { id:"3", name:"FB-2026-021", amount:76500, status:"Ceka uplatu", is_paid:false }
  ]},
  { username:"admin", password:"admin", role:"admin", label:"Admin", email:"admin@dimteam.rs", phone:"", credit:0, permissions:["manage_products","manage_orders","manage_customers","manage_prices","manage_invoices","manage_support","manage_special_requests"], invoices:[] },
  { username:"podrska", password:"1234", role:"staff", label:"Podrska", email:"podrska@dimteam.rs", phone:"", credit:0, permissions:["manage_support","manage_special_requests","manage_orders"], invoices:[] }
];
