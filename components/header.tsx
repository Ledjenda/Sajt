"use client";
import Link from "next/link";
import { Menu, Search, UserRound } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useApp } from "./app-provider";

export function Header(){
  const {account,products,cart,logout}=useApp(); const router=useRouter(); const pathname=usePathname(); const [search,setSearch]=useState(false); const [q,setQ]=useState("");
  const menuRef=useRef<HTMLDetailsElement>(null); const profileRef=useRef<HTMLDetailsElement>(null); const searchRef=useRef<HTMLDivElement>(null);
  const results=q?products.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())).slice(0,10):[];
  const closeMenus=()=>{if(menuRef.current)menuRef.current.open=false;if(profileRef.current)profileRef.current.open=false;setSearch(false);};
  const doLogout=()=>{closeMenus();logout();router.push("/");};

  useEffect(()=>{closeMenus();},[pathname]);
  useEffect(()=>{
    const closeOnOutsideClick=(event:PointerEvent)=>{
      const target=event.target as Node;
      if(!menuRef.current?.contains(target)&&!profileRef.current?.contains(target)&&!searchRef.current?.contains(target))closeMenus();
    };
    document.addEventListener("pointerdown",closeOnOutsideClick);
    return()=>document.removeEventListener("pointerdown",closeOnOutsideClick);
  },[]);

  return <header className="topbar">
    <details ref={menuRef} className="menu" onToggle={e=>{if(e.currentTarget.open){if(profileRef.current)profileRef.current.open=false;setSearch(false);}}}><summary aria-label="Otvori meni"><Menu/></summary><nav onClick={closeMenus}><Link href="/">Pocetna strana</Link><Link href="/proizvodi">Proizvodi</Link><Link href="/login">Veleprodaja</Link><Link href="/o-nama">O nama</Link><Link href="/podrska">Podrska</Link><Link href="/kontakt">Kontakt</Link></nav></details>
    <Link className="brand" href="/" onClick={closeMenus}><img src="/assets/logo.svg" alt="DIM TEAM logo"/></Link>
    {account&&<div className="welcome">Dobrodosli, <strong>{account.label}</strong></div>}
    <div ref={searchRef} className="search-wrap">{search&&<div className="search-panel"><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Pretrazi proizvode"/>{results.map(p=><Link key={p.id} href="/proizvodi" onClick={closeMenus}><strong>{p.name}</strong><span>{p.retail_price.toLocaleString("sr-RS")} RSD</span></Link>)}</div>}<button className="round" onClick={()=>{if(!search){if(menuRef.current)menuRef.current.open=false;if(profileRef.current)profileRef.current.open=false;}setSearch(!search);}} aria-label="Pretrazi"><Search/></button></div>
    <details ref={profileRef} className="profile" onToggle={e=>{if(e.currentTarget.open){if(menuRef.current)menuRef.current.open=false;setSearch(false);}}}><summary aria-label="Profil"><UserRound/></summary><nav onClick={closeMenus}>{!account?<Link href="/login">Uloguj se</Link>:account.role==="admin"?<><Link href="/admin">Admin panel</Link><Link href="/admin/proizvodi">Upravljanje proizvodima</Link><Link href="/admin/veleprodaja">Veleprodaja</Link><Link href="/admin/nalozi">Nalozi i dozvole</Link><Link href="/admin/postojeci-nalozi">Postojeci nalozi</Link><button onClick={doLogout}>Odjavi se</button></>:account.role==="staff"?<><Link href="/staff">Panel zaposlenog</Link>{account.permissions.includes("manage_support")&&<Link href="/staff/podrska">Podrska chat</Link>}<button onClick={doLogout}>Odjavi se</button></>:<><Link href="/moj-nalog">Moj nalog</Link><Link href="/moje-cene">Moje veleprodajne cene</Link><Link href="/specijalni-zahtevi">Specijalni zahtevi</Link><Link href="/opcije">Opcije</Link><button onClick={doLogout}>Odjavi se</button></>}</nav></details>
    <Link className="cart" href="/proizvodi#korpa" onClick={closeMenus}>Korpa <b>{cart.reduce((s,x)=>s+x.qty,0)}</b></Link>
  </header>;
}
