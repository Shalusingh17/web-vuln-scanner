"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/AuthContext";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Box, Scan, AlertTriangle, CheckCircle, UploadCloud } from "lucide-react";
import { toast } from "sonner";

type Severity = "info" | "success" | "medium" | "high" | "critical";

interface Finding {
  type: string;
  severity: Severity;
  message: string;
  recommendation: string;
}

const severityBadge: Record<Severity, { label: string; className: string }> = {
  info: { label: "Info", className: "border-blue-500/30 bg-blue-500/10 text-blue-300" },
  success: { label: "Success", className: "border-green-500/30 bg-green-500/10 text-green-300" },
  medium: { label: "Medium", className: "border-yellow-500/30 bg-yellow-500/10 text-yellow-200" },
  high: { label: "High", className: "border-orange-500/30 bg-orange-500/10 text-orange-200" },
  critical: { label: "Critical", className: "border-red-500/30 bg-red-500/10 text-red-200" },
};

export default function ContainerScanPage() {
  const { token } = useAuth();
  const [dockerfile, setDockerfile] = useState(`FROM node:latest\n\nWORKDIR /app\nCOPY . .\nRUN npm install\n\nENV API_KEY=secret_12345\n\nEXPOSE 22\nCMD ["npm", "start"]`);
  const [isScanning, setIsScanning] = useState(false);
  const [findings, setFindings] = useState<Finding[] | null>(null);
  const [grade, setGrade] = useState<string | null>(null);

  const runScan = async () => {
    if (!dockerfile.trim()) {
      toast.error("Please enter a Dockerfile to scan");
      return;
    }

    setIsScanning(true);
    setFindings(null);
    setGrade(null);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/scan/dockerfile", {
        method: "POST",
        headers,
        body: JSON.stringify({ dockerfile }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Scan failed");
      }

      setFindings(data.findings);
      setGrade(data.grade);
      toast.success("Container scan completed");
    } catch (err: any) {
      toast.error(err.message || "Failed to scan container");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen overflow-x-hidden bg-background text-foreground bg-grid-pattern">
        <Navbar />
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                  <Box className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Container Security</h1>
                  <p className="text-muted-foreground text-sm">Scan Dockerfiles for vulnerabilities and hardening</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Col - Editor */}
            <Card className="glass border-indigo-500/20 shadow-lg shadow-indigo-500/5 transition-all duration-300 hover:border-indigo-500/50 h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold flex items-center gap-2">
                    <UploadCloud className="h-4 w-4" /> Dockerfile
                  </h2>
                  <AnimatedButton
                    size="sm"
                    variant="primary"
                    glowing
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={runScan}
                    disabled={isScanning}
                  >
                    <Scan className="mr-2 h-4 w-4" />
                    {isScanning ? "Scanning..." : "Audit Image"}
                  </AnimatedButton>
                </div>

                <textarea
                  className="w-full flex-1 min-h-[400px] p-4 bg-slate-950/70 border border-indigo-500/25 rounded-md font-mono text-sm text-slate-300 resize-y focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  value={dockerfile}
                  onChange={(e) => setDockerfile(e.target.value)}
                  placeholder="Paste your Dockerfile contents here..."
                  spellCheck="false"
                />
              </CardContent>
            </Card>

            {/* Right Col - Results */}
            <Card className="glass border-indigo-500/20 shadow-lg shadow-indigo-500/5 transition-all duration-300 hover:border-indigo-500/50 h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Audit Results
                </h2>

                {!findings ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground space-y-3">
                    <Box className="h-12 w-12 opacity-20" />
                    <p>Paste your Dockerfile and click Audit Image to view security findings and remediation advice.</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-auto pr-2 space-y-6">
                    <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-lg border border-border">
                      <div className={`text-4xl font-black font-mono ${
                        grade === 'A' ? 'text-green-500' :
                        grade === 'B' ? 'text-blue-500' :
                        grade === 'D' ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {grade}
                      </div>
                      <div>
                        <div className="font-bold">Security Grade</div>
                        <div className="text-sm text-muted-foreground">
                          {findings.length === 0 
                            ? "Perfect! Your image is hardened." 
                            : `${findings.length} findings to review`}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {findings.length === 0 ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="h-5 w-5" />
                          <span>No vulnerabilities detected. Good job!</span>
                        </div>
                      ) : (
                        findings.map((finding, idx) => {
                          const sb = severityBadge[finding.severity];
                          return (
                            <div key={idx} className="bg-slate-950/60 p-4 rounded-lg border border-border space-y-2 hover:cyber-border-glow transition-all">
                              <div className="flex items-start justify-between gap-2">
                                <span className={`text-[10px] uppercase tracking-wider border px-2 py-0.5 rounded ${sb.className}`}>
                                  {sb.label}
                                </span>
                                <span className="text-xs font-mono text-muted-foreground">{finding.type}</span>
                              </div>
                              <p className="text-sm font-medium">{finding.message}</p>
                              <div className="bg-slate-900/50 p-2 rounded text-xs text-slate-300 border border-slate-800">
                                <strong className="text-indigo-400">Fix: </strong>
                                {finding.recommendation}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
