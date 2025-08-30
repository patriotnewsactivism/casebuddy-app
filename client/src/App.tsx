import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import Dashboard from "@/pages/dashboard";
import Timeline from "@/pages/timeline";
import Documents from "@/pages/documents";
import Evidence from "@/pages/evidence";
import VideoEvidence from "@/pages/video-evidence";
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
      <Route path="/foia" component={FoiaRequests} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/search" component={Search} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen bg-background">
          <Sidebar />
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
