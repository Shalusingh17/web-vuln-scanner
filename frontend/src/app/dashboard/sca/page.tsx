"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PackageSearch, ShieldAlert, CheckCircle, Search, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Vuln {
  id: string;
  summary: string;
  details: string;
  severity: string;
  references: string[];
}

interface Finding {
  package: string;
  version: string;
  vulnerable: boolean;
  vulns?: Vuln[];
}

export default function SCAPage() {
  const { token } = useAuth();
  const [packageJson, setPackageJson] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<{
    scannedCount: number;
    vulnerableCount: number;
    findings: Finding[];
  } | null>(null);

  const handleScan = async () => {
    if (!packageJson.trim()) {
      toast.error("Please paste your package.json contents");
      return;
    }

    try {
      JSON.parse(packageJson);
    } catch (e) {
      toast.error("Invalid JSON format");
      return;
    }

    setIsScanning(true);
    setResults(null);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/scan/dependencies", {
        method: "POST",
        headers,
        body: JSON.stringify({ packageJson }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "SCA Scan failed");
      
      setResults(data);
      if (data.vulnerableCount > 0) {
        toast.error(`Found ${data.vulnerableCount} vulnerable packages`);
      } else {
        toast.success("No known vulnerabilities found!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to scan dependencies");
    } finally {
      setIsScanning(false);
    }
  };

  const loadExample = () => {
    const example = {
      "name": "example-vulnerable-app",
      "version": "1.0.0",
      "dependencies": {
        "express": "^4.17.1",
        "lodash": "4.17.20",
        "axios": "0.21.1",
        "react": "^18.2.0"
      }
    };
    setPackageJson(JSON.stringify(example, null, 2));
  };

  const getSeverityColor = (sev: string) => {
    switch(sev?.toUpperCase()) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'MODERATE': 
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen overflow-x-hidden bg-background text-foreground bg-grid-pattern">
        <Navbar />
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center">
                  <PackageSearch className="h-6 w-6 text-fuchsia-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Software Composition Analysis</h1>
                  <p className="text-muted-foreground text-sm">Scan dependencies for known CVEs via Google OSV API</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Input Section */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <Card className="glass border-fuchsia-500/20 shadow-lg shadow-fuchsia-500/5 transition-all duration-300 hover:border-fuchsia-500/50 h-full flex flex-col">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-gray-300">package.json</CardTitle>
                  <Button variant="ghost" size="sm" onClick={loadExample} className="text-xs text-fuchsia-400 hover:text-fuchsia-300 h-6 px-2">
                    Load Example
                  </Button>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <Textarea
                    placeholder="Paste your package.json contents here..."
                    className="flex-1 min-h-[300px] resize-none border-fuchsia-500/25 bg-slate-950/70 font-mono text-xs text-slate-300 placeholder:text-gray-600 focus-visible:ring-fuchsia-500/50"
                    value={packageJson}
                    onChange={(e) => setPackageJson(e.target.value)}
                  />
                  <Button 
                    onClick={handleScan} 
                    disabled={isScanning} 
                    className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-fuchsia-500/25 transition-all"
                  >
                    {isScanning ? (
                      <span className="flex items-center gap-2">
                        <Search className="animate-pulse h-4 w-4" /> Scanning OSV...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <PackageSearch className="h-4 w-4" /> Analyze Dependencies
                      </span>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2">
              <Card className="glass border-fuchsia-500/20 shadow-lg shadow-fuchsia-500/5 transition-all duration-300 hover:border-fuchsia-500/50 min-h-[420px]">
                <CardContent className="p-6">
                  {!results && !isScanning && (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-muted-foreground">
                      <ShieldAlert className="h-16 w-16 mb-4 opacity-20" />
                      <p>Enter your package.json to scan for vulnerabilities</p>
                    </div>
                  )}

                  {isScanning && (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-fuchsia-500">
                      <Search className="h-16 w-16 mb-4 animate-bounce" />
                      <p className="animate-pulse">Querying Google OSV Database...</p>
                    </div>
                  )}

                  {results && (
                    <div className="space-y-6">
                      <div className="flex flex-wrap gap-4 items-center justify-between border-b border-border pb-4">
                        <div className="flex gap-4">
                          <div className="text-center px-4 py-2 bg-slate-950/60 rounded-lg border border-border">
                            <p className="text-xs text-muted-foreground mb-1 font-mono">Scanned</p>
                            <p className="text-xl font-bold text-slate-200">{results.scannedCount}</p>
                          </div>
                          <div className={`text-center px-4 py-2 rounded-lg border ${results.vulnerableCount > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                            <p className="text-xs text-muted-foreground mb-1">Vulnerable</p>
                            <p className={`text-xl font-bold ${results.vulnerableCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                              {results.vulnerableCount}
                            </p>
                          </div>
                        </div>
                        <div>
                           {results.vulnerableCount === 0 ? (
                             <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 px-3 py-1 text-sm">
                               <CheckCircle className="w-4 h-4 mr-2 inline" /> All Clear
                             </Badge>
                           ) : (
                             <Badge className="bg-red-500/20 text-red-400 border-red-500/50 px-3 py-1 text-sm">
                               <ShieldAlert className="w-4 h-4 mr-2 inline" /> Action Required
                             </Badge>
                           )}
                        </div>
                      </div>

                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {results.findings.length === 0 ? (
                          <div className="text-center py-10 text-emerald-400 flex flex-col items-center">
                             <CheckCircle className="w-12 h-12 mb-3 opacity-50" />
                             <p>No vulnerable dependencies detected.</p>
                          </div>
                        ) : (
                          results.findings.map((finding, idx) => (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              key={idx} 
                              className="border border-red-500/20 bg-slate-950/50 rounded-xl overflow-hidden"
                            >
                              <div className="px-4 py-3 bg-red-500/5 border-b border-red-500/10 flex justify-between items-center">
                                <div className="font-mono font-bold text-red-400">
                                  {finding.package} <span className="text-slate-500 font-normal">v{finding.version}</span>
                                </div>
                                <Badge variant="outline" className="text-red-400 border-red-500/30">
                                  {finding.vulns?.length} CVEs
                                </Badge>
                              </div>
                              <div className="p-4 space-y-4">
                                {finding.vulns?.map((vuln, vidx) => (
                                  <div key={vidx} className="bg-slate-900 rounded-lg p-3 border border-border">
                                    <div className="flex items-start justify-between mb-2">
                                      <a href={`https://osv.dev/vulnerability/${vuln.id}`} target="_blank" rel="noreferrer" className="text-fuchsia-400 hover:underline font-mono text-sm font-bold flex items-center gap-1">
                                        {vuln.id} <ExternalLink className="w-3 h-3" />
                                      </a>
                                      <Badge variant="outline" className={getSeverityColor(vuln.severity)}>
                                        {vuln.severity}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-slate-300 mb-2">{vuln.summary}</p>
                                    {vuln.references && vuln.references.length > 0 && (
                                      <div className="text-xs">
                                        <span className="text-muted-foreground mr-2">Ref:</span>
                                        <a href={vuln.references[0]} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline truncate inline-block max-w-[200px] align-bottom">
                                          {vuln.references[0]}
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
