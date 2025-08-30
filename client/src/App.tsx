import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Dashboard from "@/pages/dashboard";
import Timeline from "@/pages/timeline";
import Documents from "@/pages/documents";
import Evidence from "@/pages/evidence";
import VideoEvidence from "@/pages/video-evidence";
import Motions from "@/pages/motions";
import Deadlines from "@/pages/deadlines";
import FoiaRequests from "@/pages/foia";
import Analytics from "@/pages/analytics";
import Search from "@/pages/search";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/timeline" component={Timeline} />
      <Route path="/documents" component={Documents} />
      <Route path="/evidence" component={Evidence} />
      <Route path="/video-evidence" component={VideoEvidence} />
      <Route path="/motions" component={Motions} />
      <Route path="/deadlines" component={Deadlines} />
      <Route path="/foia" component={FoiaRequests} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/search" component={Search} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const isMobile = useIsMobile();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen bg-background">
          <Sidebar />
          <main className={`flex-1 overflow-hidden ${isMobile ? 'pl-0' : ''}`}>
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
