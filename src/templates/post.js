import React from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import MDXRenderer from 'gatsby-mdx/mdx-renderer';
import SEO from 'components/SEO';
import { css } from '@emotion/core';
import Container from 'components/Container';
import Layout from '../components/Layout';
import { fonts } from '../lib/typography';
import config from '../../config/website';
import { bpMaxSM } from '../lib/breakpoints';

export default function Post({ data: { site, contentfulBlogPost }, pageContext: { next, prev } }) {
  const author = contentfulBlogPost.author.name || config.author;
  const date = contentfulBlogPost.date;
  const title = contentfulBlogPost.title;
  const banner = contentfulBlogPost.heroImage;

  const frontmatter = {
    slug: contentfulBlogPost.slug,
    date: contentfulBlogPost.date,
    description: contentfulBlogPost.description.description,
    keywords: contentfulBlogPost.tags,
  };

  return (
    <Layout site={site} frontmatter={frontmatter} noSubscribeForm>
      <SEO frontmatter={frontmatter} isBlogPost />
      <article
        css={css`
          width: 100%;
          display: flex;
        `}
      >
        <Container>
          <h1
            css={css`
              text-align: center;
              margin-bottom: 20px;
            `}
          >
            {title}
          </h1>
          <div
            css={css`
              display: flex;
              justify-content: center;
              margin-bottom: 20px;
              h3,
              span {
                text-align: center;
                font-size: 15px;
                opacity: 0.6;
                font-family: ${fonts.regular}, sans-serif;
                font-weight: normal;
                margin: 0 5px;
              }
            `}
          >
            {author && <h3>{author}</h3>}
            {author && <span>—</span>}
            {date && <h3>{date}</h3>}
          </div>
          {banner && (
            <div
              css={css`
                padding: 30px;
                ${bpMaxSM} {
                  padding: 0;
                }
              `}
            >
              <Img sizes={banner.fluid} alt={site.siteMetadata.keywords.join(', ')} />
            </div>
          )}
          <br />
          <MDXRenderer>{contentfulBlogPost.body.childMdx.code.body}</MDXRenderer>
        </Container>
        {/* <SubscribeForm /> */}
      </article>
      <Container noVerticalPadding>
        <br />
      </Container>
    </Layout>
  );
}

export const pageQuery = graphql`
  query($id: String!) {
    site {
      ...site
    }
    contentfulBlogPost(id: { eq: $id }) {
      title
      heroImage {
        fluid(maxWidth: 900) {
          ...GatsbyContentfulFluid_withWebp
        }
      }
      date: publishDate(formatString: "MMMM DD, YYYY")
      author {
        name
      }
      description {
        description
      }
      tags
      slug
      body {
        childMdx {
          code {
            body
          }
        }
      }
    }
  }
`;
