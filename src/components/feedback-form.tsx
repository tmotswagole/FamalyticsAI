"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { t } from "@/lib/content";

interface FeedbackFormProps {
  organizationId: string;
  onSubmitSuccess?: (data: any) => void;
}

interface FeedbackFormValues {
  text_content: string;
  source: string;
  feedback_date: string;
}

export default function FeedbackForm({
  organizationId,
  onSubmitSuccess,
}: FeedbackFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormValues>({
    defaultValues: {
      text_content: "",
      source: "manual_entry",
      feedback_date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organization_id: organizationId,
          text_content: data.text_content,
          source: data.source,
          feedback_date: new Date(data.feedback_date).toISOString(),
          analyze_sentiment: true, // Request immediate sentiment analysis
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit feedback");
      }

      const result = await response.json();
      setSubmitSuccess(true);
      reset();

      if (onSubmitSuccess) {
        onSubmitSuccess(result);
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("feedback.form.title")}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text_content" className="text-sm font-medium">
              {t("feedback.form.text")} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="text_content"
              placeholder={t("feedback.form.textPlaceholder")}
              className="min-h-[120px]"
              {...register("text_content", {
                required: "Feedback text is required",
              })}
            />
            {errors.text_content && (
              <p className="text-sm text-red-500">
                {errors.text_content.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source" className="text-sm font-medium">
                {t("feedback.form.source")}
              </Label>
              <Input
                id="source"
                placeholder={t("feedback.form.sourcePlaceholder")}
                {...register("source")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback_date" className="text-sm font-medium">
                {t("feedback.form.date")}
              </Label>
              <Input
                id="feedback_date"
                type="date"
                {...register("feedback_date")}
              />
            </div>
          </div>

          {submitError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {submitSuccess && (
            <Alert className="bg-primary/10 text-primary border-primary/20">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{t("feedback.form.success")}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("feedback.form.submitting")}
              </>
            ) : (
              t("feedback.form.submit")
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
