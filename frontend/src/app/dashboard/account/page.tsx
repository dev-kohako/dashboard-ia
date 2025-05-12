"use client";

import { useAccount } from "./useAccount";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import AvatarCropper from "@/components/avatar-cropper";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { AlertCircle, AlertTriangle, ShieldCheck, Trash2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function AccountPage() {
  const {
    form,
    onSubmit,
    isLoading,
    user,
    initials,
    imageToCrop,
    avatarPreview,
    selectedFile,
    isAvatarDialogOpen,
    deleteConfirmation,
    isMobile,
    setDeleteConfirmation,
    handleAvatarDialogOpenChange,
    isEditing,
    handleEditClick,
    handleImageChange,
    handleCropComplete,
    handleSave,
    handleDeleteAccount,
  } = useAccount();

  return (
    <main className="p-4 lg:p-8 max-w-[1280px] mx-auto sm:min-h-screen flex flex-col justify-start items-center py-16 max-lg:landscape:py-24">
      <Toaster position="top-right" />

      <h1 className="sr-only">Configurações da Conta</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full rounded-xl border p-8 lg:p-20 lg:pt-24 py-12 flex flex-col justify-center items-center relative overflow-hidden"
          aria-labelledby="account-settings-heading"
        >

          <div className="flex flex-col lg:flex-row gap-12 w-full justify-between items-center">
            <section
              className="flex flex-auto flex-col justify-start lg:self-start items-center gap-y-4 w-full max-w-48"
              aria-labelledby="profile-picture-heading"
            >
              <h3
                className="font-semibold text-base"
                id="profile-picture-heading"
              >
                Foto de perfil
              </h3>

              <div className="rounded-lg overflow-hidden" aria-hidden="true">
                <Avatar className="w-full h-full">
                  <AvatarImage
                    src={avatarPreview || user?.avatarUrl || ""}
                    alt={`Foto de perfil de ${user?.name}`}
                    className="object-cover"
                  />
                  <AvatarFallback
                    className="w-48 h-48 text-6xl font-bold"
                    aria-hidden="true"
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              <Dialog
                open={isAvatarDialogOpen}
                onOpenChange={handleAvatarDialogOpenChange}
              >
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full border-neutral-500/10"
                    aria-label="Alterar foto de perfil"
                  >
                    Alterar Foto
                  </Button>
                </DialogTrigger>
                {user?.authProvider === "google" && (
                  <section>
                    <Badge className="rounded-full">
                      <FcGoogle />
                      Conectado
                    </Badge>
                  </section>
                )}

                <DialogContent aria-labelledby="update-avatar-title">
                  <DialogHeader>
                    <DialogTitle id="update-avatar-title">
                      Atualizar foto de perfil
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />

                    <div
                      className="w-full flex justify-center bg-zinc-800/90 rounded-lg border py-10 border-zinc-400/20"
                      aria-live="polite"
                    >
                      {imageToCrop ? (
                        <AvatarCropper
                          image={imageToCrop}
                          onCropComplete={handleCropComplete}
                          aria-label="Editor de imagem"
                        />
                      ) : (
                        <p className="text-zinc-400">
                          Nenhuma imagem selecionada
                        </p>
                      )}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      onClick={handleSave}
                      disabled={!selectedFile}
                      aria-disabled={!selectedFile}
                    >
                      Salvar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </section>
            <section
              className="w-full flex flex-col gap-y-6 lg:gap-y-10"
              aria-labelledby="account-info-heading"
            >
              <h3 id="account-info-heading" className="sr-only">
                Informações da Conta
              </h3>

              <div className="flex flex-col xl:flex-row w-full justify-start items-start gap-y-10 xl:gap-0 xl:gap-x-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full shrink">
                      <FormLabel htmlFor="firstName">Nome</FormLabel>
                      <FormControl>
                        <Input
                          id="firstName"
                          disabled={!isEditing}
                          {...field}
                          aria-describedby="firstName-help"
                        />
                      </FormControl>
                      {isEditing && (
                        <>
                          <FormMessage />
                          <p
                            id="firstName-help"
                            className="text-sm text-muted-foreground"
                          >
                            Seu nome principal
                          </p>
                        </>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel htmlFor="lastName">Sobrenome</FormLabel>
                      <FormControl>
                        <Input
                          id="lastName"
                          disabled={!isEditing}
                          {...field}
                          aria-describedby="lastName-help"
                        />
                      </FormControl>
                      {isEditing && (
                        <>
                          <FormMessage />
                          <p
                            id="lastName-help"
                            className="text-sm text-muted-foreground"
                          >
                            Seu sobrenome ou nomes adicionais
                          </p>
                        </>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        disabled={!isEditing}
                        {...field}
                        type="email"
                        aria-describedby="email-help"
                      />
                    </FormControl>
                    {isEditing && (
                      <>
                        <FormMessage />
                        <p
                          id="email-help"
                          className="text-sm text-muted-foreground"
                        >
                          Seu endereço de email principal
                        </p>
                      </>
                    )}
                  </FormItem>
                )}
              />
              {user?.authProvider === "google" ? (
                user?.hasPassword ? (
                  <>
                    <FormField
                      control={form.control}
                      name="oldPassword"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel htmlFor="oldPassword">
                            Senha atual
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="oldPassword"
                              disabled={!isEditing}
                              type="password"
                              {...field}
                              aria-describedby="oldPassword-help"
                              placeholder="••••••••"
                            />
                          </FormControl>
                          {isEditing && (
                            <>
                              <FormMessage />
                              <p
                                id="oldPassword-help"
                                className="text-sm text-muted-foreground"
                              >
                                Necessário para alterar sua senha
                              </p>
                            </>
                          )}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel htmlFor="newPassword">
                            Nova senha
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="newPassword"
                              disabled={!isEditing}
                              type="password"
                              {...field}
                              aria-describedby="newPassword-help"
                              placeholder="••••••••"
                            />
                          </FormControl>
                          {isEditing && (
                            <>
                              <FormMessage />
                              <p
                                id="newPassword-help"
                                className="text-sm text-muted-foreground"
                              >
                                Mínimo de 8 caracteres
                              </p>
                            </>
                          )}
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="newPassword">Nova senha</FormLabel>
                        <FormControl>
                          <Input
                            id="newPassword"
                            disabled={!isEditing}
                            type="password"
                            {...field}
                            aria-describedby="newPassword-help"
                            placeholder="••••••••"
                          />
                        </FormControl>
                        {isEditing && (
                          <>
                            <FormMessage />
                            <p
                              id="newPassword-help"
                              className="text-sm text-muted-foreground"
                            >
                              Mínimo de 8 caracteres
                            </p>
                          </>
                        )}
                      </FormItem>
                    )}
                  />
                )
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="oldPassword"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="oldPassword">Senha atual</FormLabel>
                        <FormControl>
                          <Input
                            id="oldPassword"
                            disabled={!isEditing}
                            type="password"
                            {...field}
                            aria-describedby="oldPassword-help"
                            placeholder="••••••••"
                          />
                        </FormControl>
                        {isEditing && (
                          <>
                            <FormMessage />
                            <p
                              id="oldPassword-help"
                              className="text-sm text-muted-foreground"
                            >
                              Necessário para alterar sua senha
                            </p>
                          </>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="newPassword">Nova senha</FormLabel>
                        <FormControl>
                          <Input
                            id="newPassword"
                            disabled={!isEditing}
                            type="password"
                            {...field}
                            aria-describedby="newPassword-help"
                            placeholder="••••••••"
                          />
                        </FormControl>
                        {isEditing && (
                          <>
                            <FormMessage />
                            <p
                              id="newPassword-help"
                              className="text-sm text-muted-foreground"
                            >
                              Mínimo de 8 caracteres
                            </p>
                          </>
                        )}
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormField
                control={form.control}
                name="twoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row items-center justify-between rounded-lg border p-4">
                    {isMobile && <ShieldCheck />}
                    <div className="space-y-0.5">
                      <FormLabel className="text-base justify-center text-center sm:text-left sm:justify-start">
                        {!isMobile && <ShieldCheck />}
                        Autenticação em Dois Fatores (2FA)
                      </FormLabel>
                      <FormDescription className="text-sm text-muted-foreground text-center">
                        {field.value
                          ? "Proteção ativada: requer código de segurança além da senha para acessar sua conta"
                          : "Proteção adicional: recomenda-se ativar para maior segurança da conta"}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          {field.value ? "Ativo" : "Inativo"}
                        </span>
                        <Switch
                          disabled={!isEditing}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label="Ativar autenticação em dois fatores"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="w-full flex items-end justify-between sm:justify-end gap-x-4">
                <Button
                  onClick={handleEditClick}
                  type="button"
                  className="self-end"
                  variant={isEditing ? "outline" : "default"}
                  aria-expanded={isEditing}
                >
                  {isEditing ? "Cancelar Edição" : "Editar Perfil"}
                </Button>
                <Button
                  type="submit"
                  className="self-end"
                  disabled={!isEditing || isLoading}
                  aria-disabled={!isEditing || isLoading}
                >
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
              <Separator className="bg-destructive/40" />
              <section className="w-full space-y-4 -mt-2">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Zona de Perigo
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ações aqui são permanentes e não podem ser desfeitas
                  </p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full sm:w-auto">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Deletar Conta Permanentemente
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-destructive text-start">
                        <AlertCircle className="inline mr-2 h-5 w-5" />
                        Confirmar exclusão da conta
                      </AlertDialogTitle>

                      <AlertDialogDescription className="pt-2 text-start">
                        Esta ação removerá permanentemente:
                      </AlertDialogDescription>

                      <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-left">
                        <li>Todos os seus dados pessoais</li>
                        <li>Histórico de atividades</li>
                        <li>Configurações e preferências</li>
                        <li>Qualquer conteúdo associado à conta</li>
                      </ul>

                      <div className="pt-4 space-y-2">
                        <Label htmlFor="deleteConfirmation">
                          Digite{" "}
                          <span className="font-mono font-bold">"DELETAR"</span>{" "}
                          para confirmar:
                        </Label>
                        <Input
                          id="deleteConfirmation"
                          placeholder="DELETAR"
                          className="font-mono"
                          onChange={(e) =>
                            setDeleteConfirmation(e.target.value)
                          }
                          autoComplete="off"
                          value={deleteConfirmation}
                        />
                      </div>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="pt-2">
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        variant="destructive"
                        disabled={deleteConfirmation !== "DELETAR"}
                        className="gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Confirmar Exclusão
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </section>
            </section>
          </div>
        </form>
      </Form>
    </main>
  );
}
