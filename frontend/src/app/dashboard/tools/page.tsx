"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/AuthContext";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Server, Network, ShieldAlert, CheckCircle, Search } from "lucide-react";
import { toast } from "sonner";

export default function NetworkToolsPage() {
  const { token } = useAuth();
  
  // Tab State
  const [activeTab, setActiveTab] = useState<"dns" | "portscan">("dns");

  // DNS State
  const [dnsTarget, setDnsTarget] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const [dnsRecords, setDnsRecords] = useState<{ type: string; value: string }[] | null>(null);

  // Port Scan State
  const [portTarget, setPortTarget] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [portResults, setPortResults] = useState<{ port: number; status: string }[] | null>(null);

  const runDnsLookup = async () => {
    if (!dnsTarget.trim()) {
      toast.error("Please enter a domain");
      return;
    }
    setIsResolving(true);
    setDnsRecords(null);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/tools/dns", {
        method: "POST",
        headers,
        body: JSON.stringify({ target: dnsTarget }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "DNS lookup failed");
      
      setDnsRecords(data.records);
      toast.success("DNS lookup completed");
    } catch (err: any) {
      toast.error(err.message || "Failed to resolve DNS");
    } finally {
      setIsResolving(false);
    }
  };

  const runPortScan = async () => {
    if (!portTarget.trim()) {
      toast.error("Please enter a target IP or domain");
      return;
    }
    setIsScanning(true);
    setPortResults(null);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/tools/portscan", {
        method: "POST",
        headers,
        body: JSON.stringify({ target: portTarget }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Port scan failed");
      
      setPortResults(data.results);
      toast.success("Port scan completed");
    } catch (err: any) {
      toast.error(err.message || "Failed to scan ports");
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
                <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                  <Network className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Network Tools</h1>
                  <p className="text-muted-foreground text-sm">Lightweight reconnaissance and discovery</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("dns")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "dns" 
                  ? "border-cyan-500 text-cyan-400" 
                  : "border-transparent text-muted-foreground hover:text-slate-300"
              }`}
            >
              <Globe className="inline-block mr-2 h-4 w-4" />
              DNS Resolver
            </button>
            <button
              onClick={() => setActiveTab("portscan")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "portscan" 
                  ? "border-cyan-500 text-cyan-400" 
                  : "border-transparent text-muted-foreground hover:text-slate-300"
              }`}
            >
              <Server className="inline-block mr-2 h-4 w-4" />
              TCP Port Scanner
            </button>
          </div>

          <div className="mt-4">
            {activeTab === "dns" && (
              <Card className="glass border-cyan-500/20 shadow-lg shadow-cyan-500/5 transition-all duration-300 hover:border-cyan-500/50">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-3">
                    <Input
                      placeholder="example.com"
                      value={dnsTarget}
                      onChange={(e) => setDnsTarget(e.target.value)}
                      className="bg-slate-950/70 border-cyan-500/25 text-white font-mono placeholder:text-gray-600 focus-visible:ring-cyan-500/50 h-11"
                      onKeyDown={(e) => e.key === "Enter" && runDnsLookup()}
                    />
                    <AnimatedButton onClick={runDnsLookup} disabled={isResolving} glowing variant="primary" className="md:w-32 h-11">
                      {isResolving ? <Search className="animate-pulse h-4 w-4" /> : "Resolve"}
                    </AnimatedButton>
                  </div>

                  <div className="mt-8">
                    {!dnsRecords ? (
                      <div className="text-center py-10 text-muted-foreground">
                        Enter a domain to resolve its A, AAAA, MX, TXT, and NS records.
                      </div>
                    ) : dnsRecords.length === 0 ? (
                      <div className="text-center py-10 text-yellow-500">
                        No records found for this domain.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs uppercase bg-slate-950 text-muted-foreground">
                            <tr>
                              <th className="px-4 py-3 rounded-tl-lg">Type</th>
                              <th className="px-4 py-3 rounded-tr-lg">Value</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {dnsRecords.map((record, i) => (
                              <tr key={i} className="hover:bg-slate-900/50 transition-colors">
                                <td className="px-4 py-3 font-mono font-bold text-cyan-400 w-24">{record.type}</td>
                                <td className="px-4 py-3 font-mono text-slate-300 break-all">{record.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "portscan" && (
              <Card className="glass border-cyan-500/20 shadow-lg shadow-cyan-500/5 transition-all duration-300 hover:border-cyan-500/50">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-3">
                    <Input
                      placeholder="IP address or domain"
                      value={portTarget}
                      onChange={(e) => setPortTarget(e.target.value)}
                      className="bg-slate-950/70 border-cyan-500/25 text-white font-mono placeholder:text-gray-600 focus-visible:ring-cyan-500/50 h-11"
                      onKeyDown={(e) => e.key === "Enter" && runPortScan()}
                    />
                    <AnimatedButton onClick={runPortScan} disabled={isScanning} glowing variant="primary" className="md:w-32 h-11">
                      {isScanning ? <Search className="animate-pulse h-4 w-4" /> : "Scan Ports"}
                    </AnimatedButton>
                  </div>

                  <div className="mt-8">
                    {!portResults ? (
                      <div className="text-center py-10 text-muted-foreground">
                        Enter a target to sweep the top 20 most critical TCP ports.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {portResults.map((r, i) => (
                          <div 
                            key={i} 
                            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                              r.status === 'open' 
                                ? 'border-red-500/30 bg-red-500/10 hover:cyber-border-glow' 
                                : 'border-emerald-500/10 bg-emerald-500/5 opacity-50'
                            }`}
                          >
                            <span className={`font-mono text-lg font-bold ${r.status === 'open' ? 'text-red-400' : 'text-emerald-400'}`}>
                              {r.port}
                            </span>
                            <Badge variant="outline" className={r.status === 'open' ? 'text-red-400 border-red-500/30' : 'text-emerald-500 border-emerald-500/30'}>
                              {r.status.toUpperCase()}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
