import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Layout from "@/components/layout/Layout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return <Layout>{children}</Layout>;
}
