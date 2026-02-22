/**
 * Form Builder Component
 * Reusable form with schema validation
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormField<T = unknown> {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "textarea" | "select" | "checkbox";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { label: string; value: string }[];
  className?: string;
}

interface FormBuilderProps<T extends z.ZodType<any, any>> {
  schema: T;
  fields: FormField<z.infer<T>>[];
  onSubmit: (data: z.infer<T>) => Promise<void> | void;
  defaultValues?: Partial<z.infer<T>>;
  submitText?: string;
  isLoading?: boolean;
  className?: string;
}

export function FormBuilder<T extends z.ZodType<any, any>>({
  schema,
  fields,
  onSubmit,
  defaultValues,
  submitText = "Submit",
  isLoading = false,
  className,
}: FormBuilderProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  });

  const handleFormSubmit = async (data: z.infer<T>) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={cn("space-y-4", className)}
    >
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>

          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              {...register(field.name as any)}
              placeholder={field.placeholder}
              disabled={isLoading || field.disabled}
              className={cn(
                "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                errors[field.name as any] && "border-red-500",
                field.className
              )}
            />
          ) : field.type === "select" ? (
            <select
              id={field.name}
              {...register(field.name as any)}
              disabled={isLoading || field.disabled}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                errors[field.name as any] && "border-red-500",
                field.className
              )}
            >
              <option value="">Pilih...</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : field.type === "checkbox" ? (
            <div className="flex items-center gap-2">
              <input
                id={field.name}
                type="checkbox"
                {...register(field.name as any)}
                disabled={isLoading || field.disabled}
                className="h-4 w-4"
              />
              <span className="text-sm">{field.placeholder}</span>
            </div>
          ) : (
            <Input
              id={field.name}
              type={field.type}
              {...register(field.name as any)}
              placeholder={field.placeholder}
              disabled={isLoading || field.disabled}
              className={cn(errors[field.name as any] && "border-red-500", field.className)}
            />
          )}

          {errors[field.name as any] && (
            <p className="text-sm text-red-500">
              {errors[field.name as any]?.message as string}
            </p>
          )}
        </div>
      ))}

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : submitText}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          disabled={isLoading}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
