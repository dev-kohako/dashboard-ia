"use client";

import { Navbar } from "@/components/ui/navbar";

export default function Features() {
  return (
    <>
      <Navbar />
      <main
        className="px-6 md:px-12 py-24 max-w-6xl mx-auto flex justify-center items-center flex-col min-h-screen sm:pt-1 max-lg:landscape:py-24"
        role="main"
        aria-labelledby="features-title"
      >
        <h1
          id="features-title"
          className="text-4xl md:text-5xl font-bold mb-6 text-center"
        >
          Recursos que transformam sua rotina
        </h1>
        <p
          className="text-zinc-500 text-lg text-center mb-16 max-w-2xl mx-auto"
          aria-describedby="features-description"
        >
          Descubra como a nossa plataforma impulsionada por IA pode otimizar seu
          tempo, organizar sua vida e te ajudar a alcançar seus objetivos com
          mais facilidade.
        </p>

        <section
          className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 w-full z-20"
          role="list"
          aria-label="Lista de recursos"
        >
          <Feature
            title="Organização Inteligente"
            description="A IA aprende com sua rotina e te ajuda a organizar tarefas, compromissos e metas de forma personalizada."
          />
          <Feature
            title="Painel Centralizado"
            description="Tenha tudo em um só lugar: tarefas, metas, anotações e hábitos. Visualize sua vida de forma clara e objetiva."
          />
          <Feature
            title="Recomendações com IA"
            description="Receba sugestões inteligentes de melhoria de produtividade com base em seu desempenho e hábitos."
          />
          <Feature
            title="Relatórios Visuais"
            description="Acompanhe seu progresso com gráficos intuitivos e relatórios automatizados para tomar melhores decisões."
          />
          <Feature
            title="Integrações Simples"
            description="Conecte-se facilmente com ferramentas que você já usa, como Google Calendar, Notion e mais."
          />
          <Feature
            title="Segurança e Privacidade"
            description="Seus dados são criptografados e tratados com responsabilidade. Controle total sobre o que é armazenado."
          />
        </section>
      </main>
    </>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      className="p-6 rounded-2xl shadow-lg border border-zinc-300 dark:border-zinc-300/20 hover:scale-105 hover:shadow-2xl transition-transform duration-300"
      role="listitem"
      aria-labelledby={`${title}-title`}
      aria-describedby={`${title}-description`}
    >
      <h2
        id={`${title}-title`}
        className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-100"
      >
        {title}
      </h2>
      <p
        id={`${title}-description`}
        className="text-zinc-500 dark:text-zinc-400"
      >
        {description}
      </p>
    </div>
  );
}
