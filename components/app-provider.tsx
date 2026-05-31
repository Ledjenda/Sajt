"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { demoAccounts, demoProducts } from "@/lib/demo-data";
import type { DemoAccount, Product } from "@/lib/types";

type CartItem = { productId: string; qty: number };
type AppState = {
  account: DemoAccount | null; products: Product[]; cart: CartItem[];
  login: (username:string,password:string)=>DemoAccount|null; logout:()=>void;
  addToCart:(id:string)=>void; changeQty:(id:string,delta:number)=>void; removeFromCart:(id:string)=>void;
};
const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }:{ children:React.ReactNode }) {
  const [account,setAccount] = useState<DemoAccount|null>(null);
  const [products] = useState(demoProducts);
  const [cart,setCart] = useState<CartItem[]>([]);
  useEffect(()=>{ const key=localStorage.getItem("dimteam-demo-user"); if(key) setAccount(demoAccounts.find(a=>a.username===key) ?? null); const saved=localStorage.getItem("dimteam-demo-cart"); if(saved) setCart(JSON.parse(saved)); },[]);
  const persistCart=(next:CartItem[])=>{setCart(next);localStorage.setItem("dimteam-demo-cart",JSON.stringify(next));};
  const value=useMemo<AppState>(()=>({
    account,products,cart,
    login:(u,p)=>{const found=demoAccounts.find(a=>a.username===u&&a.password===p)??null;if(found){setAccount(found);localStorage.setItem("dimteam-demo-user",found.username);}return found;},
    logout:()=>{setAccount(null);localStorage.removeItem("dimteam-demo-user");},
    addToCart:(id)=>persistCart(cart.some(x=>x.productId===id)?cart.map(x=>x.productId===id?{...x,qty:x.qty+1}:x):[...cart,{productId:id,qty:1}]),
    changeQty:(id,delta)=>persistCart(cart.map(x=>x.productId===id?{...x,qty:x.qty+delta}:x).filter(x=>x.qty>0)),
    removeFromCart:(id)=>persistCart(cart.filter(x=>x.productId!==id))
  }),[account,cart,products]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useApp=()=>{const ctx=useContext(Ctx);if(!ctx)throw new Error("AppProvider missing");return ctx;};
