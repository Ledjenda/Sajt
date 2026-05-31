import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { canResetPasswords } from "@/lib/supabase/authorize";

export async function POST(request:Request){
  const {email}=await request.json();
  const supabase=createAdminClient();
  if(!supabase)return NextResponse.json({error:"Supabase is not configured"},{status:503});
  if(!await canResetPasswords())return NextResponse.json({error:"Forbidden"},{status:403});
  const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`});
  if(error)return NextResponse.json({error:error.message},{status:400});
  await supabase.from("password_reset_audit").insert({target_email:email,action:"reset_email"});
  return NextResponse.json({ok:true});
}
