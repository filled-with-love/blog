import React from 'react';
import { graphql } from 'gatsby';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Layout from '../components/Layout';
import Link from '../components/Link';
import Container from 'components/Container';
import { rhythm } from '../lib/typography';
import theme from '../../config/theme';

const Hero = () => (
  <section
    css={css`
      * {
        color: ${theme.colors.white};
      }
      width: 100%;
      background: ${theme.brand.primary};
      padding: 20px 0 30px 0;
      display: flex;
    `}
  >
    <Container
      css={css`
        display: flex;
        flex-direction: column;
      `}
    >
      <h1
        css={css`
          position: relative;
          z-index: 5;
          line-height: 1.5;
          margin: 0;
          max-width: ${rhythm(15)};
        `}
      >
        Some thoughts that we have
      </h1>
    </Container>
    <div
      css={css`
        height: 150px;
        overflow: hidden;
      `}
    />
  </section>
);

const PostTitle = styled.h2`
  margin-bottom: ${rhythm(0.3)};
  transition: ${theme.transition.ease};
  :hover {
    color: ${theme.brand.primary};
    transition: ${theme.transition.ease};
  }
`;

const Description = styled.p`
  margin-bottom: 10px;
  display: inline-block;
`;

export default function Index({ data: { site, allContentfulBlogPost } }) {
  return (
    <Layout
      site={site}
      headerColor={theme.colors.white}
      headerBg={theme.brand.primary}
      noSubscribeForm
    >
      <Hero />
      <Container
        css={css`
          padding-bottom: 0;
        `}
      >
        {allContentfulBlogPost.edges.map(({ node: post }) => (
          <div
            key={post.id}
            css={css`
              margin-bottom: 40px;
            `}
          >
            <Link to={post.slug} aria-label={`View ${post.title}`}>
              <PostTitle>{post.title}</PostTitle>
            </Link>
            <Description>
              {post.description.description}{' '}
              <Link to={post.slug} aria-label={`View ${post.title}`}>
                Read Article →
              </Link>
            </Description>
            <span />
          </div>
        ))}
        <hr />
      </Container>
    </Layout>
  );
}

export const pageQuery = graphql`
  query {
    site {
      ...site
      siteMetadata {
        title
      }
    }
    allContentfulBlogPost(limit: 5, sort: { fields: [publishDate], order: DESC }) {
      edges {
        node {
          id
          title
          slug
          date: publishDate(formatString: "MMMM DD, YYYY")
          description {
            description
          }
          slug
          keywords: tags
        }
      }
    }
  }
`;
