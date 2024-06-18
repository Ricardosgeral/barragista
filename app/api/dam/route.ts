import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await currentUser();
    console.log(body);

    const userId = user?.id;
    if (!userId) {
      return new NextResponse("Unautorized", { status: 401 });
    }

    const dam = await db.dam.create({
      data: { ...body, userId },
    });

    return NextResponse.json(dam);
  } catch (error) {
    console.log("Error at /api/dam POST", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
