"use client";

import { BeatLoader } from "react-spinners";

import { CardWrapper } from "../ui/card-wrapper";

import { useSearchParams } from "next/navigation";

import { useCallback, useEffect, useState } from "react";

import { completeEmailVerification } from "@/actions/email-verification";

import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>("");

  const onSubmit = useCallback(() => {
    setError("");
    setSuccess("");

    !token
      ? setError("검증 토큰을 확인할 수 없습니다.")
      : completeEmailVerification(token)
          .then((data) => {
            setSuccess(data.success);
            setError(data.error);
          })
          .catch((error) => {
            // Internal Server Error
            setError("무언가 잘못 됐군요...");
          });
  }, [token]);

  useEffect(() => {
    if (success || error) return;

    onSubmit();
  }, [onSubmit, success, error]);

  return (
    <CardWrapper
      headerLabel="이메일 인증을 마치세요!"
      backButtonHref="/login"
      backButtonLabel="로그인 하러가기"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
      </div>
      <FormSuccess message={success} />
      {!success && <FormError message={error} />}
    </CardWrapper>
  );
};

export default NewVerificationForm;
