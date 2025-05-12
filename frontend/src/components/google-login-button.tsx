"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@apollo/client";
import { notify } from "@/lib/utils/utils";
import { GOOGLE_LOGIN_MUTATION } from "@/queries/auth/loginWithGoogle";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";

export function GoogleLoginButton() {
  const [loginWithGoogle] = useMutation(GOOGLE_LOGIN_MUTATION);
  const { login } = useAuthStore();
  const { setUser } = useUserStore();
  const router = useRouter();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        const token = credentialResponse.credential;

        if (!token) {
          notify.error("Erro", "Token não recebido do Google.");
          return;
        }

        try {
          const { data: result, errors } = await loginWithGoogle({
            variables: {
              input: {
                idToken: token,
              },
            },
          });

          const userToken = result?.loginWithGoogle?.token;
          const user = result?.loginWithGoogle?.user;

          login(userToken);
          setUser(user)

          if (errors && errors.length > 0) {
            throw new Error(errors[0].message);
          }

          notify.success("Login", "Autenticado com sucesso!");

          setTimeout(() => router.push("/dashboard"), 3000);
        } catch (err) {
          console.error(err);
          notify.error("Erro", "Falha no login.");
        }
      }}
      onError={() => {
        notify.error("Erro", "Falha ao conectar com o Google.");
      }}
      theme="outline"
      shape="circle"
      logo_alignment="center"
    />
  );
}
