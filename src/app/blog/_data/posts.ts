export interface BlogPost {
    id: number
    userId: number
    title: string
    text: string
    author: string
    createdAt: Date
    image: string
}

export const mockPosts: BlogPost[] = [
    {
        id: 1,
        userId: 101,
        title: "Message from the web team",
        text: "Hello students and exhibitors!\n\nWe are the web team responsible for this site. We are currently working on **rebranding this site** but are rolling out a new feature for you in the likes of *The Armada Blog*.\n\nThe Armada Blog will consist of:\n\n- Write-ups from the team\n- Behind-the-scenes content\n- Updates on fair preparations\n\n![The fair in action](/fair_pictures/49122320697_07018807e8_b.jpg)\n\nSet sail for success!",
        author: "The web development team",
        createdAt: new Date("2025-06-26T09:00:00"),
        image: "/fair_pictures/53396623064_73cf227691_k.jpg"
    },
    {
        id: 2,
        userId: 102,
        title: "Behind the scenes: Building the fair",
        text: "Ever wondered what it takes to set up one of Scandinavia's largest career fairs? It's a massive effort that involves months of planning and coordination.\n\nFrom logistics to design, every detail matters. Our teams work around the clock in the weeks leading up to the fair to make sure everything runs smoothly.\n\nThis year we're introducing new zones and interactive areas to make the experience even better for both students and exhibitors. Stay tuned for more details!",
        author: "The project group",
        createdAt: new Date("2025-07-10T14:00:00"),
        image: "/fair_pictures/49122177522_2254664059_k.jpg"
    },
    {
        id: 3,
        userId: 103,
        title: "Meet the team: Marketing",
        text: "The marketing team is the voice of Armada. We handle everything from social media to print materials, making sure the fair reaches as many students and companies as possible.\n\nThis year our focus has been on creating a cohesive brand identity that reflects Armada's values: innovation, connection, and opportunity.\n\nWe've loved every moment of this journey and can't wait to share what we've been working on with you!",
        author: "The marketing team",
        createdAt: new Date("2025-07-22T11:00:00"),
        image: "/fair_pictures/53396320116_90445f73af_k.jpg"
    },
    {
        id: 4,
        userId: 104,
        title: "Exhibitor spotlight: What to expect",
        text: "Curious about what exhibitors bring to the table? Each year, top companies from various industries come to Armada to meet talented students from KTH.\n\nFrom tech giants to innovative startups, the diversity of exhibitors is what makes Armada special. You'll find opportunities in engineering, sustainability, finance, and so much more.\n\nPro tip: Come prepared with questions and an updated CV. First impressions matter!",
        author: "The exhibitor relations team",
        createdAt: new Date("2025-08-05T10:00:00"),
        image: "/fair_pictures/49121636638_e64f8376c7_o.jpg"
    },
    {
        id: 5,
        userId: 105,
        title: "Student tips for the fair",
        text: "The career fair is your chance to make connections that could shape your future. Here are some tips to make the most of it.\n\n## Before the fair\n\nDo your research beforehand — check which exhibitors are attending and **prioritize the ones you're most interested in**. Dress professionally but comfortably, you'll be on your feet all day.\n\n## At the fair\n\n1. Bring copies of your CV\n2. Prepare a short *elevator pitch*\n3. Ask thoughtful questions\n\n> Don't be afraid to approach companies you haven't heard of. Some of the best opportunities come from unexpected places.\n\nAnd most importantly, **be yourself**!",
        author: "The student relations team",
        createdAt: new Date("2025-08-15T09:30:00"),
        image: "/fair_pictures/52520926612_8f5d642178_c.jpg"
    },
    {
        id: 6,
        userId: 106,
        title: "Sustainability at Armada",
        text: "Sustainability is at the core of everything we do at Armada. This year, we're taking even bigger steps to reduce our environmental footprint.\n\nFrom digital-first communication to sustainable materials at the fair, every decision is made with the planet in mind. We're also partnering with companies that share our commitment to a greener future.\n\nTogether, we can make career fairs a force for positive change.",
        author: "The sustainability team",
        createdAt: new Date("2025-09-01T08:00:00"),
        image: "/fair_pictures/52521081094_8f551d2114_c.jpg"
    }
]

export function getPostById(id: number): BlogPost | undefined {
    return mockPosts.find(post => post.id === id)
}
