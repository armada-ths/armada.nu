export const locales = ["en", "sv"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const translations: Record<
  Locale,
  {
    switchLanguage: string
    followUs: string
    students: string
    exhibitors: string
    about: string
    forExhibitors: string
    forStudents: string
    aboutUs: string
    registration: string
    kits: string
    whyArmada: string
    timeline: string
    events: string
    exhibitorsList: string
    map: string
    recruitment: string
    blog: string
    team: string
    aboutArmada: string
    joinArmada: string
    meetTheTeam: string
    readOurBlog: string
    languageToggle: string
  }
> = {
  en: {
    switchLanguage: "Svenska",
    followUs: "Follow us on:",
    students: "STUDENTS",
    exhibitors: "EXHIBITORS",
    about: "ABOUT",
    forExhibitors: "For Exhibitors",
    forStudents: "For Students",
    aboutUs: "About us",
    registration: "Registration",
    kits: "Kits",
    whyArmada: "Why Armada",
    timeline: "Timeline",
    events: "Events",
    exhibitorsList: "Exhibitors",
    map: "Map",
    recruitment: "Recruitment",
    blog: "Blog",
    team: "Team",
    aboutArmada: "About Armada",
    joinArmada: "Join Armada",
    meetTheTeam: "Meet the Team",
    readOurBlog: "Read our Blog",
    languageToggle: "SV"
  },
  sv: {
    switchLanguage: "English",
    followUs: "Följ oss på:",
    students: "STUDENTER",
    exhibitors: "UTSTÄLLARE",
    about: "OM OSS",
    forExhibitors: "För utställare",
    forStudents: "För studenter",
    aboutUs: "Om oss",
    registration: "Registrering",
    kits: "Kit",
    whyArmada: "Varför Armada",
    timeline: "Tidslinje",
    events: "Event",
    exhibitorsList: "Utställare",
    map: "Karta",
    recruitment: "Rekrytering",
    blog: "Blogg",
    team: "Team",
    aboutArmada: "Om Armada",
    joinArmada: "Gå med i Armada",
    meetTheTeam: "Träffa teamet",
    readOurBlog: "Läs vår blogg",
    languageToggle: "EN"
  }
}

export const pageTranslations: Record<
  Locale,
  {
    home: {
      heroHeading: string
      heroDescription: string
      aboutHeading: string
      aboutBody: string
      thsLinkLabel: string
      aboutSuffix: string
      newStudentsHeading: string
      newStudentsBody: string
      exhibitorSignup: string
      joinUs: string
    }
    aboutPage: {
      metadataTitle: string
      metadataDescription: string
      heading: string
      comingSoonTitle: string
      photos: [string, string, string, string]
      intro: string
      ownershipPrefix: string
      thsLinkLabel: string
      ownershipSuffix: string
      pmHeading: string
      pmBody: string
      projectGroupHeading: string
      projectGroupBody: string
      operationsTeamHeading: string
      operationsTeamBody: string
      hostsHeading: string
      hostsBody: string
    }
  }
> = {
  en: {
    home: {
      heroHeading: "Set Sail For Success",
      heroDescription:
        "The No. 1 career fair at KTH Royal Institute of Technology",
      aboutHeading: "About Armada",
      aboutBody:
        "Armada was founded in 1981 and has since then organized a career fair that has grown to become one of the largest in Scandinavia. We exist to connect students to their dream employer and have since come up with different events and happenings to create personal connections between students and employers. As Armada is fully owned by",
      thsLinkLabel: "THS",
      aboutSuffix:
        ", the student union at KTH, any profit Armada makes goes back to the students, funding THS initiatives for a better student life.",
      newStudentsHeading: "New students, every year!",
      newStudentsBody:
        "Every year, around 4000 new students come to KTH. Almost as many students get their first full time job or internship. Participating in Armada means you get access to all of them, and can both build awareness among younger students and be top of mind when the older students start looking for a job. Welcome!",
      exhibitorSignup: "Exhibitor Signup",
      joinUs: "Join Us!"
    },
    aboutPage: {
      metadataTitle: "About Armada",
      metadataDescription: "Learn more about Armada",
      heading: "About Armada",
      comingSoonTitle: "About Armada",
      photos: [
        "Students laying down carpet",
        "Student talking with company representative",
        "Crowd walking around the Armada fair",
        "Student interacting with robot"
      ],
      intro:
        "Armada was founded in 1981 and has since then organized a career fair that has grown to become one of the largest in Scandinavia. We exist to connect students to their dream employer and have since come up with different events and happenings to create personal connections between students and employers.",
      ownershipPrefix:
        "Each year, Armada goes from 1 student, the Project Manager, to over 200 student volunteers managing a fair over two days, in several locations and 20 000 visitors. As Armada is fully owned by",
      thsLinkLabel: "THS",
      ownershipSuffix:
        ", the student union at KTH, any profit Armada makes goes back to the students, funding THS initiatives for a better student life.",
      pmHeading: "PM",
      pmBody:
        "The Project Manager (PM) is elected by the THS board in November. The PM is working full time with Armada and is responsible for the entire project. They usually have been part of Armada before taking up this role.",
      projectGroupHeading: "Project group",
      projectGroupBody:
        "The Project Group (PG) is chosen by the Project Manager in December/January. They then work with Armada the whole calendar year. These are students who dedicate around 10 hours per week to making each Armada the best fair yet. The PG really gets close learning to work together, get to try to shoulder big responsibilities in a supportive and collaborative environment and most of all, have really fun together. Everyone who's been a PG knows, there is a before and an after Armada.",
      operationsTeamHeading: "Operations team",
      operationsTeamBody:
        "The operations team are volunteers recruited in the spring, around April/May. They are Coordinators, responsible for a specific issue or process, Team Leaders, responsible for a team of Hosts and Developers, working with the Armada IT suite. Being an OT gives a good understanding of how Armada works within, and is the perfect first leadership experience. It is a lot of fun, and gives a lot of learning opportunities, for a medium amount of work.",
      hostsHeading: "Hosts",
      hostsBody:
        "The Hosts join Armada in the autumn, and being a Host is a special experience. Most hosts are career fair hosts, helping a couple of exhibitors to the fair and building the fair. You get to know your team, attend team buildings together and be a part of the Armada Grand Banquet - the fanciest party at KTH."
    }
  },
  sv: {
    home: {
      heroHeading: "Sätt kurs mot framgång",
      heroDescription:
        "Den främsta arbetsmarknadsmässan på KTH Kungliga Tekniska högskolan",
      aboutHeading: "Om Armada",
      aboutBody:
        "Armada grundades 1981 och har sedan dess arrangerat en arbetsmarknadsmässa som har vuxit till en av de största i Skandinavien. Vi finns till för att koppla samman studenter med deras drömarbetsgivare och har utvecklat olika event och aktiviteter som skapar personliga möten mellan studenter och arbetsgivare. Eftersom Armada ägs helt av",
      thsLinkLabel: "THS",
      aboutSuffix:
        ", studentkåren vid KTH, går eventuell vinst tillbaka till studenterna och finansierar THS initiativ för ett bättre studentliv.",
      newStudentsHeading: "Nya studenter, varje år!",
      newStudentsBody:
        "Varje år börjar omkring 4000 nya studenter på KTH. Nästan lika många studenter får sitt första heltidsjobb eller sin första praktikplats. Genom att delta i Armada får ni tillgång till dem alla, kan bygga kännedom hos yngre studenter och vara top of mind när äldre studenter börjar söka jobb. Välkomna!",
      exhibitorSignup: "Anmälan för utställare",
      joinUs: "Gå med!"
    },
    aboutPage: {
      metadataTitle: "Om Armada",
      metadataDescription: "Lär dig mer om Armada",
      heading: "Om Armada",
      comingSoonTitle: "Om Armada",
      photos: [
        "Studenter lägger ut matta",
        "Student pratar med företagsrepresentant",
        "Besökare rör sig genom Armada-mässan",
        "Student interagerar med robot"
      ],
      intro:
        "Armada grundades 1981 och har sedan dess arrangerat en arbetsmarknadsmässa som har vuxit till en av de största i Skandinavien. Vi finns till för att koppla samman studenter med deras drömarbetsgivare och har utvecklat olika event och aktiviteter som skapar personliga möten mellan studenter och arbetsgivare.",
      ownershipPrefix:
        "Varje år växer Armada från 1 student, projektledaren, till över 200 studentvolontärer som driver en två dagar lång mässa på flera platser med 20 000 besökare. Eftersom Armada ägs helt av",
      thsLinkLabel: "THS",
      ownershipSuffix:
        ", studentkåren vid KTH, går eventuell vinst tillbaka till studenterna och finansierar THS initiativ för ett bättre studentliv.",
      pmHeading: "Projektledare",
      pmBody:
        "Projektledaren väljs av THS styrelse i november. Projektledaren arbetar heltid med Armada och ansvarar för hela projektet. Oftast har personen varit en del av Armada innan den kliver in i rollen.",
      projectGroupHeading: "Projektgruppen",
      projectGroupBody:
        "Projektgruppen väljs av projektledaren i december eller januari. Därefter arbetar de med Armada under hela kalenderåret. Det är studenter som lägger omkring 10 timmar i veckan på att göra varje Armada till den bästa mässan hittills. Projektgruppen lär känna varandra nära, får ta stort ansvar i en stöttande och samarbetsinriktad miljö och har framför allt väldigt roligt tillsammans. Alla som har varit med i projektgruppen vet att det finns ett före och ett efter Armada.",
      operationsTeamHeading: "Operations team",
      operationsTeamBody:
        "Operations team består av volontärer som rekryteras under våren, omkring april eller maj. De är koordinatorer med ansvar för särskilda frågor eller processer, teamledare med ansvar för värdar och utvecklare som arbetar med Armadas IT-svit. Att vara en del av OT ger en god förståelse för hur Armada fungerar inifrån och är en perfekt första ledarskapserfarenhet. Det är roligt, lärorikt och innebär en lagom arbetsinsats.",
      hostsHeading: "Värdar",
      hostsBody:
        "Värdarna går med i Armada under hösten, och att vara värd är en speciell upplevelse. De flesta värdar är mässvärdar som hjälper ett par utställare till mässan och bygger upp mässan. Du lär känna ditt team, går på teambuilding tillsammans och får vara en del av Armada Grand Banquet - KTH:s finaste fest."
    }
  }
}

export function normalizeLocale(locale?: string | null): Locale {
  if (!locale) return defaultLocale

  const normalized = locale.toLowerCase()
  if (normalized === "sv" || normalized.startsWith("sv-")) return "sv"
  if (normalized === "en" || normalized.startsWith("en-")) return "en"

  return defaultLocale
}

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split("/").filter(Boolean)
  const first = segments[0]
  return normalizeLocale(first)
}

export function stripLocalePrefix(pathname: string): string {
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "")

  if (normalizedPath === "/") return "/"

  const match = normalizedPath.match(/^\/(en|sv)(?=\/|$)/i)
  if (!match) return normalizedPath

  const withoutLocale = normalizedPath.slice(match[0].length) || "/"
  return withoutLocale === "" ? "/" : withoutLocale
}

export function createLocalePath(pathname: string, locale: Locale): string {
  const nextLocale = normalizeLocale(locale)
  const withoutLocale = stripLocalePrefix(pathname)
  const basePath = withoutLocale === "/" ? "" : withoutLocale

  return `/${nextLocale}${basePath}`
}
