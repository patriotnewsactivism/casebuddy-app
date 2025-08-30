import { cn } from "@/lib/utils";
import { Shield, ChartPie, Clock, FolderOpen, Camera, FileText, BarChart, Search, Highlighter, Download, Video } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { CASE_STATS, FOIA_REQUESTS } from "@/lib/case-data";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();

  const pendingFoiaCount = FOIA_REQUESTS.filter(r => r.status === "pending").length;

  const navItems = [
    {
      title: "CASE OVERVIEW",
      items: [
        { href: "/", label: "Dashboard", icon: ChartPie },
        { href: "/timeline", label: "Timeline", icon: Clock },
        { href: "/documents", label: "Documents", icon: FolderOpen },
        { href: "/evidence", label: "Evidence Gallery", icon: Camera },
        { href: "/video-evidence", label: "Video Evidence", icon: Video },
      ]
    },
    {
      title: "CASE MANAGEMENT",
      items: [
        { href: "/foia", label: "FOIA Requests", icon: FileText, badge: pendingFoiaCount },
        { href: "/analytics", label: "Analytics", icon: BarChart },
        { href: "/search", label: "Advanced Search", icon: Search },
      ]
    },
    {
      title: "LEGAL TOOLS",
      items: [
        { href: "/annotations", label: "Annotations", icon: Highlighter },
        { href: "/export", label: "Export Reports", icon: Download },
      ]
    }
  ];

  return (
    <aside className={cn(
      "w-80 bg-sidebar border-r border-sidebar-border overflow-y-auto sidebar-nav",
      className
    )}>
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Shield className="text-sidebar-primary-foreground w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">Case Intelligence Portal</h1>
            <p className="text-sm text-sidebar-foreground/70">Legal Evidence Management</p>
          </div>
        </div>
        
        <div className="bg-sidebar-primary/10 border border-sidebar-primary/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="text-sidebar-primary w-4 h-4" />
            <span className="font-semibold text-sm text-sidebar-foreground">Active Case</span>
          </div>
          <p className="text-xs text-sidebar-foreground/70">Federal Civil Rights Violation</p>
          <p className="text-xs text-sidebar-foreground/70">Case ID: 2025-CV-8901</p>
        </div>
      </div>

      <nav className="p-4 space-y-6">
        {navItems.map((section) => (
          <div key={section.title} className="space-y-2">
            <div className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-3">
              {section.title}
            </div>
            {section.items.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
                  )}>
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border mt-auto">
        <div className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-3">
          CASE STATISTICS
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-sidebar-foreground/70">Documents</span>
            <span className="font-semibold text-sidebar-foreground">{CASE_STATS.totalDocuments}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sidebar-foreground/70">Evidence Items</span>
            <span className="font-semibold text-sidebar-foreground">{CASE_STATS.evidenceItems}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sidebar-foreground/70">Timeline Events</span>
            <span className="font-semibold text-sidebar-foreground">{CASE_STATS.timelineEvents}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sidebar-foreground/70">FOIA Requests</span>
            <span className="font-semibold text-sidebar-foreground">{CASE_STATS.foiaRequests}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
