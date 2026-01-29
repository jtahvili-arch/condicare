import { NextResponse } from "next/server";

// TODO: connect to DB; this is a placeholder
export async function POST() {
  return NextResponse.json({
    items: [
      { id: "1", title: "Lemon Chicken Salad" },
      { id: "2", title: "Tofu Coconut Curry" },
    ],
  });
}
