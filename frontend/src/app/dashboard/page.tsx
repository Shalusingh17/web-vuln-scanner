"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Scan,
  AlertTriangle,
  CheckCircle,
  LogOut,
  AlertCircle,
  TrendingUp,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

type Severity = "low" | "medium" | "high" | "critical";

interface Finding {
  type: string;
  severity: Severity;
  message: string;
  details?: Record<string, any>;
}

interface ScanResult {
  _id: string;
  url: string;
  status: "pending" | "running" | "completed" | "failed";
  riskScore: number;
  findings: Finding[];
  createdAt: string;
}

const severityColors: Record<Severity, string> = {
  low: "text-blue-400 bg-blue-950 border-blue-700",
  medium: "text-yellow-400 bg-yellow-950 border-yellow-700",
  high: "text-orange-400 bg-orange-950 border-orange-700",
  critical: "text-red-400 bg-red-950 border-red-700",
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [isLoadingScans, setIsLoadingScans] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);

  const canStartScan = useMemo(() => {
    if (!url.trim() || isScanning) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }, [url, isScanning]);

  // Load recent scans on mount
  useEffect(() => {
    const loadScans = async () => {
      try {
        const res = await fetch("/api/scans", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (res.ok && data.scans) {
          setRecentScans(data.scans);
        }
      } catch (err) {
        console.error("Failed to load scans:", err);
      } finally {
        setIsLoadingScans(false);
      }
    };

    loadScans();
  }, []);

  const handleStartScan = async () => {
    if (!canStartScan) return;

    setIsScanning(true);
    setError(null);
    setCurrentScan(null);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Scan failed");
        setIsScanning(false);
        return;
      }

      setCurrentScan(data.scan);
      setRecentScans([data.scan, ...recentScans.slice(0, 9)]);
      setUrl("");
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const getRiskLevel = (score: number): Severity => {
    if (score >= 80) return "critical";
    if (score >= 60) return "high";
    if (score >= 40) return "medium";
    return "low";
  };

  const getSeverityCount = (findings: Finding[], sev: Severity) => {
    return findings.filter(f => f.severity === sev).length;
  };

  const displayScan = selectedScan || currentScan;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050a0e] to-[#0a0f15] text-[#c8ffc8] p-4 md:p-8">
      {/* Header with branding */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[rgba(0,255,65,0.1)] border border-[rgba(0,255,65,0.3)] rounded flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#00ff41]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#00ff41] font-mono tracking-wider">VulnScanner</h1>
              <p className="text-sm text-[rgba(0,255,65,0.5)] font-mono">Web Security Analysis Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-[rgba(0,255,65,0.6)]">{user?.name}</p>
              <p className="text-xs text-[rgba(0,255,65,0.4)] font-mono">{user?.email}</p>
            </div>
            <Button
              onClick={logout}
              className="bg-[rgba(255,60,60,0.08)] hover:bg-[rgba(255,60,60,0.14)] border border-[rgba(255,60,60,0.35)] text-[rgba(255,100,100,0.9)]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Scan Input Card */}
        <Card className="bg-[rgba(8,18,24,0.6)] border-[rgba(0,255,65,0.2)] mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-mono text-[rgba(0,255,65,0.5)] mb-2 tracking-wider uppercase">
                  Target Website URL
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(0,255,65,0.35)]">🔗</span>
                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="pl-10 bg-[rgba(0,255,65,0.03)] border-[rgba(0,255,65,0.15)] text-[#c8ffc8] placeholder-[rgba(0,255,65,0.18)]"
                    disabled={isScanning}
                  />
                </div>
              </div>
              <Button
                onClick={handleStartScan}
                disabled={!canStartScan || isScanning}
                className="bg-[rgba(0,255,65,0.08)] hover:bg-[rgba(0,255,65,0.14)] border border-[rgba(0,255,65,0.35)] text-[#00ff41] font-mono tracking-wider md:w-auto w-full"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4 mr-2" />
                    Start Scan
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-[rgba(255,60,60,0.08)] border border-[rgba(255,60,60,0.3)] rounded text-sm text-[rgba(255,100,100,0.9)] font-mono">
                ⚠ {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Results Display */}
        {displayScan && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Risk Score */}
            <Card className="bg-[rgba(8,18,24,0.6)] border-[rgba(0,255,65,0.2)] lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-mono text-[rgba(0,255,65,0.5)] tracking-wider">
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-4 mb-4 ${
                    displayScan.riskScore >= 80 ? "border-red-500 bg-red-950/20" :
                    displayScan.riskScore >= 60 ? "border-orange-500 bg-orange-950/20" :
                    displayScan.riskScore >= 40 ? "border-yellow-500 bg-yellow-950/20" :
                    "border-green-500 bg-green-950/20"
                  }`}>
                    <span className="text-4xl font-bold font-mono">{displayScan.riskScore}</span>
                  </div>
                  <p className="text-xs text-[rgba(0,255,65,0.4)] font-mono mb-2">Risk Score</p>
                  <Badge className={`${severityColors[getRiskLevel(displayScan.riskScore)]} border`}>
                    {getRiskLevel(displayScan.riskScore).toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {(["critical", "high", "medium", "low"] as Severity[]).map((sev) => {
                    const count = getSeverityCount(displayScan.findings, sev);
                    if (count === 0) return null;
                    return (
                      <div key={sev} className="flex items-center justify-between text-sm">
                        <span className="text-xs capitalize text-[rgba(0,255,65,0.5)]">{sev}</span>
                        <Badge variant="outline" className={severityColors[sev]}>
                          {count}
                        </Badge>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-[rgba(0,255,65,0.1)]">
                  <p className="text-xs text-[rgba(0,255,65,0.4)] font-mono">Scanned URL</p>
                  <p className="text-xs text-[#00ff41] font-mono break-all mt-1">{displayScan.url}</p>
                  <p className="text-xs text-[rgba(0,255,65,0.3)] font-mono mt-2">
                    {new Date(displayScan.createdAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Right Columns - Findings */}
            <Card className="bg-[rgba(8,18,24,0.6)] border-[rgba(0,255,65,0.2)] lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-mono text-[rgba(0,255,65,0.5)] tracking-wider">
                  Vulnerability Findings ({displayScan.findings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {displayScan.findings.length === 0 ? (
                    <p className="text-sm text-[rgba(0,255,65,0.4)] text-center py-8">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      No vulnerabilities detected
                    </p>
                  ) : (
                    displayScan.findings.map((finding, idx) => (
                      <div
                        key={idx}
                        className={`p-3 border rounded text-sm font-mono ${severityColors[finding.severity]}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-xs uppercase tracking-wider mb-1 font-bold">
                              {finding.type.replace(/_/g, " ")}
                            </p>
                            <p className="text-xs opacity-90">{finding.message}</p>
                            {finding.details && (
                              <p className="text-xs opacity-60 mt-1">
                                {JSON.stringify(finding.details).substring(0, 100)}...
                              </p>
                            )}
                          </div>
                          <Badge
                            variant="outline"
                            className={`${severityColors[finding.severity]} whitespace-nowrap text-xs`}
                          >
                            {finding.severity}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Scans List */}
        {!isLoadingScans && recentScans.length > 0 && (
          <Card className="bg-[rgba(8,18,24,0.6)] border-[rgba(0,255,65,0.2)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono text-[rgba(0,255,65,0.5)] tracking-wider">
                Recent Scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {recentScans.map((scan) => (
                  <div
                    key={scan._id}
                    onClick={() => setSelectedScan(scan)}
                    className={`p-3 border rounded cursor-pointer transition-all ${
                      selectedScan?._id === scan._id
                        ? "bg-[rgba(0,255,65,0.1)] border-[rgba(0,255,65,0.4)]"
                        : "bg-[rgba(8,18,24,0.3)] border-[rgba(0,255,65,0.1)] hover:border-[rgba(0,255,65,0.3)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono text-[#00ff41] truncate">{scan.url}</p>
                        <p className="text-xs text-[rgba(0,255,65,0.3)] font-mono">
                          {new Date(scan.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <Badge
                          variant="outline"
                          className={`${severityColors[getRiskLevel(scan.riskScore)]} border text-xs`}
                        >
                          Score: {scan.riskScore}
                        </Badge>
                        <Badge variant="outline" className="border-[rgba(0,255,65,0.3)] text-[rgba(0,255,65,0.6)] text-xs">
                          {scan.findings.length} findings
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
