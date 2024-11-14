export const FILTERS_LOCAL_STORAGE_KEY = "mapFilters"

export interface SurveyData {
  Programme: string
  JobType?: string[]
  IndustryType?: string[]
}

export const programmeList = [
  "Architecture",
  "Biotechnology",
  "Building Engineering",
  "Chemical Engineering",
  "Computer Science",
  "Electrical Engineering",
  "Engineering and Education",
  "Environmental & Sustainability Engineering",
  "Industrial Engineering",
  "Industrial Economics",
  "Information Technology",
  "Engineering Mathematics",
  "Material design",
  "Mechanical Engineering",
  "Media Technology",
  "Medical Engineering",
  "Material & Product Design",
  "Engineering Physics",
  "Vehicle Engineering",
  "Urban Management Engineering",
  "Open",
  "Other"
]

export const jobTypeList = [
  "Full-time",
  "Internship",
  "Part-time",
  "Trainee",
  "Summer job",
  "Bachelor thesis",
  "Master thesis"
]

export const industryTypeList = [
  "Architecture",
  "Biotechnology",
  "Chemical Science and Engineering",
  "Computer Science and Engineering",
  "Electrical Engineering",
  "Engineering Physics",
  "Environmental Engineering",
  "Industrial Management",
  "Information and Communication Technology",
  "Material Science and Engineering",
  "Mathematics",
  "Medical Engineering",
  "Technology and Economics",
  "Technology and Health",
  "Technology and Learning",
  "Technology and Management",
  "The Built Environment"
]
