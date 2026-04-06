import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BriefcaseBusiness, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/api";

interface Job {
  id: number;
  title: string;
  department: string;
  description: string;
  min_salary: number;
  max_salary: number;
  status: string;
}

export default function EmployeeJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    api.get("/jobs").then((response) => setJobs(response.data?.data || [])).catch(() => setJobs([]));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-2">
        <h1 className="page-header">Open Jobs</h1>
        <p className="page-subheader">Browse current roles visible to employees across the organization.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <Card key={job.id} className="glass-card">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary"><BriefcaseBusiness className="h-5 w-5" /></div>
                <div>
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    {job.department || "General"}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{job.description || "Role details will be shared by HR."}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="rounded-full border border-border px-3 py-1 uppercase tracking-[0.16em] text-muted-foreground">{job.status}</span>
                <span className="font-medium">INR {job.min_salary} - {job.max_salary}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
