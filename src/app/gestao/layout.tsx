import { managementEnabled } from "@/shared/lib/env";
import { notFound } from "next/navigation";

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!managementEnabled()) notFound();
  return children;
}
