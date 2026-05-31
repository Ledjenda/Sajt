"use client";
import Link from "next/link";
import { Menu, Search, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApp } from "./app-provider";

export function Header(){
  const {account,products,cart,logout}=useApp(); const router=useRouter(); const [search,setSearch]=useState(false); const [q,setQ]=useState("");
  const results=q?products.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())).slice(0,10):[];
  const doLogout=()=>{logout();router.push("/");};
  return <header className="topbar">
    <details className="menu"><summary aria-label="Otvori meni"><Menu/></summary><nav><Link href="/">Pocetna strana</Link><Link href="/proizvodi">Proizvodi</Link><Link href="/login">Veleprodaja</Link><Link href="/o-nama">O nama</Link><Link href="/podrska">Podrska</Link><Link href="/kontakt">Kontakt</Link></nav></details>
    <Link className="brand" href="/"><img src="/assets/logo.svg" alt="DIM TEAM logo"/></Link>
    {account&&<div className="welcome">Dobrodosli, <strong>{account.label}</strong></div>}
    <div className="search-wrap">{search&&<div className="search-panel"><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Pretrazi proizvode"/>{results.map(p=><Link key={p.id} href="/proizvodi"><strong>{p.name}</strong><span>{p.retail_price.toLocaleString("sr-RS")} RSD</span></Link>)}</div>}<button className="round" onClick={()=>setSearch(!search)} aria-label="Pretrazi"><Search/></button></div>
    <details className="profile"><summary aria-label="Profil"><UserRound/></summary><nav>{!account?<Link href="/login">Uloguj se</Link>:account.role==="admin"?<><Link href="/admin">Admin panel</Link><Link href="/admin/proizvodi">Upravljanje proizvodima</Link><Link href="/admin/veleprodaja">Veleprodaja</Link><Link href="/admin/nalozi">Nalozi i dozvole</Link><Link href="/admin/postojeci-nalozi">Postojeci nalozi</Link><button onClick={doLogout}>Odjavi se</button></>:account.role==="staff"?<><Link href="/staff">Panel zaposlenog</Link>{account.permissions.includes("manage_support")&&<Link href="/staff/podrska">Podrska chat</Link>}<button onClick={doLogout}>Odjavi se</button></>:<><Link href="/moj-nalog">Moj nalog</Link><Link href="/moje-cene">Moje veleprodajne cene</Link><Link href="/specijalni-zahtevi">Specijalni zahtevi</Link><Link href="/opcije">Opcije</Link><button onClick={doLogout}>Odjavi se</button></>}</nav></details>
    <Link className="cart" href="/proizvodi#korpa">Korpa <b>{cart.reduce((s,x)=>s+x.qty,0)}</b></Link>
  </header>;
}
