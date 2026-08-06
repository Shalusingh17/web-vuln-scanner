"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import {
  Shield,
  Scan,
  CheckCircle,
  LogOut,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { parseResponseJson } from "@/lib/parseResponseJson";

type Severity = "low" | "medium" | "high" | "critical";

interface Finding {
  type: string;
  severity: Severity;
  message: string;
  details?: Record<string, unknown>;
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
  low: "text-blue-400 bg-blue-950/40 border-blue-600/50",
  medium: "text-yellow-400 bg-yellow-950/40 border-yellow-600/50",
  high: "text-orange-400 bg-orange-950/40 border-orange-600/50",
  critical: "text-red-400 bg-red-950/40 border-red-600/50",
};

const cardClass = "border-cyan-500/20 bg-slate-900/50 shadow-lg shadow-cyan-500/5";

export default function DashboardPage() {
  const { user, token, logout } = useAuth();

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

  useEffect(() => {
    const loadScans = async () => {
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch("/api/scans", {
          method: "GET",
          headers,
        });
        const parsed = await parseResponseJson<{ scans?: ScanResult[] }>(res);
        if (
          res.ok &&
          parsed.ok &&
          parsed.data.scans &&
          Array.isArray(parsed.data.scans)
        ) {
          setRecentScans(parsed.data.scans);
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
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/scan", {
        method: "POST",
        headers,
        body: JSON.stringify({ url: url.trim() }),
      });

      const parsed = await parseResponseJson<{
        message?: string;
        scan?: ScanResult;
      }>(res);

      if (!res.ok) {
        const msg = parsed.ok
          ? (parsed.data.message ?? "Scan failed")
          : parsed.message;
        setError(msg);
        return;
      }

      if (!parsed.ok || !parsed.data.scan) {
        setError(
          !parsed.ok
            ? parsed.message
            : "Unexpected response from server."
        );
        return;
      }

      setCurrentScan(parsed.data.scan);
      setRecentScans([parsed.data.scan, ...recentScans.slice(0, 9)]);
      setUrl("");
    } catch {
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
    return findings.filter((f) => f.severity === sev).length;
  };

  const displayScan = selectedScan || currentScan;

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-foreground">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 shadow-lg shadow-cyan-500/10">
              <Shield className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                Security dashboard
              </h1>
              <p className="text-sm text-gray-400">
                Run scans and review risk in one place — same look as the rest
                of VulnScanner.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                variant="outline"
                className="border-fuchsia-500/30 bg-slate-900/40 text-fuchsia-300 hover:bg-fuchsia-500/10 hover:text-fuchsia-200"
              >
                <Link href="/dashboard/sca">Dependency Scanner</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-indigo-500/30 bg-slate-900/40 text-indigo-300 hover:bg-indigo-500/10 hover:text-indigo-200"
              >
                <Link href="/dashboard/container">Container Security</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-emerald-500/30 bg-slate-900/40 text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-200"
              >
                <Link href="/dashboard/tools">Network Tools</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-cyan-500/30 bg-slate-900/40 text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200"
              >
                <Link href="/dashboard/scan">Open scan runner</Link>
              </Button>
            <div className="hidden text-right sm:block md:mr-2">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="max-w-[220px] truncate text-xs text-gray-500">
                {user?.email}
              </p>
            </div>
            <Button
              onClick={() => logout()}
              variant="outline"
              className="border-red-500/30 text-red-300 hover:bg-red-500/10 hover:text-red-200"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>

        <Card className={`${cardClass} mb-8`}>
          <CardContent className="p-6">
            <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-end">
              <div className="flex-1 min-w-0">
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-400">
                  Target website URL
                </label>
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="h-11 border-cyan-500/25 bg-slate-950/50 text-white placeholder:text-gray-500"
                  disabled={isScanning}
                />
              </div>
              <Button
                onClick={handleStartScan}
                disabled={!canStartScan || isScanning}
                className="h-11 w-full bg-gradient-to-r from-cyan-500 to-blue-500 font-semibold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-400 md:w-auto"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning…
                  </>
                ) : (
                  <>
                    <Scan className="mr-2 h-4 w-4" />
                    Start scan
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200"
              >
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {displayScan && (
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className={`${cardClass} lg:col-span-1`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-300">
                  Risk assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6 text-center">
                  <div
                    className={`mb-4 inline-flex h-32 w-32 items-center justify-center rounded-full border-4 ${
                      displayScan.riskScore >= 80
                        ? "border-red-500 bg-red-950/20"
                        : displayScan.riskScore >= 60
                          ? "border-orange-500 bg-orange-950/20"
                          : displayScan.riskScore >= 40
                            ? "border-yellow-500 bg-yellow-950/20"
                            : "border-emerald-500 bg-emerald-950/20"
                    }`}
                  >
                    <span className="text-4xl font-bold text-white">
                      {displayScan.riskScore}
                    </span>
                  </div>
                  <p className="mb-2 text-xs text-gray-500">Risk score</p>
                  <Badge
                    className={`${severityColors[getRiskLevel(displayScan.riskScore)]} border font-mono text-[10px]`}
                  >
                    {getRiskLevel(displayScan.riskScore).toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {(["critical", "high", "medium", "low"] as Severity[]).map(
                    (sev) => {
                      const count = getSeverityCount(
                        displayScan.findings,
                        sev
                      );
                      if (count === 0) return null;
                      return (
                        <div
                          key={sev}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-xs capitalize text-gray-400">
                            {sev}
                          </span>
                          <Badge
                            variant="outline"
                            className={severityColors[sev]}
                          >
                            {count}
                          </Badge>
                        </div>
                      );
                    }
                  )}
                </div>

                <div className="mt-6 border-t border-cyan-500/10 pt-6">
                  <p className="text-xs text-gray-500">Scanned URL</p>
                  <p className="mt-1 break-all text-xs text-cyan-300">
                    {displayScan.url}
                  </p>
                  <p className="mt-2 text-xs text-gray-600">
                    {new Date(displayScan.createdAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className={`${cardClass} lg:col-span-2`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-300">
                  Vulnerability findings ({displayScan.findings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
                  {displayScan.findings.length === 0 ? (
                    <p className="flex flex-col items-center py-8 text-center text-sm text-gray-500">
                      <CheckCircle className="mb-2 h-8 w-8 opacity-40" />
                      No vulnerabilities detected
                    </p>
                  ) : (
                    displayScan.findings.map((finding, idx) => (
                      <div
                        key={idx}
                        className={`rounded-lg border p-3 text-sm ${severityColors[finding.severity]}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="mb-1 text-xs font-bold uppercase tracking-wider">
                              {finding.type.replace(/_/g, " ")}
                            </p>
                            <p className="text-xs opacity-90">
                              {finding.message}
                            </p>
                            {finding.details && (
                              <p className="mt-1 text-xs opacity-60">
                                {JSON.stringify(finding.details).substring(0, 100)}
                                …
                              </p>
                            )}
                          </div>
                          <Badge
                            variant="outline"
                            className={`${severityColors[finding.severity]} shrink-0 whitespace-nowrap text-[10px]`}
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

        {!isLoadingScans && recentScans.length > 0 && (
          <Card className={cardClass}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-300">
                Recent scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {recentScans.map((scan) => (
                  <button
                    key={scan._id}
                    type="button"
                    onClick={() => setSelectedScan(scan)}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      selectedScan?._id === scan._id
                        ? "border-cyan-500/50 bg-cyan-500/10"
                        : "border-cyan-500/15 bg-slate-950/40 hover:border-cyan-500/35"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-cyan-200">
                          {scan.url}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(scan.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`${severityColors[getRiskLevel(scan.riskScore)]} border text-[10px]`}
                        >
                          {scan.riskScore}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-cyan-500/25 text-[10px] text-gray-400"
                        >
                          {scan.findings.length} findings
                        </Badge>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
