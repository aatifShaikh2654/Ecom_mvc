'use client'
import Link from "next/link";
import { usePathname } from "next/navigation"; // Next.js 13+

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  const dashboardIndex = segments.indexOf("dashboard");

  const breadcrumbsSegments = dashboardIndex >= 0 ? segments.slice(dashboardIndex) : [];


  return (
    <header
      className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)]"
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

        <nav aria-label="Breadcrumb" className="flex items-center text-sm text-muted-foreground">
          {/* Always show Dashboard root breadcrumb */}
          <Link href="/admin/dashboard" className="hover:underline font-semibold">
            Dashboard
          </Link>

          {breadcrumbsSegments.length > 1 && (
            <>
              <span className="mx-2 select-none">/</span>

              {breadcrumbsSegments.slice(1).map((segment, i) => {
                const href = "/dashboard/" + breadcrumbsSegments.slice(1, i + 2).join("/");
                const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
                const isLast = i === breadcrumbsSegments.length - 2;

                return (
                  <span key={href} className="flex items-center">
                    {i !== 0 && <span className="mx-2 select-none">/</span>}
                    {isLast ? (
                      <span aria-current="page" className="font-semibold">
                        {label}
                      </span>
                    ) : (
                      <Link href={"/admin" + href} className="hover:underline">
                        {label}
                      </Link>
                    )}
                  </span>
                );
              })}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
