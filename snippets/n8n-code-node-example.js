// Sanitized n8n Code node example: environment-aware write target config.
// This is illustrative, not a full workflow export.

const ENV = $env.DAILY_DEVSECOPS_ENV || "DEV";
const isProd = ENV === "PROD";

const config = {
  env: ENV,

  paths: {
    clusterDir: isProd
      ? "/data/devsecops_audit_clusters"
      : "/data/DEV/devsecops_audit_clusters",

    latestClusterArtifact: isProd
      ? "/data/Daily_DevSecOps_clusters.json"
      : "/data/DEV/Daily_DevSecOps_clusters.json",

    emailPreviewDir: isProd
      ? "/data/devsecops_email_previews"
      : "/data/DEV/email_previews",

    evaluationDir: isProd
      ? null
      : "/data/DEV/evaluation_runs",

    // In this concept, DEV change-request file writes are intentionally disabled.
    changeRequestDir: isProd
      ? "/data/wiki/wiki/inbox"
      : null,
  },

  qdrant: {
    caseMemoryCollection: isProd
      ? "devsecops_memory"
      : "devsecops_memory_dev",
  },

  sideEffects: {
    sendEmail: isProd,
    writeWikiChangeRequestFiles: isProd,
    writeEmailPreview: true,
    writeCaseCards: true,
    allowSyntheticFixtures: !isProd,
  },
};

return [
  {
    json: {
      config,
      generatedAt: new Date().toISOString(),
    },
  },
];
