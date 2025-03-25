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
  return null

  const staticRecruitment: Recruitment = {
    name: "Marketing & Communications - Operation Team Recruitment",
    link: "https://app.eventro.se/recruitments/b55c85c1-347b-4f54-bdb8-c4deb4b24806",
    start_date: "2025-02-28",
    end_date: "2025-03-24",
    groups: {
      "Marketing & Communications Operating Team": [
        {
          name: "Social Media Manager",
          parent: null,
          description:
            "As Social Media Manager, you will be responsible for bringing Armada to life online through Instagram, Facebook, and TikTok. Your main tasks include planning and executing marketing campaigns, engaging with followers, and creating short-form content that offers insight into the Armada organization. You will work closely with the Head of Media & Marketing and the graphic design team to maintain a strong and creative online presence. This role is ideal for someone who is proactive, outgoing, innovative and passionate about digital communication."
        },
        {
          name: "Team Leader: Photo ",
          parent: null,
          description:
            "As Photo Team Coordinator, you will take the lead in capturing and curating Armada’s visual identity. In the spring, you will serve as Armada’s primary photographer, and in the autumn, you will lead a team to document all major events, including the fair, panels, and banquet. Your work will contribute to the website, social media, and various campaigns. You will collaborate closely with the film team to ensure cohesive visual storytelling. This role is ideal for someone who is detail oriented and a good planner. An interest in photography, photo editing, and creative direction is essential for this role."
        },
        {
          name: "Team Leader: Film Crew Coordinator",
          parent: null,
          description:
            "As Film Crew Coordinator, you will lead Armada’s film team, overseeing the creation of video content that captures the spirit of the event. Your responsibilities include planning and organizing projects, coordinating the team, and ensuring high-quality production. You will work closely with a dynamic group to produce everything from short-form videos for social media to larger branding films. A strong interest in video production, teamwork, and storytelling is key. Previous experience in filming and editing is meritorious."
        },
        {
          name: "Team Leader: Film Crew ",
          parent: null,
          description:
            "As part of Armada’s Film Crew, you will play a key role in creating video content for the organization. The team will work on a variety of projects, ranging from short promotional videos for social media to larger branding films, including the highly anticipated banquet video. You will collaborate closely with a small team to bring Armada’s vision to life through engaging visual storytelling. A passion for filmmaking, creativity, and teamwork is essential. Experience in video recording and editing is meritorious."
        },
        {
          name: "Graphic Designer",
          parent: null,
          description:
            "As a Graphic Designer of Armada 2025 you will be part of a dynamic and creative team, collaborating with several stakeholders. Expanding upon the established visual identity for this year’s edition, you'll have the autonomy to infuse your creativity into each design, encouraging you to explore and acquire new skills to enhance your qualities. In the team you will get to come up with innovative ideas, create iterations and refine concepts to deliver outstanding visual solutions. It’s your opportunity to make your imaginations come to life in ways that inspire and engage to not only meet but exceed the expectations of students and companies alike, reflecting the vision of our team and overarching goal to make this the most visually striking edition of Armada to date."
        },
        {
          name: "Frontend Developer",
          parent: null,
          description:
            "As a web developer for Armada, you will work with front-end focused web development and be in a team with three other web developers, one UX/UI designer, and one Head of Web Development. In addition to this, you will be part of the larger team. As a front-end developer, you will work very closely with the back-end team as well. \n\n You are creative, have a passion for building things with the user in mind, and most importantly have a strong interest in learning more about front-end web development. Your passion and engagement are highly valued in combination with good collaboration skills. You will be working with HTML5, CSS, Javascript, React, and data fetching from API:s and Github as a version control tool. We will also work extensively with documentation using something similar to Storybook for our components. Having these skills is meritorious, but not required to have. Our main focus is that you should have fun while developing some awesome stuff and use this as an opportunity to learn more and gain valuable developer experience!"
        },
        {
          name: "UX/UI Designer",
          parent: null,
          description:
            "As a UX/UI designer at Armada, you will be designing and enabling features to improve the user experience both on Armada's website as well as in our internal systems. Your designs will be the backbone to updating and creating new content for Armada’s experiences. You will be a part of the web team responsible for the website. \n\nYou are creative, have a passion for designing with the user in mind and most importantly have a strong interest in user experience design. Your passion and engagement are highly valued in combination with good communication skills. Prior familiarity with using digital design tools such as Figma is valued and knowledge about atomic design methodology, but the most important thing is that you are committed and eager to learn."
        },
        {
          name: "Backend Developer",
          parent: null,
          description:
            "As a backend developer, your primary responsibility will be to maintain and improve THS Armada’s internal IT systems. The systems support the recruitment process, tickets and CRM to mention some areas. You will be a part of the web team responsible for the website. \n\nThe backend developers will take part in the creation of new functionality with the ambition to provide the best digital experience possible for the end users. It will be possible to do some front-end work as well. As a backend developer. You will be working with Python, Django, HTML/CSS, Github, and PostgreSQL databases. Prior knowledge is valued, but the most important thing is that you are committed and eager to learn."
        },
        {
          name: "Fullstack Developer",
          parent: null,
          description:
            "As a fullstack developer, you are a jack of all trades when it comes to the development of an application but not a master.  You will serve both the backend and frontend when needed but work mostly with integration to the user end. You will be part of the web team responsible for the website. \n\n The fullstack developers will take part in the creation of new functionality with the ambition to provide the best digital experience possible for the end users. It will be possible to do some front-end work as well. As a fullstack developer. You will be working with Python, Django, HTML/CSS, Github, PostgreSQL, HTML5, CSS, Javascript, React, and data fetching from API:s. Prior knowledge is valued, but the most important thing is that you are committed and eager to learn."
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
