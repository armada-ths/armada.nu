"use client";

import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
}

const Navbar1 = ({
  logo = {
    url: "https://www.shadcnblocks.com",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "Shadcnblocks.com",
  },
  menu = [
    { title: "Home", url: "#" },
    {
      title: "Products",
      url: "#",
      items: [
        {
          title: "Blog",
          description: "The latest industry news, updates, and info",
          icon: <Book className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Company",
          description: "Our mission is to innovate and empower the world",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Careers",
          description: "Browse job listing and discover our workspace",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Support",
          description:
            "Get in touch with our support team or visit community forums",
          icon: <Zap className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    {
      title: "Resources",
      url: "#",
      items: [
        {
          title: "Help Center",
          description: "Get all the answers you need right here",
          icon: <Zap className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Contact Us",
          description: "We are here to help you with any questions have",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Status",
          description: "Check the current status of our services and APIs",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Terms of Service",
          description: "Our terms and conditions for using our services",
          icon: <Book className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    {
      title: "Pricing",
      url: "#",
    },
    {
      title: "Blog",
      url: "#",
    },
  ]
}: Navbar1Props) => {
  return (
    <section className="py-4 bg-melon-700 border-b-2 border-licorice">
      {/* Desktop Menu */}
      <div className="container">

        <nav className="hidden lg:flex items-center">
          <div className="container flex items-center">

            {/* LEFT — Logo */}
            <div className="flex flex-1 items-center gap-6">
              <a href={logo.url} className="flex items-center gap-2">
                <img src={logo.src} className="max-h-8" alt={logo.alt} />
                <div className="flex mt-2 gap-1">
                  <span className="text-3xl font-bebas-book text-snow">THS</span>
                  <span className="text-3xl font-bebas-bold text-snow">ARMADA</span>
                </div>
              </a>
            </div>

            {/* CENTER — Navigation */}
            <div className="justify-center rounded-md">
              <NavigationMenu className="rounded-md border-none">
                <NavigationMenuList className="flex-wrap">
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="flex-1"></div>

          </div>
        </nav>


        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img
                src={logo.src}
                className="max-h-8"
                alt={logo.alt}
              />
              <div className="flex mt-2 gap-1">
                <span className="text-3xl font-bebas-book text-snow">
                  THS
                </span>
                <span className="text-3xl font-bebas-bold text-snow">
                  ARMADA
                </span>
              </div>
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="neutral" size="icon" className="border-licorice">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto bg-coconut">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url} className="flex items-center gap-2 w-fit">
                      <img
                        src={logo.src}
                        className="max-h-8 invert"
                        alt={logo.alt}
                      />
                      <div className="flex mt-2 gap-1">
                        <span className="text-3xl font-bebas-book">
                          THS
                        </span>
                        <span className="text-3xl font-bebas-bold">
                          ARMADA
                        </span>
                      </div>
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className="rounded-md">{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-snow">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-medium"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="rounded-md">
        <AccordionTrigger className="text-md py-4 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent>
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="
        rounded-base flex select-none flex-row gap-4 p-3 leading-none no-underline outline-hidden
        transition-colors hover:border-2 border-licorice
        max-w-fit sm:min-w-80"
      href={item.url}
    >
      <div className="text-licorice">{item.icon}</div>
      <div>
        <div className="text-licorice font-semibold ">{item.title}</div>
        {item.description && (
          <p className="text-stone-500 text-sm leading-snug dark:text-stone-400">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar1 };
