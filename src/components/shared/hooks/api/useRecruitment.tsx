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
    name: "Fair and Logistics - Operation Team Recruitment",
    link: "https://app.eventro.se/recruitments/edbf34d6-9bdc-4212-9a7e-b5e73e6eb009",
    start_date: "2025-03-31",
    end_date: "2025-04-28",
    groups: {
      "Fair & Logistics Operating Team": [
        {
          name: "Talent Coordinator",
          parent: null,
          description:
            "As a Talent Coordinator, you will lead the host recruitment drive in the fall, working with the Head of  Human Resources & Diversity and collaborating with the Events and Marketing teams to find and match candidates to suitable roles. You will also organize the Armada Party, the grand celebration at the end of the fair. Strong communication and interpersonal skills are essential, as this role involves coordinating across teams to ensure a smooth recruitment process and a successful event."
        },
        {
          name: "Diversity Coordinator",
          parent: null,
          description:
            "As the Diversity Coordinator, you will drive Armada’s commitment to inclusivity, equality, and diversity in collaboration with the Head of Sustainability and  Head of  Human Resources & Diversity. Your role will span recruitment, team-building, media engagements, and more, ensuring diversity is embedded across all initiatives. Additionally, you will lead the organization of Diversity Day & Room, Armada’s key events. An open-minded approach, willingness to challenge norms, and a strong passion for diversity are essential to making a meaningful impact in this role."
        },
        {
          name: "Team Leader: University Relations",
          parent: null,
          description:
            "This role requires you to work closely with the Talent coordinators to support the host recruitment drive during fall for Armada. Therefore, you will also co-manage the coffee campaigns and assist in team-building activities during the recruitment drive. During the fair, you will be responsible for hosting the other universities taking part in the fair and organizing the alternative Banquet with the help of your hosts. Creativity is crucial and you need to be good at organizing and delegating tasks for this role."
        },
        {
          name: "Team Leader: Host Coordinator",
          parent: null,
          description:
            "As a Host Coordinator, you will be responsible for the recruitment and management of the host team. You will work closely with the Talent Coordinators to ensure a smooth recruitment process and a successful event. Strong communication and interpersonal skills are essential, as this role involves coordinating across teams to ensure a smooth recruitment process and a successful event."
        },
        {
          name: "Team Leader: Operations",
          parent: null,
          description:
            "As the Team Leader of Logistics  within the Banquet team, your main responsibilities are to ensure that the event, the  preparations and the post-event breakdown of the banquet will be as smooth as possible. This includes transportation of goods, decorations and personnel to and from the venue. You’ll be responsible for a small team of banquet hosts during the event. Structure, independence, and communication is key for this role, as well as being able to adapt to unexpected situations."
        },
        {
          name: "Team Leader: Creative",
          parent: null,
          description:
            "As the Team Leader of Creative within the Banquet team, your main responsibility will be to shape the banquet to fit the chosen theme. You will be expected to stay within a given budget. During the day of the event, you will be responsible over a small team of banquet hosts and will be responsible for the set up and breakdown of the venue, aided by the banquet operations team. Structure, independence, and communication is key for this role, but creativity will also be merited."
        },
        {
          name: "Team Leader: Entertainment",
          parent: null,
          description:
            "As the Team Leader of Entertainment within the Banquet team, your main responsibility will be to find and book a master of ceremonies, entertainment and performers for the event. You will also be expected to plan and structure the banquet schedule in detail while staying within budget. Structure, independence, communication and drive is crucial for success in this role."
        },
        {
          name: "Coordinator",
          parent: null,
          description:
            "As the Coordinator in the Banquet team, your main responsibility will be managing everything related to the guests. With support from the rest of the team you will be in charge of planning the seating arrangement, putting together a guest list for both the banquet and the after party, and seeing to the guest's dietary needs. Structure, independence and communication is key for this role."
        }
      ]
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
