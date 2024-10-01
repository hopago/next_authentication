"use client";

import * as z from "zod";
import { ResetSchema } from "@/schemas";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { CardWrapper } from "../ui/card-wrapper";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

import { useState, useTransition } from "react";
import { reset } from "@/actions/reset";

const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    startTransition(() => {
      reset(values)
        .then((data) => {
          setSuccess(data?.success);
          setError(data?.error);
        })
        .catch((err) => setError("무언가 잘못됐군요..."));
    });
  };

  return (
    <CardWrapper
      headerLabel="비밀번호를 분실했나요?"
      backButtonLabel="로그인 하러가기"
      backButtonHref="/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="hopago@example.com"
                      type="email"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            재설정 이메일 전송
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetForm;
