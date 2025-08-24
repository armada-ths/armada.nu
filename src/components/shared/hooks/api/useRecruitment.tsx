// import { env } from "@/env"
import { useQuery } from "@tanstack/react-query"

export interface Recruitment {
  name: string
  link: string
  start_date: string
  end_date: string
  groups: Record<string, RecruitmentGroup[]>
}

interface RecruitmentGroup {
  name: string
  parent: null
  description: string
}

export async function fetchRecruitment(options?: RequestInit) {
  /*const res = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/api/recruitment`,
    options ?? {
      cache: "no-cache"
    }
  )
  const result = await res.json()
  if (result == null || !Array.isArray(result) || result.length <= 0)
    return null
  return result[0] as Recruitment*/

  //returning null when recruitment is not open

  const staticRecruitment: Recruitment = {
    name: "Host Recruitment",
    link: "https://app.eventro.se/recruitments/4a2402b0-364d-4a58-923e-c93d816ea2da",
    start_date: "2025-08-25",
    end_date: "2025-09-22",
    groups: {
      "Human Resources and Diversity": [
        {
          name: "University Relations Host",
          parent: null,
          description:
            "As a University Relations Host, you will be responsible for welcoming and guiding the representatives from universities visiting the fair across Sweden and Northern Europe. Your primary responsibilities include organizing a banquet for the visiting  universities and managing their details such as their accommodation, food, and entertainment. You will also be responsible for guiding the university representatives throughout the fair during the career fair days and answering the questions they might have. This roles requires strong teamwork, a sociable and service-oriented attitude and a passion for creating memorable experiences for the visitors."
        },
        {
          name: "Banquet Decor Host",
          parent: null,
          description:
            "As a Banquet Decor Host you will be part of the crew behind Armada’s yearly Banquet. From mapping out ideas to crafting decorations and preparing the venue, you’ll help bring the theme to life. Create an unforgettable atmosphere filled with adventure and wonder!\n\nThe work will consist of two main parts: \n\n - Preparation before the banquet: This includes a variety of creative projects, such as the making of banquet decorations. \n\n - Set-up during the day of the banquet: You will help with preparations before, during and after the banquet.This includes setting up and taking down the decorations, as well as taking care of the guests before the dinner."
        },
        {
          name: "Banquet Operations Host",
          parent: null,
          description:
            "As a Banquet Operation Host you will be a part of the team that organizes Armada’s yearly Banquet. You will help  with preparations before, during and after the banquet and on the day of the banquet to set up at the venue and make sure that everything is ready for when the banquet starts! \n\nThe work will consist of two main parts: \n\n - Preparation before the banquet. This includes a lot of different types of crafts, for example with the banquet decoration.\n\n - Set-up during the day of the banquet. This includes making sure that everything is in its place and that the things are ready for when the guests arrive and taking care of the guests before the dinner."
        },
      ],
      "Business Relations and Events": [
        {
          name: "Event Host",
          parent: null,
          description:
            "As an Event Host, you will be part of the team that organizes events from start to end. You will work closely with company representatives along with the rest of your team. The role requires responsibility and the ability to prioritize as well as being a good communicator, decision maker and executor. Furthermore, you should be a team player and problem solver, with the adaptability and flexibility to handle changes. \n\nEvent hosts tasks include:\n\n - Show up on time, responsible for 3 events(at least) \n\n - Secure and set up everything at the location of the event. \n\n - Arranging and distributing food, refreshments and other supplies  during the events."
        },
      ],
      "Marketing and Communications": [
        {
          name: "Photographer",
          parent: null,
          description:
            "As a Photographer Host you will be a part of the team that documents and markets the activities and the life of Armada. You will be assigned under the Photo Team Coordinator and together you will photograph Armada’s different events, the fair and the banquet. You will work closely with the rest of the marketing and communications department and aid with any photo-related tasks. This role is perfect for you that is positive, outgoing and has a creative eye. Previous experience of photography and work samples from events are a bonus."
        },
        {
          name: "Film Crew Host",
          parent: null,
          description:
            "As a Film Crew Host, you will be a part of the marketing team and help document the activities we do in Armada. Your responsibilities will include filming various events and supporting creative tasks, such as producing content for social media. This role is perfect for you if you consider yourself a creative and responsible person, and have an eye for the visual storytelling! No previous film experience is required, but it’s a bonus if you know how to work a camera or have knowledge on how to use other tools to create something visually pleasing."
        },
        {
          name: "Graphic Designer",
          parent: null,
          description:
            "As a Graphic Designer, you will work closely with the Head of Creative and the rest of the Project Team. You will get the chance to design digital and physical marketing material with your own creative ideas for students and companies to see. You will get to be part of a close-knit team who will together work towards making this the most visually striking edition of Armada to date. It is your opportunity to learn new skills and let your creative imaginations come to life for your peers and several professionals to see and appreciate."
        },
      ],
      "Logistics and Fair": [
        {
          name: "Task Force or Logistics Host",
          parent: null,
          description:
            "As a Task Force or Logistics Host, you will be a part of the team which will keep the fair going smoothly; you will be responsible for maintaining the technical parts and logistic flow related to the Career Fair. As a member of this team you will be communicating with several other teams as well as your team lead. As a Task Force or Logistics host you should be organized, good at communication, and a practical problem solver.\n\nTask Force or Logistics hosts tasks include:\n\n - Help out with transportation of tools and equipments to the fair area\n\n - Remove all furniture in Nymble and make space for our fantastic fair\n\n - Get the exhibitors’ goods from the loading dock to their assigned spots\n\n - Help with technical and non technical issues that can arise before and during the fair\n\n - Keeping track of inventory"
        },
        {
          name: "Career Fair Host",
          parent: null,
          description:
            "You will be responsible for being the primary contact with several companies! The main task is to provide the best possible service before, during and after the career fair days. As a host, you need to be responsible, punctual and attentive. You will be in the middle of the fair and be the face forward for Armada.\n\nCareer Fair hosts tasks include:\n\n - Ensuring that companies have a smooth participation in the fair\n\n - Build and decorate company rooms at Nymble."
        },
        {
          name: "Lounge Host",
          parent: null,
          description:
            "Are you social, service-minded, and enjoy creating a great atmosphere? As a Lounge Host, you’ll make our Student and Exhibitor Lounges welcoming, stocked, and running smoothly. You’ll help guests with questions, keep snacks and drinks flowing, and ensure everyone feels comfortable. The role offers close contact with exhibitors and a chance to build valuable connections, perfect if you enjoy teamwork, problem-solving, and delivering a warm experience. A positive attitude, quick thinking, and willingness to roll up your sleeves are key."
        },
        {
          name: "Service Host",
          parent: null,
          description:
            "As a Service Host, you’ll be the face of Armada at info desks and wardrobes, ensuring a smooth and enjoyable fair for exhibitors, visitors, and teammates. You’ll answer questions, solve problems, and keep things moving — even under pressure. The role calls for initiative, clear communication, and practical problem-solving. It’s ideal for someone proactive, organized, and eager to help wherever needed.\n\nKey attributes of a Service Team host:\n\n - Excellent communication and interpersonal skills\n\n - Ability to stay calm and organized under pressure\n\n - Proactive, solution-focused approach with an eye for detail\n\n - Flexibility and readiness to take on different responsibilities"
        },
      ],

    }
  }

  return staticRecruitment
}

export function useRecruitment(options?: RequestInit) {
  return useQuery({
    queryKey: ["recruitment"],
    queryFn: () => fetchRecruitment(options)
  })
}
