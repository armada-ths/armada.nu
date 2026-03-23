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
  void options

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
    name: "Operations Team 2026 Recruitment",
    link: "https://app.eventro.se/recruitments/b1f796ff-07d9-4ec4-a469-08fd183e057f",
    start_date: "2026-03-20",
    end_date: "2026-04-15",
    groups: {
      "Business Relations & Events": [
        {
          name: "Team Leader: Events",
          parent: null,
          description: `As an Event Team Leader, you are the main point of contact between THS Armada and the companies you're assigned to. You will plan, coordinate, and execute a set of corporate events, including lunch lectures, field visits, panel discussions, after works, and collaborative custom events, taking full ownership from planning to delivery.
Each Team Leader runs their events independently, but the team works closely together, sharing resources, covering for each other, and maintaining a consistent experience across all events. You will also lead and coordinate a small group of event hosts, guiding them before and during each event.

**This role is for you if you are:**

* Self-driven and comfortable taking initiative without being told what to do
* Organized, able to juggle timelines, logistics, and communication simultaneously
* A natural communicator, both with corporate professionals and fellow team members
* Interested in leadership, you'll be managing and motivating hosts on event days
* Excited to network with industry professionals in real, meaningful settings

**What you'll walk away with:**

* Hands-on experience planning and executing professional corporate events
* Leadership and team coordination experience
* A strong professional network spanning multiple industries
* Skills in client communication, logistics, and problem-solving under pressure`
        },
        {
          name: "Banquet Team Leader: Logistics & Execution",
          parent: null,
          description: `As Team Leader for Logistics & Execution, you make sure everything runs smoothly before, during, and after the banquet. You will coordinate logistics such as transportation of decorations, materials, and staff, and lead a small team of banquet hosts during the event. This role suits someone who is organized, independent, and good at solving problems when things don’t go as planned.

**Responsibilities**:

* Coordinate logistics such as transportation of decorations, materials, and staff
* Ensure preparations, setup, and breakdown run smoothly
* Lead a small team of banquet hosts during the event
* Solve practical problems if unexpected situations occur

**This role suits someone who is:**

* Organized and structured
* Independent and proactive
* Good at solving problems under pressure`
        },
        {
          name: "Banquet Team Leader: Creative & Decor",
          parent: null,
          description: `As Team Leader for Creative & Decor, you will bring the banquet theme to life. You will plan decorations and the overall atmosphere while staying within budget. On the day of the event, you will lead a small team of hosts and help set up the venue together with the operations team. This role is perfect for someone creative, organized, and eager to shape the look and feel of the event.

**Responsibilities:**

* Plan decorations and visual elements based on the theme
* Create the overall atmosphere of the banquet
* Work within the allocated budget
* Lead a small team of hosts during setup and breakdown
* Collaborate with the Operations team during the event

**This role suits someone who is:**

* Creative and imaginative
* Organized and detail-oriented
* Excited about designing the look and feel of the event`
        },
        {
          name: "Banquet Coordinator: Entertainment",
          parent: null,
          description: `As Coordinator for Entertainment, you will plan the program for the evening. This includes booking a toastmaster, performers, and other entertainment, as well as creating the banquet schedule. This role suits someone proactive, organized, and excited about creating a fun and memorable evening.

**Responsibilities:**

* Book a toastmaster and entertainment for the event
* Coordinate performers and other activities
* Plan and structure the banquet schedule
* Ensure the program stays within budget

**This role suits someone who is:**

* Proactive and driven
* Organized and good at planning
* Interested in creating a fun and memorable event`
        },
        {
          name: "Banquet Coordinator: Guest Relations",
          parent: null,
          description: `As Coordinator for Guest Relations, you will focus on the guests. You will manage the guest list, plan the seating arrangement, and ensure that dietary requirements are handled. This role is ideal for someone structured, communicative, and detail-oriented.

**Responsibilities:**

* Manage the guest list
* Plan the seating arrangement
* Ensure dietary requirements are handled
* Coordinate guest-related information with the team

**This role suits someone who is:**

* Structured and detail-oriented
* Communicative and collaborative
* Good at keeping track of information`
        }
      ],
      "Fair & Logistics": [
        {
          name: "Team Leader: Lounge",
          parent: null,
          description: `As a lounge team leader your main responsibility is to create high-quality and comfortable environments for company representatives, students, and fair staff. Together with a dedicated team of hosts, you will ensure that these spaces serve as both functional rest areas and professional networking hubs.

**Key responsibilities include:**

* Curating and overseeing the setup of the lounges to ensure they are welcoming, professional and comfortable.
* Leading and scheduling a team of hosts.
* Providing clear instruction on hospitality standards and maintenance.
* Managing the supply chain of refreshments, ensuring the lounge is consistently stocked and organized during peak hours.

**For this role, we are looking for people with the following qualities:**

* A “hands-on” approach to problem-solving.
* Strong interpersonal skills and service-oriented mindset.
* Ability to delegate tasks efficiently and structurally.

In this role, you will develop logistical management and hospitality leadership skills, gaining experience in creating high-quality networking environments, as well as managing the flow of a fast-paced large-scale event.`
        },
        {
          name: "Team Leader: Service",
          parent: null,
          description: `The Service Team Leader serves as the operational “face” of the Armada fair. You are responsible for the Information desk, the central hub for all logistical inquiries. Your mission is to ensure a seamless check-in process for participating companies and to provide professional guidance to all visitors, ensuring the fair maintains a high standard of efficiency.

**Key responsibilities include:**

* Providing accurate information to companies and students regarding schedules, location and resources.
* Managing the formal arrival and registration process for all participating company representatives
* Serving as the first point of contact regarding logistical issues.
* Directing a team of Service Hosts, ensuring the Information Desks are continuously staffed and delivering consistent service.

**For this role, we look for the following qualification in a person:**

* Good verbal communication
* A structured and organized approach to multitasking
* Calmness and clarity when navigating high-pressure or unexpected situations

This position offers growth in crisis management, corporate communication, operational oversight, as well as gaining the ability to manage public-facing operations.`
        },
        {
          name: "Team Leader: Task Force",
          parent: null,
          description: `Do you want to save the day like Agent 007 and wear a radio? As a part of the Task force team, you are responsible for planning and maintaining the technical parts and logistic flow related to the career fair, for example planning the electrical supply to each company. You will work closely with the Head of Logistics, and the Logistics team. Furthermore you will be leading Armada's “handyperson team,” meaning you will oversee a small team that will help with the logistical flow and maintenance before, during and after the fair. You and your team will also collaborate with the Career Fair Team to keep the career fair site clean and free from tripping hazards. If a company or an Armada Team member is in need of any help, you and your team will come to the rescue. As part of the Task Force team, you should be organized, like planning, be a practical problem solver, and be comfortable in the role as a leader.`
        },
        {
          name: "Team Leader: Logistics",
          parent: null,
          description: `Are you quick on your feet and can problem solve like no one else? As a part of the Logistics operations team you will work closely with the Task Force team and the Head of Logistics in the planning of the external and internal transportation and storage of deliveries. You will be seeing the plan through until after the career fair and help solve problems that occur during it.
Your ideas and planning skills will be invaluable in making the logistics and Armada Transport work as smoothly as possible. Furthermore you will compose informational texts regarding the Armada Transport and communicate with the exhibitors with questions concerning the transportation. As a part of the Logistics operations team you should be structured, adaptive and you embrace new encounters.`
        },
        {
          name: "Team Leader: Career Fair",
          parent: null,
          description: `As a Career Fair Team Leader, you will play a crucial role in ensuring the success of THS Armada. This position offers a unique opportunity to develop your leadership skills, work in a dynamic international environment, and build strong connections with companies and students alike.

**Your key responsibilities will include:**

* Being a leader to your own team
* Acting as a primary point of contact for exhibitors and ensuring they receive the support they need before and during the fair
* Assisting in the planning phase by providing input on decorations, general layout
* Constructing and deconstructing the Fair.

To thrive in this role, you should be well-organized, proactive, and an effective communicator. You will also need to make independent decisions, manage your team efficiently, and maintain a holistic understanding of the project.`
        },
        {
          name: "Security Coordinator",
          parent: null,
          description: `As a Security Coordinator, you play a pivotal role in ensuring the safety and security of the fair. You will be responsible for coordinating all security-related preparations within your assigned building, working closely with the Head of Security and other teams to plan, implement, and refine procedures. This role requires both precision and strong interpersonal skills. You will need to be organized, detail-oriented, and proactive, while also maintaining clear and effective communication with hosts, the project group, and exhibitors. The quality of your work will directly impact the execution of the fair, making this role a critical component of delivering a safe, professional, and seamless final event experience.`
        }
      ],
      "Marketing & Communications": [
        {
          name: "Team Leader: Photography",
          parent: null,
          description: `**Skills:**

* Detail oriented
* Good at communication
* Good teamplayer
* Skills with Editing Softwares (for photo editing)

**Role:**

* Responsible for overseeing photography and image management for all of Armada’s events.
* From documenting, taking photos and editing photos to publishing and storing photos.
* Should be familiar with basic photo editing.`
        },
        {
          name: "Team Leader: Videography",
          parent: null,
          description: `**Skills:**

* Detail oriented
* Good at brainstorming
* Good planner
* Good communication
* Good teamplayer
* Skills with Editing Softwares (for video editing)

**Role:**

* Responsible for overseeing videography and video management for all of Armada’s events.
* Should know how to be familiar with using editing softwares to edit videos/clips.
* Also will work with creating and editing videos for the Armada youtube.`
        },
        {
          name: "Media Production Coordinator",
          parent: null,
          description: `**Skills:**

* Previous experience in an association or organization is required, along with strong communication or content production skills to effectively oversee media planning for Armada’s events.
* Detail oriented
* Outgoing and initiative-taking
* Passionate and ambitious with their role
* Good planner
* Good communication

**Role:**

* Coordinating all media production - with film crew and photo crew- overseeing management and planning in details for all Armada events throughout the year. So all posts look good and we post quantity with quality on time!`
        },
        {
          name: "Social Media Coordinator",
          parent: null,
          description: `**Skills:**

* Outgoing
* Initiative-taking
* Trend Awareness
* Good at brainstorming, thinking out of the box
* Have a good overview of social media strategy
* Have a good overview of marketing strategies

**Role:**

* Overseas marketing of Armada.
* Making videos/tiktoks/posting on all of Armada’s social media and marketing before/after and at the fair.
* Maintain posting calendar, schedule post and stories.
* Reply to comments and DMs.
* Blog on  Armada’s  website.`
        },
        {
          name: "Graphic Designer (Coordinator)",
          parent: null,
          description: `* Be part of expanding and upholding the visual identity of Armada 2026
* Come up with new visual ideas, concepts and designs as part of a creative team
* Be encouraged to explore and develop your skills as a graphic designer
* Reach out with your designs to both students and companies
* Prior experience with graphic design, using tools such as photoshop/illustrator or similar but most importantly be willing to learn
* Open to feedback and communication
* Send portfolio when applying`
        },
        {
          name: "Web Developer (Coordinator)",
          parent: null,
          description: `As a Web Developer for Armada, you will be part of the web team responsible for building and improving this site. You will work together with other developers, a UX/UI designer, and the Head of Web, while also collaborating with the larger organization.

Even though this is a single role, the team will be self-organizing: some developers will naturally work more frontend-focused, others more backend-focused, depending on interest, strengths, and team priorities. Your work may include building interfaces and components, integrating APIs and data flows, contributing to backend functionality and system integrations, and maintaining clear documentation and version control workflows. Experience with technologies such as React, TypeScript, Next.js, and HTML/CSS is meritorious, but not required. The most important thing is that you are engaged, collaborative, and eager to learn.`
        },
        {
          name: "UI/UX Designer (Coordinator)",
          parent: null,
          description: `As a UI/UX Designer for Armada, you will be part of the web team responsible for improving the structure, usability, and visual clarity of this site. You will work together with developers and the Head of Web to plan new pages, refine user flows, and support how content is presented across the platform.

Your work may include sketching concepts, creating wireframes and mockups, testing design choices, and collaborating with developers to turn ideas into implemented features. Experience with design tools such as Figma is meritorious, but not required. The most important thing is that you are creative, communicative, and motivated to create a clear and reliable experience for users.`
        }
      ],
      "Human Resources": [
        {
          name: "Team Leader: Talent & University Relations",
          parent: null,
          description: `This role transitions from an internal HR focus in the fall to an external hospitality focus during the fair. You will drive the recruitment and integration of the entire host organization before shifting gears to act as the primary host for visiting university representatives. Your mission is to ensure these guests experience a high quality visit, culminating in the execution of the Alternate Banquet.

**Responsibilities:**

* Host Recruitment: Manage host interviews and selection, maintaining a holistic view of the organization’s needs.
* Engagement: Organize the recruitment coffee campaigns and other promotional events to attract top talent.
* Onboarding: Plan and execute the Host Kick-off to welcome and align all new members.
* University Hospitality: Act as the main point of contact and host for visiting university representatives during the fair.
* Event Management: Plan and execute the Alternate Banquet, leading a dedicated team of hosts to create a memorable experience for visiting guests.

**Competencies:**

* Communicative, People Person, Adaptable, Natural Leader, Organized

***Note:** As the Alternate Banquet occurs simultaneously with the Grand Banquet, holders of this role will host the Alternate Banquet this year and receive an exclusive invitation to the Grand Banquet 2027.*`
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
