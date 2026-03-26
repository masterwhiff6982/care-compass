import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateEventSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  category: z.enum(["MEETUP", "ADOPTION_FAIR", "VACCINATION_CAMP", "TRAINING_WORKSHOP", "PET_SHOW", "OTHER"]).optional(),
  location: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  maxAttendees: z.number().int().positive().optional(),
  isFree: z.boolean().optional(),
  fee: z.number().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      creator: { select: { name: true, avatarUrl: true } },
      _count: { select: { rsvps: true } },
    },
  });

  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(event);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let userId: string | null = null;
  if (process.env.NODE_ENV === "development" && req.headers.get("x-test-user-id")) {
    userId = req.headers.get("x-test-user-id");
  } else {
    const authResult = await auth();
    userId = authResult.userId;
  }

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (event.creatorId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = updateEventSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const updated = await prisma.event.update({
    where: { id },
    data: {
      ...parsed.data,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : undefined,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let userId: string | null = null;
  if (process.env.NODE_ENV === "development" && req.headers.get("x-test-user-id")) {
    userId = req.headers.get("x-test-user-id");
  } else {
    const authResult = await auth();
    userId = authResult.userId;
  }

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (event.creatorId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
