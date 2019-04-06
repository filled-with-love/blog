const path = require('path');

const _ = require('lodash');
const paginate = require('gatsby-awesome-pagination');
const PAGINATION_OFFSET = 7;

const createPosts = (createPage, createRedirect, edges) => {
  edges.forEach(({ node }, i) => {
    const prev = i === 0 ? null : edges[i - 1].node;
    const next = i === edges.length - 1 ? null : edges[i + 1].node;
    const pagePath = node.slug;

    if (node.redirects) {
      node.redirects.forEach(fromPath => {
        createRedirect({
          fromPath,
          toPath: pagePath,
          redirectInBrowser: true,
          isPermanent: true,
        });
      });
    }

    createPage({
      path: pagePath,
      component: path.resolve(`./src/templates/post.js`),
      context: {
        id: node.id,
        prev,
        next,
      },
    });
  });
};

exports.createPages = ({ actions, graphql }) =>
  graphql(`
    query {
      allContentfulBlogPost {
        edges {
          node {
            id
            title
            slug
            date: publishDate
          }
        }
      }
    }
  `).then(({ data, errors }) => {
    if (errors) {
      return Promise.reject(errors);
    }

    if (_.isEmpty(data.allContentfulBlogPost)) {
      return Promise.reject('There are no posts!');
    }

    const { edges } = data.allContentfulBlogPost;
    const { createRedirect, createPage } = actions;
    createPosts(createPage, createRedirect, edges);
    // createPaginatedPages(actions.createPage, edges, '/blog', {
    //   categories: [],
    // });
  });

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        $components: path.resolve(__dirname, 'src/components'),
      },
    },
  });
};

// const createPaginatedPages = (createPage, edges, pathPrefix, context) => {
//   const pages = edges.reduce((acc, value, index) => {
//     const pageIndex = Math.floor(index / PAGINATION_OFFSET);

//     if (!acc[pageIndex]) {
//       acc[pageIndex] = [];
//     }

//     acc[pageIndex].push(value.node.id);

//     return acc;
//   }, []);

//   pages.forEach((page, index) => {
//     const previousPagePath = `${pathPrefix}/${index + 1}`;
//     const nextPagePath = index === 1 ? pathPrefix : `${pathPrefix}/${index - 1}`;

//     createPage({
//       path: index > 0 ? `${pathPrefix}/${index}` : `${pathPrefix}`,
//       component: path.resolve(`src/templates/blog.js`),
//       context: {
//         pagination: {
//           page,
//           nextPagePath: index === 0 ? null : nextPagePath,
//           previousPagePath: index === pages.length - 1 ? null : previousPagePath,
//           pageCount: pages.length,
//           pathPrefix,
//         },
//         ...context,
//       },
//     });
//   });
// };

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `ContentfulBlogPost`) {
    // const parent = getNode(node.parent);
    // const titleSlugged = _.join(_.drop(parent.name.split('-'), 3), '-');

    // const slug =
    //   parent.sourceInstanceName === 'legacy'
    //     ? `blog/${node.date.split('T')[0].replace(/-/g, '/')}/${titleSlugged}`
    //     : node.frontmatter.slug || titleSlugged;

    createNodeField({
      name: 'id',
      node,
      value: node.id,
    });

    createNodeField({
      name: 'title',
      node,
      value: node.title,
    });

    createNodeField({
      name: 'description',
      node,
      value: node.description,
    });

    createNodeField({
      name: 'slug',
      node,
      value: node.slug,
    });

    createNodeField({
      name: 'date',
      node,
      value: node.date ? node.date.split(' ')[0] : '',
    });

    createNodeField({
      name: 'banner',
      node,
      value: node.heroImage,
    });

    createNodeField({
      name: 'categories',
      node,
      value: node.categories || [],
    });

    createNodeField({
      name: 'keywords',
      node,
      value: node.keywords || [],
    });

    createNodeField({
      name: 'redirects',
      node,
      value: node.redirects,
    });
  }
};
