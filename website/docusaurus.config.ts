import type { Config } from '@docusaurus/types';
import type { Preset } from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Neo Maps',
  tagline: 'Framework-agnostic Leaflet UI SDK modules',

  url: 'https://daniatou.github.io',
  baseUrl: process.env.DOCUSAURUS_BASE_URL ?? '/neo-map-utils/',

  organizationName: 'daniatou',
  projectName: 'neo-map-utils',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: 'https://github.com/daniatou/neo-map-utils/tree/main/website/'
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css'
        }
      } satisfies Preset.Options
    ]
  ],

  themeConfig: {
    image: 'img/demo-layer-panel1.png',
    navbar: {
      title: 'Neo Maps',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs'
        },
        {
          href: 'https://www.npmjs.com/org/neo-maps',
          label: 'npm',
          position: 'right'
        },
        {
          href: 'https://github.com/daniatou/neo-map-utils',
          label: 'GitHub',
          position: 'right'
        }
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Packages',
          items: [
            {
              label: 'Angular adapter',
              href: 'https://www.npmjs.com/package/@neo-maps/leaflet-layer-panel-angular'
            },
            {
              label: 'Core SDK',
              href: 'https://www.npmjs.com/package/@neo-maps/leaflet-layer-panel'
            }
          ]
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/daniatou/neo-map-utils'
            },
            {
              label: 'Issues',
              href: 'https://github.com/daniatou/neo-map-utils/issues'
            }
          ]
        }
      ],
      copyright: `Copyright ${new Date().getFullYear()} Neo Maps.`
    },
    prism: {
      additionalLanguages: ['typescript', 'bash']
    }
  } satisfies Preset.ThemeConfig
};

export default config;
