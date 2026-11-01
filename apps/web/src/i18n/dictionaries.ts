import { createTranslator } from "next-intl"
import type { Locale } from "@armada/shared/i18n/routing"
import en from "./messages/en.json"
import sv from "./messages/sv.json"
const messages = { en, sv }
function restoreLists(value: unknown): unknown {
  if (!value || typeof value !== "object") return value
  const entries = Object.entries(value).map(
    ([key, item]) => [key, restoreLists(item)] as const
  )
  return entries.length > 0 &&
    entries.every(([key], index) => key === String(index))
    ? entries.map(([, item]) => item)
    : Object.fromEntries(entries)
}
const dictionaries = {
  en: restoreLists(en) as Record<string, object>,
  sv: restoreLists(sv) as Record<string, object>
}

export const teamText = {
  en: { ...dictionaries.en.teamText },
  sv: { ...dictionaries.sv.teamText }
} as unknown as Record<
  Locale,
  { title: string; description: string; heading: string }
>
export const organisationMembersGraphicText = {
  en: { ...dictionaries.en.organisationMembersGraphicText },
  sv: { ...dictionaries.sv.organisationMembersGraphicText }
} as unknown as Record<
  Locale,
  {
    title: string
    body: string
    hosts: string
    operationsTeam: string
    projectGroup: string
    projectManager: string
  }
>
export const blogText = {
  en: { ...dictionaries.en.blogText },
  sv: { ...dictionaries.sv.blogText }
} as unknown as Record<
  Locale,
  {
    title: string
    intro: string
    emptyTitle: string
    emptyBody: string
  }
>
export const packagesPageTranslations = {
  en: { ...dictionaries.en.packagesPageTranslations },
  sv: { ...dictionaries.sv.packagesPageTranslations }
} as unknown as Record<
  Locale,
  {
    metadataTitle: string
    metadataDescription: string
    comingSoonTitle: string
    heading: string
    intro: string
    didYouKnowTitle: string
    didYouKnowBody: string
    standardRegistrationPrice: string
    bronzeItems: string[]
    silverItems: string[]
    goldItems: string[]
    goldEventDetails: string
    customKitHeading: string
    customKitIntro: string
    customKitItems: { title: string; body: string }[]
    customKitContactPrefix: string
    customKitContactSuffix: string
    focusRoomsHeading: string
    focusRoomsIntro: string
    focusRoomItems: { title: string; body: string }[]
    faqHeading: string
    priorityQuestion: string
    priorityAnswerPrefix: string
    priorityAnswerSuffix: string
    registrationQuestion: string
    priorityRegistrationAnswer: string
    standardRegistrationAnswer: string
    firstSignupAnswer: string
    timelinePrefix: string
    timelineLink: string
    timelineSuffix: string
    signupQuestion: string
    signupIntro: string
    signupButton: string
    signupContactPrefix: string
  }
>
export const exhibitorPageTranslations = {
  en: { ...dictionaries.en.exhibitorPageTranslations },
  sv: { ...dictionaries.sv.exhibitorPageTranslations }
} as unknown as Record<
  Locale,
  {
    metadataTitle: string
    comingSoonTitle: string
    heading: string
    signupButton: string
    packagesButton: string
    timelineButton: string
    contactPrefix: string
    contactLink: string
    contactSuffix: string
    photos: [string, string, string, string]
    visitorLabels: {
      visits: string
      students: string
      networking: string
    }
    newStudentsHeading: string
    newStudentsBody: string
    characterHeading: string
    characterBody: string
    skillsHeading: string
    skillsBody: string
  }
>
export const signupText = {
  en: {
    ...dictionaries.en.signupText,
    openBody: (year: string | number) =>
      createTranslator({ locale: "en", messages: messages.en })(
        "signupText.openBody",
        { year }
      ),
    beforePrefix: (year: string | number) =>
      createTranslator({ locale: "en", messages: messages.en })(
        "signupText.beforePrefix",
        { year }
      ),
    closedPrefix: (value: string | number) =>
      createTranslator({ locale: "en", messages: messages.en })(
        "signupText.closedPrefix",
        { value }
      )
  },
  sv: {
    ...dictionaries.sv.signupText,
    openBody: (year: string | number) =>
      createTranslator({ locale: "sv", messages: messages.sv })(
        "signupText.openBody",
        { year }
      ),
    beforePrefix: (year: string | number) =>
      createTranslator({ locale: "sv", messages: messages.sv })(
        "signupText.beforePrefix",
        { year }
      ),
    closedPrefix: (value: string | number) =>
      createTranslator({ locale: "sv", messages: messages.sv })(
        "signupText.closedPrefix",
        { value }
      )
  }
} as unknown as Record<
  Locale,
  {
    title: string
    description: string
    openHeading: string
    openBody: (year: number) => string
    eventroButton: string
    beforeHeading: string
    beforePrefix: (year: number) => string
    beforeContactPrefix: string
    beforeContactSuffix: string
    betweenHeading: string
    betweenPrefix: string
    betweenSuffix: string
    closedHeading: string
    closedPrefix: (year: number) => string
    closedSuffix: string
  }
>
export const timelinePageText = {
  en: { ...dictionaries.en.timelinePageText },
  sv: { ...dictionaries.sv.timelinePageText }
} as unknown as Record<
  Locale,
  { title: string; description: string; intro: string }
>
export const contactSalesText = {
  en: { ...dictionaries.en.contactSalesText },
  sv: { ...dictionaries.sv.contactSalesText }
} as unknown as Record<
  Locale,
  {
    trigger: string
    title: string
    name: string
    namePlaceholder: string
    email: string
    emailPlaceholder: string
    phone: string
    company: string
    companyPlaceholder: string
    message: string
    messagePlaceholder: string
    send: string
    sending: string
    missingRecaptcha: string
    invalidDomain: string
    recaptchaNotReady: string
    submitted: string
    submitFailed: string
  }
>
export const currentStatusText = {
  en: { ...dictionaries.en.currentStatusText },
  sv: { ...dictionaries.sv.currentStatusText }
} as unknown as Record<
  Locale,
  {
    openingSoonTitle: string
    openingSoonBody: string
    priorityOpenTitle: string
    priorityOpenPrefix: string
    priorityOpenLink: string
    priorityOpenSuffix: string
    registrationOverTitle: string
    registrationOverPrefix: string
    contactSales: string
    registrationOverSuffix: string
    standardOpenTitle: string
    standardOpenPrefix: string
    standardOpenLink: string
    standardOpenSuffix: string
  }
>
export const timelineText = {
  en: {
    ...dictionaries.en.timelineText,
    before: (month: string | number) =>
      createTranslator({ locale: "en", messages: messages.en })(
        "timelineText.before",
        { month }
      )
  },
  sv: {
    ...dictionaries.sv.timelineText,
    before: (month: string | number) =>
      createTranslator({ locale: "sv", messages: messages.sv })(
        "timelineText.before",
        { month }
      )
  }
} as unknown as Record<
  Locale,
  {
    before: (month: string) => string
    signupButton: string
    linkHere: string
    setupTitle: string
    setupBody: [string, string]
    priorityStartTitle: string
    priorityBody: [string, string, string]
    priorityEndTitle: string
    acceptanceTitle: string
    acceptanceBody: [string, string]
    standardStartTitle: string
    standardBody: [string, string]
    standardEndTitle: string
    preparationsTitle: string
    preparationsIntro: string
    preparationsItems: [string, string, string]
    preparationsBody: string
    eventsTitle: string
    eventsBody: [string, string]
    fairStartTitle: string
    fairStartBody: [string, string, string]
    banquetTitle: string
    banquetBody: [string, string]
    fairEndTitle: string
  }
>
export const atFairTranslations = {
  en: { ...dictionaries.en.atFairTranslations },
  sv: { ...dictionaries.sv.atFairTranslations }
} as unknown as Record<
  Locale,
  {
    heading: string
    intro: string
    tips: string[]
    reminder: string
    exampleHeading: string
    exampleIntro: string
    questionEyebrow: string
    emptyQuestion: string
    generateQuestion: string
    questions: string[]
  }
>
export const eventsText = {
  en: { ...dictionaries.en.eventsText },
  sv: { ...dictionaries.sv.eventsText }
} as unknown as Record<
  Locale,
  {
    title: string
    description: string
    intro: string
    emptyTitle: string
    emptyPrefix: string
    emptySuffix: string
  }
>
export const exhibitorSearchText = {
  en: { ...dictionaries.en.exhibitorSearchText },
  sv: { ...dictionaries.sv.exhibitorSearchText }
} as unknown as Record<
  Locale,
  {
    searchPlaceholder: string
    filterEmployment: string
    filterIndustry: string
    filterProgram: string
  }
>
export const recruitmentPageText = {
  en: { ...dictionaries.en.recruitmentPageText },
  sv: { ...dictionaries.sv.recruitmentPageText }
} as unknown as Record<
  Locale,
  {
    title: string
    description: string
    alertTitle: string
    alertBody: string
    availableRoles: string
    signupNoRolesTitle: string
    signupNoRolesBody: string
    signupOpenTitle: string
    signupOpenBody: string
    signupClosedTitle: string
    signupClosedBody: string
  }
>
export const hostFaqText = {
  en: { ...dictionaries.en.hostFaqText },
  sv: { ...dictionaries.sv.hostFaqText }
} as unknown as Record<
  Locale,
  {
    timeQuestion: string
    timeIntro: string
    october: string
    november: string
    constructionWeekend: string
    constructionBody: string
    fairDaysBody: string
    processQuestion: string
    processBody: string
  }
>
export const otFaqText = {
  en: { ...dictionaries.en.otFaqText },
  sv: { ...dictionaries.sv.otFaqText }
} as unknown as Record<
  Locale,
  {
    workQuestion: string
    workBody: string
    differenceQuestion: string
    intro: string
    leader: string
    leaderBody: string
    coordinator: string
    coordinatorBody: string
  }
>
export const pgFaqText = {
  en: { ...dictionaries.en.pgFaqText },
  sv: { ...dictionaries.sv.pgFaqText }
} as unknown as Record<
  Locale,
  {
    workQuestion: string
    workBody: string
    benefitsQuestion: string
    benefitsBody: string
    qualifyQuestion: string
    qualifyBody: string
  }
>
export const pgDescriptionText = {
  en: { ...dictionaries.en.pgDescriptionText },
  sv: { ...dictionaries.sv.pgDescriptionText }
} as unknown as Record<
  Locale,
  {
    heading: string
    intro: string
    areasIntro: string
    eventsHeading: string
    eventsBody: string
    premisesHeading: string
    premisesBody: string
    marketingHeading: string
    marketingBody: string
  }
>
export const recruitmentDescriptionText = {
  en: { ...dictionaries.en.recruitmentDescriptionText },
  sv: { ...dictionaries.sv.recruitmentDescriptionText }
} as unknown as Record<
  Locale,
  {
    paragraphs: [string, string, string]
    benefits: string[]
    closingPrefix: string
    here: string
    closingMiddle: string
    hrLabel: string
  }
>
export const translations = {
  en: { ...dictionaries.en.translations },
  sv: { ...dictionaries.sv.translations }
} as unknown as Record<
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
    atTheFair: string
    companies: string
    aboutArmada: string
    joinArmada: string
    meetTheTeam: string
    readOurBlog: string
    languageToggle: string
    inPartnershipWith: string
    memberOf: string
    navDescriptions: {
      exhibitorSignup: string
      kits: string
      whyArmada: string
      timeline: string
      exhibitorEvents: string
      exhibitorsList: string
      studentEvents: string
      recruitment: string
      map: string
      atTheFair: string
      aboutArmada: string
      team: string
      blog: string
    }
  }
>
export const pageTranslations = {
  en: { ...dictionaries.en.pageTranslations },
  sv: { ...dictionaries.sv.pageTranslations }
} as unknown as Record<
  Locale,
  {
    home: {
      heroHeading: string
      heroDescription: string
      visitorLabels: {
        visits: string
        students: string
        networking: string
      }
      countdownLabels: {
        days: string
        hours: string
        minutes: string
        seconds: string
        fairIsLive: string
      }
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
>
