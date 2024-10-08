"use client";

import * as z from "zod";
import { LoginSchema } from "@/schemas";

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

import { login } from "@/actions/login";

import { useState, useTransition } from "react";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "이메일이 이미 사용 중 이니 다른 방식으로 로그인 해주세요."
      : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      login(values)
        .then((res) => {
          console.log(res);

          if (res?.error) {
            form.reset();
            setError(res.error);
          }

          if (res?.twoFactor) {
            setShowTwoFactor(true);
          }

          if (res?.success) {
            form.reset();
            setSuccess(res.success);
          }
        })
        .catch((err) => {
          console.log(err);
          setError("무언가 잘못됐군요...");
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="돌아오신걸 환영해요!"
      backButtonLabel="계정이 없으신가요?"
      backButtonHref="/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="twoFactorCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2차 인증 코드</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="이메일로 전송된 2차 인증 코드를 입력해주세요."
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>비밀번호</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="*****"
                          type="password"
                          disabled={isPending}
                        />
                      </FormControl>
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link href="/reset">비밀번호를 분실했나요?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            {showTwoFactor ? "제출하기" : "로그인"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
