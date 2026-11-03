"use client";

import { useState } from "react";
import { InterviewSession } from "@/components/interview/InterviewSession";
import { JobDescriptionForm } from "@/components/interview/JobDescriptionForm";
import { JobSummary } from "@/components/interview/JobSummary";
import type { JobContext } from "@/lib/schemas";
import type { Role } from "@/types";

export function JobInterview({ role }: { role: Role }) {
  const [analysis, setAnalysis] = useState<{ key: number; job: JobContext } | null>(
    null
  );

  if (!analysis) {
    return (
      <div className="mt-8">
        <JobDescriptionForm
          onAnalyzed={(job) => setAnalysis({ key: Date.now(), job })}
        />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <JobSummary job={analysis.job} />
      <button
        type="button"
        onClick={() => setAnalysis(null)}
        className="mt-3 text-sm text-indigo-500 hover:underline"
      >
        Use a different posting
      </button>

      <InterviewSession
        key={analysis.key}
        role={role}
        job={analysis.job}
        defaultDifficulty={analysis.job.seniority}
      />
    </div>
  );
}