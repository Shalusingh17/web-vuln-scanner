"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Scan, AlertTriangle, CheckCircle, Download, LogOut } from "lucide-react";
import Link from "next/link";

type Severity = "info" | "success" | "warning" | "high" | "critical";

const severityBadge: Record<Severity, { label: string; className: string }> = {
  info: { label: "Info", className: "border-blue-500/30 bg-blue-500/10 text-blue-300" },
  success: { label: "Success", className: "border-green-500/30 bg-green-500/10 text-green-300" },
  warning: { label: "Warning", className: "border-yellow-500/30 bg-yellow-500/10 text-yellow-200" },
  high: { label: "High", className: "border-orange-500/30 bg-orange-500/10 text-orange-200" },
  critical: { label: "Critical", className: "border-red-500/30 bg-red-500/10 text-red-200" },
};

export default function ScanPage() {
  const { user, logout } = useAuth();
  const [url, setUrl] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logLines, setLogLines] = useState<Array<{ severity: Severity; text: string }>>([]);

  const canStart = useMemo(() => {
    try {
      if (!url) return false;
      // Basic URL validation
       
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }, [url]);

  useEffect(() => {
    // Read ?url= from landing link
    const params = new URLSearchParams(window.location.search);
    const target = params.get("url");
    if (!target) return;
    // Avoid cascading renders by scheduling state update
     
    queueMicrotask(() => setUrl(target));
  }, []);


  const runFakeScan = async () => {
    if (!canStart) return;

    setIsRunning(true);
    setProgress(0);
    setLogLines([]);

    const steps: Array<{ severity: Severity; delayMs: number; text: string; progress: number }> = [
      { severity: "info", delayMs: 300, text: `Starting scan → ${url}`, progress: 8 },
      { severity: "success", delayMs: 650, text: "TLS handshake verified", progress: 25 },
      { severity: "warning", delayMs: 900, text: "Missing header: Content-Security-Policy", progress: 42 },
      { severity: "high", delayMs: 900, text: "Potential XSS sink found: /search?q=…", progress: 63 },
      { severity: "critical", delayMs: 900, text: "SQLi pattern detected: /login?id=…", progress: 82 },
      { severity: "success", delayMs: 900, text: "Scan completed. Review report below.", progress: 100 },
    ];

    for (const step of steps) {
       
      await new Promise((r) => setTimeout(r, step.delayMs));
      setProgress(step.progress);
      setLogLines((prev) => [...prev, { severity: step.severity, text: step.text }]);

    }

    setIsRunning(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen overflow-x-hidden bg-slate-950 text-foreground">
        <Navbar />
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Scan Target</h1>
                  <p className="text-muted-foreground text-sm">Authenticated scan runner (local demo)</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground hidden sm:block">
                Signed in as <span className="text-primary">{user?.email}</span>
              </div>
              <Button variant="outline" onClick={logout} className="border-border">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          <Card className="border-cyan-500/20 bg-slate-900/50 shadow-lg shadow-cyan-500/5">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-9">
                    <label className="block text-xs text-muted-foreground mb-2">Target URL</label>
                    <Input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="bg-background"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <Button
                      className="w-full"
                      onClick={runFakeScan}
                      disabled={isRunning || !canStart}
                    >
                      <Scan className="mr-2 h-4 w-4" />
                      {isRunning ? "Scanning…" : "Start scan"}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className="text-xs text-muted-foreground font-mono">{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-cyan-500/20 bg-slate-900/50 shadow-lg shadow-cyan-500/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="font-semibold">Live Scan Output</h2>
                  <Badge variant="outline" className="ml-auto">Terminal</Badge>
                </div>

                <div className="font-mono text-sm space-y-2 h-72 overflow-auto pr-2">
                  {logLines.length === 0 ? (
                    <div className="text-muted-foreground">Run a scan to see streamed findings.</div>
                  ) : (
                    logLines.map((line, idx) => {
                      const sb = severityBadge[line.severity];
                      return (
                        <div key={idx} className="flex items-start gap-3">
                          <span className={`mt-0.5 text-[10px] uppercase tracking-wider border px-2 py-1 rounded ${sb.className}`}>
                            {sb.label}
                          </span>
                          <span>{line.text}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-cyan-500/20 bg-slate-900/50 shadow-lg shadow-cyan-500/5">
              <CardContent className="p-6">
                <h2 className="font-semibold mb-2">Report</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  This page provides a functional UX shell. Next phase will wire to backend scan engine.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-400" />
                      <span className="text-sm">Findings</span>
                    </div>
                    <Badge variant="secondary">{logLines.filter((l) => l.severity !== "info" && l.severity !== "success").length}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm">Status</span>
                    </div>
                    <Badge variant="secondary">{progress === 100 ? "Complete" : "Idle"}</Badge>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button variant="outline" disabled>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/dashboard">
                      Back to dashboard
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

