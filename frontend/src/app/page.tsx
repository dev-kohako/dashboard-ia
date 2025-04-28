"use client";

import { Navbar } from "@/components/ui/navbar";
import { TextGenerateEffect } from "../components/ui/text-generate-effect";
import { Button } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles";
import { FlipWords } from "@/components/ui/flip-words";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "motion/react";

export default function Home() {
  const { theme } = useTheme();

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <main
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 sm:pt-1 md:px-12 max-lg:landscape:py-24"
      role="main"
      aria-label="Página inicial da KWK"
    >
      <Navbar />

      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      >
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={25}
          className="w-full h-full"
          particleColor={theme === "dark" ? "#d4d4d8" : "#09090b"}
        />
      </div>

      <motion.section
        className="relative z-10 text-center max-w-4xl"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {},
        }}
        aria-labelledby="home-heading"
      >
        <motion.h1
          id="home-heading"
          className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-7xl"
          variants={fadeUp}
          custom={1}
        >
          Bem-vindo ao KWK
        </motion.h1>

        <h2 className="sr-only">Áreas de Destaque</h2>

        <motion.div variants={fadeUp} custom={2}>
          <FlipWords
            className="mt-4 font-bold text-2xl tracking-widest uppercase sm:text-3xl"
            words={[
              "Dashboard",
              "Pessoal",
              "Inteligente",
              "Eficiente",
              "Personalizado",
              "Futurista",
            ]}
            aria-label="Palavras-chave destacadas"
          />
        </motion.div>

        <motion.div variants={fadeUp} custom={3}>
          <TextGenerateEffect
            words="Descubra como a nossa plataforma impulsionada por IA pode otimizar seu tempo, organizar sua vida e te ajudar a alcançar seus objetivos com mais facilidade."
            className="mt-6 text-base font-medium text-zinc-300 sm:text-lg sm:mt-8"
            duration={0.5}
            aria-live="polite"
          />
        </motion.div>

        <motion.div
          className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6"
          role="group"
          aria-label="Ações principais"
          variants={fadeUp}
          custom={4}
        >
          <Link href="/login" passHref>
            <Button
              className="px-8 py-4 text-base transition-all duration-300 sm:text-lg"
              title="Acessar a plataforma"
            >
              Começar Agora
            </Button>
          </Link>
          <Link href="/features" passHref>
            <Button
              variant="outline"
              className="min-w-[176px] px-8 py-4 border-zinc-400 text-base transition-all duration-300 sm:text-lg"
              title="Conhecer recursos da plataforma"
            >
              Conheça Mais
            </Button>
          </Link>
        </motion.div>
      </motion.section>
    </main>
  );
}
