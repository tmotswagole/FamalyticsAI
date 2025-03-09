"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, AlertCircle, CheckCircle, X } from "lucide-react";
import { t } from "@/lib/content";

interface CSVUploadProps {
  organizationId: string;
  onUploadComplete: (results: any) => void;
}

export default function CSVUpload({
  organizationId,
  onUploadComplete,
}: CSVUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const processCSV = async (file: File) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const { data, errors, meta } = results;

          if (errors.length > 0) {
            setError(`CSV parsing error: ${errors[0].message}`);
            setUploading(false);
            return;
          }

          // Validate required columns
          const requiredColumns = ["text_content"];
          const missingColumns = requiredColumns.filter(
            (col) => !meta.fields?.includes(col),
          );

          if (missingColumns.length > 0) {
            setError(`Missing required columns: ${missingColumns.join(", ")}`);
            setUploading(false);
            return;
          }

          // Process rows in batches
          const batchSize = 10;
          const totalRows = data.length;
          let processedRows = 0;
          let successCount = 0;
          let errorCount = 0;
          const errors: any[] = [];

          for (let i = 0; i < totalRows; i += batchSize) {
            const batch = data.slice(i, i + batchSize);

            // Process each row in the batch
            const batchPromises = batch.map(async (row: any) => {
              try {
                // Skip rows without text content
                if (!row.text_content?.trim()) {
                  return { success: false, error: "Empty text content" };
                }

                const response = await fetch("/api/feedback", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    organization_id: organizationId,
                    text_content: row.text_content,
                    source: row.source || "csv_import",
                    feedback_date:
                      row.feedback_date || new Date().toISOString(),
                    metadata: {
                      csv_import: true,
                      import_date: new Date().toISOString(),
                      original_data: row,
                    },
                  }),
                });

                if (!response.ok) {
                  const errorData = await response.json();
                  return {
                    success: false,
                    error: errorData.error || "Failed to import",
                  };
                }

                return { success: true };
              } catch (error) {
                return {
                  success: false,
                  error:
                    error instanceof Error ? error.message : "Unknown error",
                };
              }
            });

            const batchResults = await Promise.all(batchPromises);

            // Count successes and errors
            batchResults.forEach((result) => {
              if (result.success) {
                successCount++;
              } else {
                errorCount++;
                errors.push(result.error);
              }
            });

            // Update progress
            processedRows += batch.length;
            setProgress(Math.round((processedRows / totalRows) * 100));
          }

          // Set final status
          setUploading(false);

          if (errorCount === 0) {
            setSuccess(
              `Successfully imported ${successCount} feedback entries.`,
            );
          } else {
            setSuccess(
              `Imported ${successCount} entries with ${errorCount} errors.`,
            );
          }

          // Call the completion callback
          onUploadComplete({
            total: totalRows,
            success: successCount,
            errors: errorCount,
            errorDetails: errors,
          });
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
          );
          setUploading(false);
        }
      },
      error: (error) => {
        setError(`Failed to parse CSV: ${error.message}`);
        setUploading(false);
      },
    });
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        setError("Please upload a CSV file");
        return;
      }

      processCSV(file);
    },
    [organizationId],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    disabled: uploading,
    multiple: false,
  });

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {isDragActive ? t("csv.dropActive") : t("csv.dropzone")}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          or click to select a file
        </p>
        <Button disabled={uploading} variant="outline">
          {t("csv.selectFile")}
        </Button>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t("csv.uploading")}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex justify-between">
            <span>{error}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setError(null)}
              className="h-5 w-5 -mr-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-primary/10 text-primary border-primary/20">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription className="flex justify-between">
            <span>{success}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSuccess(null)}
              className="h-5 w-5 -mr-2 text-primary"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-muted-foreground">
        <p className="font-medium mb-1">{t("csv.requirements")}</p>
        <ul className="list-disc list-inside space-y-1">
          <li>{t("csv.req.textContent")}</li>
          <li>{t("csv.req.source")}</li>
          <li>{t("csv.req.date")}</li>
        </ul>
      </div>
    </div>
  );
}
