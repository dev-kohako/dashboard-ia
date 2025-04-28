"use client";

import { Menu } from "lucide-react";
import Image from "next/image";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./button";
import Link from "next/link";
import { ModeToggle } from "./toggleDarkMode";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  logo?: {
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
  links?: {
    home: {
      title: string;
      url: string;
    };
    features: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = {
    src: "/images/logo.png",
    alt: "logo",
    title: "KWK Dashboard",
  },
  auth = {
    login: { title: "Registar", url: "/register" },
    signup: { title: "Entrar", url: "/login" },
  },
  links = {
    home: { title: "Inicio", url: "#" },
    features: { title: "Sobre", url: "/features" },
  },
}: Navbar1Props) => {
  return (
    <section className="py-4 w-full flex justify-center items-center border-b backdrop-blur-[2px] border-b-zinc-300 dark:border-b-zinc-300/20 fixed top-0 z-50">
      <div className="w-full max-w-[1280px] px-[2rem]">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <a href="" className="flex items-center gap-2">
              <Image
                src={logo.src}
                width={32}
                height={32}
                className="max-h-8 dark:invert"
                alt={logo.alt}
              />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </a>
          </div>
          <div className="flex gap-2 items-center">
            <Button asChild variant="outline" size="sm" title="Entrar">
              <Link passHref href={auth.login.url}>{auth.login.title}</Link>
            </Button>
            <Button asChild size="sm" title="Criar conta">
              <Link passHref href={auth.signup.url}>{auth.signup.title}</Link>
            </Button>
            <ModeToggle />
          </div>
        </nav>

        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-2">
              <Image
                src={logo.src}
                width={32}
                height={32}
                className="max-h-8 dark:invert"
                alt={logo.alt}
              />
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="#" className="flex items-center gap-2">
                      <Image
                        src={logo.src}
                        width={32}
                        height={32}
                        className="max-h-8 dark:invert"
                        alt={logo.alt}
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <div className="flex flex-col gap-3">
                    <Button asChild variant="link" className="self-start">
                      <Link href={links.features.url}>{links.home.title}</Link>
                    </Button>
                    <Button asChild variant="link" className="self-start">
                      <Link href={links.features.url}>
                        {links.features.title}
                      </Link>
                    </Button>
                  </div>
                </div>
                <SheetFooter>
                  <div className="flex flex-col gap-3">
                    <Button asChild variant="outline">
                      <Link href={auth.login.url}>{auth.login.title}</Link>
                    </Button>
                    <Button asChild>
                      <Link href={auth.signup.url}>{auth.signup.title}</Link>
                    </Button>
                  </div>
                  <div className="flex gap-2 items-center justify-between mt-[1rem]">
                    <h1 className="text-sm">
                      © {new Date().getFullYear()} KWK. All rights reserved.
                    </h1>
                    <ModeToggle />
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Navbar };
