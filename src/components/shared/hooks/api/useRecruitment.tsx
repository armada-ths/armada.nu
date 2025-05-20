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
  // const staticRecruitment: Recruitment = {
  //   name: "Operation Team Recruitment",
  //   link: "https://app.eventro.se/recruitments/edbf34d6-9bdc-4212-9a7e-b5e73e6eb009",
  //   start_date: "2025-03-31",
  //   end_date: "2025-04-28",
  //   groups: {
  //     "Operation Team": [
  //       {
  //         name: "Team Leader: Task Force",
  //         parent: null,
  //         description:
  //           "As a Task force Team Leader, you are responsible for planning and maintaining the technical parts and logistic flow related to the Career Fair, for example planning the electrical supply to each company. You will work closely with the Head of Logistics, and Logistics Coordinator. Furthermore you will be leading Armadas “handyperson team,”  meaning you will oversee a small team that will help with the logistical flow and maintenance before, during and after the fair. You and your team will also collaborate with the Career Fair Team to keep the Career Fair site clean and free from tripping hazards. \n\n If a company or an Armada Team member is in need of any help, you and your team will come to the rescue. As a Task Force Team Leader, you should be organized, like planning,  be a practical problem solver, and be comfortable in the role as a leader."
  //       },
  //       {
  //         name: "Logistics Coordinator",
  //         parent: null,
  //         description:
  //           "Armada Transport is a service offered to companies where their equipment used during the fair is transported to the KTH campus and back after the end of the Career Fair. As a Logistics Coordinator you will work closely with the Task Force Team Leader and the Head of Logistics in the planning of the external and internal transportation and storage of deliveries. You will be seeing the plan through until after the Career Fair. \n\n Your ideas and planning skills will be valuable in making the Armada Transport work as smoothly as possible.  Furthermore you will compose informational texts regarding the Armada Transport and communicate with the exhibitors with questions concerning the transportation.  As a Logistics Coordinator you should be structured, adaptive and you embrace new encounters."
  //       },
  //       {
  //         name: "Team Leader: Career Fair",
  //         parent: null,
  //         description:
  //           "As a Career Fair Team Leader, you will play a crucial role in ensuring the success of THS Armada. Your main responsibility will be to lead and coordinate a team of hosts, ensuring that both your team and the exhibitors assigned to you have a smooth and productive experience during the fair. Your key responsibilities will include acting as a primary point of contact for exhibitors, ensuring they receive the support they need before and during the fair. Additionally, you will assist in the planning phase by providing input on decorations, general layout, and contributing to the physical setup of the fair. \n\nTo thrive in this role, you should be well-organized, proactive, and an effective communicator. You will be working closely with other members of the Operations Team, as well as Armada’s Project Group. You will also need to make independent decisions, manage your team efficiently, and maintain a holistic understanding of the project. This position offers a unique opportunity to develop leadership skills, work in a dynamic international environment, and build strong connections with companies and students alike."
  //       },
  //       {
  //         name: "Team Leader: Lounge",
  //         parent: null,
  //         description:
  //           "As a Lounge Team Leader, you’ll help create and run some of the most appreciated spaces at Armada – the lounges. These are places where people can relax, recharge and grab a coffee during the fair. You’ll be part of shaping how the lounges look and feel, keeping them stocked and welcoming, and making sure everything runs smoothly during the event. Together with your team of hosts, you’ll make sure the lounges stay fresh, functional and comfortable. We’re looking for someone who’s hands-on, enjoys taking initiative and wants to create a space people genuinely enjoy being in."
  //       },
  //       {
  //         name: "Team Leader: Service",
  //         parent: null,
  //         description:
  //           "THS Armada's goal is to make exhibitors and visitors feel welcomed, and bring them amazing service. You will be responsible for delivering high-quality services in the lead-up to and during the fair. The team leaders will coordinate a group of hosts throughout the event. You’ll be running our service stations, answering questions, and leading your team to ensure everything runs smoothly. We're looking for someone who’s communicative, proactive and enjoys solving problems together with others – someone who leads with confidence and isn’t afraid to think outside the box when challenges pop up."
  //       },
  //       {
  //         name: "Sustainability Coordinator",
  //         parent: null,
  //         description:
  //           "As a Sustainability Coordinator, you will play a crucial role in integrating sustainability into Armada’s career fair and events. Working closely with the Head of Sustainability, you will take the lead in planning the Green Room, evaluating companies based on sustainability criteria, and curating interactive activities for the visitors. A key part of your role will be organizing Sustainability Day, where you will coordinate panel discussions and lectures on the environmental impact of industrial initiatives. Beyond event planning, you will also collaborate with other teams to develop an effective waste management strategy, ensuring compliance with relevant regulations. Additionally, you will contribute to reviewing and updating the Armada sustainability policy to drive continuous improvement. We are looking for creative individuals with strong organizational skills, strategic thinking, and a genuine passion for sustainability - qualities that will help make a lasting impact on the career fair."
  //       },
  //       {
  //         name: "Team Leader: Event",
  //         parent: null,
  //         description:
  //           "The Team Leader of Events will form a team to design, plan, and execute the corporate events of THS Armada, like lunch lectures, field visit, panel discussion, after works and a few other exciting events. The team will work together towards common goals, although each team leader will be individually responsible for their events with the company, commonly other leader will support you too. Working on one's own initiative is, therefore, a key factor, along with being organized and communicative. You and the other Event Team Leaders will be responsible for a group of hosts. You will coordinate and lead your group, focusing on effective communication and strong teamwork. This will assist you in enhancing your management and leadership skills. Further, you will be able to network with company professionals on an individual level and with your mates working in the group."
  //       },
  //       {
  //         name: "Talent Coordinator",
  //         parent: null,
  //         description:
  //           "As a Talent Coordinator, you will lead the host recruitment drive in the fall, working with the Head of  Human Resources & Diversity and collaborating with the Events and Marketing teams to find and match candidates to suitable roles. You will also organize the Armada Party, the grand celebration at the end of the fair. Strong communication and interpersonal skills are essential, as this role involves coordinating across teams to ensure a smooth recruitment process and a successful event."
  //       },
  //       {
  //         name: "Diversity Coordinator",
  //         parent: null,
  //         description:
  //           "As the Diversity Coordinator, you will drive Armada’s commitment to inclusivity, equality, and diversity in collaboration with the Head of Sustainability and  Head of  Human Resources & Diversity. Your role will span recruitment, team-building, media engagements, and more, ensuring diversity is embedded across all initiatives. Additionally, you will lead the organization of Diversity Day & Room, Armada’s key events. An open-minded approach, willingness to challenge norms, and a strong passion for diversity are essential to making a meaningful impact in this role."
  //       },
  //       {
  //         name: "Team Leader: University Relations",
  //         parent: null,
  //         description:
  //           "This role requires you to work closely with the Talent coordinators to support the host recruitment drive during fall for Armada. Therefore, you will also co-manage the coffee campaigns and assist in team-building activities during the recruitment drive. During the fair, you will be responsible for hosting the other universities taking part in the fair and organizing the alternative Banquet with the help of your hosts. Creativity is crucial and you need to be good at organizing and delegating tasks for this role."
  //       },
  //       {
  //         name: "Banquet Team Leader: Operations",
  //         parent: null,
  //         description:
  //           "As the Team Leader of Logistics  within the Banquet team, your main responsibilities are to ensure that the event, the  preparations and the post-event breakdown of the banquet will be as smooth as possible. This includes transportation of goods, decorations and personnel to and from the venue. You’ll be responsible for a small team of banquet hosts during the event. Structure, independence, and communication is key for this role, as well as being able to adapt to unexpected situations."
  //       },
  //       {
  //         name: "Banquet Team Leader: Creative",
  //         parent: null,
  //         description:
  //           "As the Team Leader of Creative within the Banquet team, your main responsibility will be to shape the banquet to fit the chosen theme. You will be expected to stay within a given budget. During the day of the event, you will be responsible over a small team of banquet hosts and will be responsible for the set up and breakdown of the venue, aided by the banquet operations team. Structure, independence, and communication is key for this role, but creativity will also be merited."
  //       },
  //       {
  //         name: "Banquet Team Leader: Entertainment",
  //         parent: null,
  //         description:
  //           "As the Team Leader of Entertainment within the Banquet team, your main responsibility will be to find and book a master of ceremonies, entertainment and performers for the event. You will also be expected to plan and structure the banquet schedule in detail while staying within budget. Structure, independence, communication and drive is crucial for success in this role."
  //       },
  //       {
  //         name: "Banquet Coordinator",
  //         parent: null,
  //         description:
  //           "As the Coordinator in the Banquet team, your main responsibility will be managing everything related to the guests. With support from the rest of the team you will be in charge of planning the seating arrangement, putting together a guest list for both the banquet and the after party, and seeing to the guest's dietary needs. Structure, independence and communication is key for this role."
  //       }
  //     ]
  //   }
  // }

  // return staticRecruitment
  return null
}

export function useRecruitment(options?: RequestInit) {
  return useQuery({
    queryKey: ["recruitment"],
    queryFn: () => fetchRecruitment(options)
  })
}
