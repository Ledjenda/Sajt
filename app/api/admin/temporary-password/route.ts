import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { canResetPasswords } from "@/lib/supabase/authorize";

export async function POST(request:Request){
  const {userId,temporaryPassword,email}=await request.json();
  const supabase=createAdminClient();
  if(!supabase)return NextResponse.json({error:"Supabase is not configured"},{status:503});
  if(!await canResetPasswords())return NextResponse.json({error:"Forbidden"},{status:403});
  if(!userId||!temporaryPassword||temporaryPassword.length<10)return NextResponse.json({error:"Privremena sifra mora imati najmanje 10 karaktera."},{status:400});
  const {error}=await supabase.auth.admin.updateUserById(userId,{password:temporaryPassword});
  if(error)return NextResponse.json({error:error.message},{status:400});
  await supabase.from("profiles").update({force_password_change:true}).eq("id",userId);
  await supabase.from("password_reset_audit").insert({target_email:email,action:"temporary_password"});
  return NextResponse.json({ok:true});
}
