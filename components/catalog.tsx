"use client";
import { Grid2X2, List, Rows3 } from "lucide-react";
import { useState } from "react";
import { useApp } from "./app-provider";

export function Catalog(){
 const {products,addToCart,cart,changeQty,removeFromCart}=useApp(); const [view,setView]=useState("grid"); const [maker,setMaker]=useState(""); const [sort,setSort]=useState("");
 let shown=products.filter(p=>!maker||p.manufacturer===maker); if(sort==="asc")shown=[...shown].sort((a,b)=>a.retail_price-b.retail_price); if(sort==="desc")shown=[...shown].sort((a,b)=>b.retail_price-a.retail_price);
 return <><section className="catalog-bar"><label>Proizvodjac <select value={maker} onChange={e=>setMaker(e.target.value)}><option value="">Svi</option>{[...new Set(products.map(p=>p.manufacturer))].map(x=><option key={x}>{x}</option>)}</select></label><div className="views"><button onClick={()=>setView("grid")}><Grid2X2/></button><button onClick={()=>setView("compact")}><List/></button><button onClick={()=>setView("detail")}><Rows3/></button></div><label>Sortiranje <select value={sort} onChange={e=>setSort(e.target.value)}><option value="">Preporuceno</option><option value="asc">Cena rastuce</option><option value="desc">Cena opadajuce</option></select></label></section>
 <div className={`products ${view}`}>{shown.map(p=><article className="product" key={p.id}><div className="swatch"/><div><small>{p.category} | {p.manufacturer}</small><h3>{p.name}</h3><p>{p.description}</p><strong>{p.retail_price.toLocaleString("sr-RS")} RSD</strong><button className="button primary" onClick={()=>addToCart(p.id)}>Dodaj u korpu</button></div></article>)}</div>
 <section id="korpa" className="panel cart-panel"><h2>Korpa</h2>{cart.length?cart.map(x=>{const p=products.find(p=>p.id===x.productId)!;return <div className="cart-row" key={x.productId}><span>{p.name}</span><span>{p.retail_price.toLocaleString("sr-RS")} RSD</span><div><button onClick={()=>changeQty(x.productId,-1)}>-</button><b>{x.qty}</b><button onClick={()=>changeQty(x.productId,1)}>+</button><button onClick={()=>removeFromCart(x.productId)}>Obrisi</button></div></div>}):<p>Korpa je prazna.</p>}<button className="button primary">Posalji porudzbinu</button></section></>;
}
