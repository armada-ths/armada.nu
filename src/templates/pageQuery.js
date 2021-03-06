import React from 'react'
import { graphql } from 'gatsby'

import { Helmet } from 'react-helmet'
import Layout from '../components/Layout'
import './page.scss'

import Homepage from '../layouts/Homepage'
import RecruitmentPage from '../layouts/RecruitmentPage'
import SustainabilityPage from '../layouts/SustainabilityPage'
import FAQPage from '../layouts/FAQpage'
import ContactPage from '../layouts/ContactPage'
import AboutPage from '../layouts/AboutPage'
import DiversityPage from '../layouts/DiversityPage'
import ExhibitorInfo from '../layouts/ExhibitorInfo'
import News from '../layouts/News'
import Exhibitors from '../layouts/Exhibitors'
import Previous from '../layouts/Previous'
import MapsPage from '../layouts/MapsPage'
import PlainPage from '../layouts/PlainPage'
import Matching from '../layouts/Matching'
import Events from '../layouts/Events'
import Coffee from '../layouts/Coffee'
import Partners from '../layouts/Partners'
import forStudentsPage from '../layouts/forStudentsPage'
import KnightecPage from '../layouts/KnightecPage'
import CompetitionPage from '../layouts/CompetitionPage'
import Banquet from '../layouts/Banquet'

const components = {
  RecruitmentPage: RecruitmentPage,
  SustainabilityPage: SustainabilityPage,
  DiversityPage: DiversityPage,
  FAQPage: FAQPage,
  Homepage: Homepage,
  ExhibitorInfo: ExhibitorInfo,
  AboutPage: AboutPage,
  ContactPage: ContactPage,
  News: News,
  Exhibitors: Exhibitors,
  Previous: Previous,
  MapsPage: MapsPage,
  PlainPage: PlainPage,
  Matching: Matching,
  Events: Events,
  Coffee: Coffee,
  Partners: Partners,
  forStudentsPage: forStudentsPage,
  KnightecPage: KnightecPage,
  CompetitionPage: CompetitionPage,
  Banquet: Banquet,
};

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { mdx } = data // data.markdownRemark holds your post data
  const { frontmatter } = mdx
  const { layout } = frontmatter
  return (<>
    <Helmet
      title={frontmatter.title}
      meta={[
        { name: 'description', content: 'Sample' },
        { name: 'keywords', content: 'sample, something' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ]}
    >
    </Helmet><Layout jumbotron={!frontmatter.noJumbotron} location={frontmatter.slug} header={frontmatter.header}>
    {components[layout] ? React.createElement(components[layout], mdx) : null}
  </Layout>
  </>)
}

export const pageQuery = graphql`
  query($slug: String!) {
    mdx(frontmatter: { slug: { eq: $slug } }) {
      body
      frontmatter {
        date
        slug
        title
        header
        layout
        cover_wide
        ingress
        noJumbotron
      }
    }
  }
`
