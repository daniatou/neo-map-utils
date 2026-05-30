module.exports =
  process.env.NEO_MAPS_DOCS_BUILD === 'true'
    ? {
        plugins: {}
      }
    : {
        plugins: {
          tailwindcss: {
            config: './tailwind.config.js'
          },
          autoprefixer: {}
        }
      };
