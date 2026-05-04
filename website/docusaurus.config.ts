import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const simplePlantUML = require("@akebifiky/remark-simple-plantuml");

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "FinAssist Docs",
  tagline: "Техническая документация проекта FinAssist",
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://maksimkh34.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/tbank29/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "maksimkh34", // Usually your GitHub org/user name.
  projectName: "tbank29", // Usually your repo name.

  onBrokenLinks: "warn",
  trailingSlash: false,
  deploymentBranch: "gh-pages",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "ru",
    locales: ["ru"],
  },

  plugins: [
    ["drawio", {}],
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          remarkPlugins: [simplePlantUML],
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
    [
      "redocusaurus",
      {
        specs: [
          {
            id: "finassist",
            spec: "api_specs/finassist-openapi.yaml",
            route: "/API/",
          },
        ],
        theme: {
          primaryColor: "#1890ff",
        },
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "FinAssist",
      logo: {
        alt: "FinAssist Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Документация",
        },
        {
          to: "/docs/api/finassist",
          label: "API",
          position: "left",
        },
        {
          href: "https://github.com/maksimkh34/tbank29",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Разделы",
          items: [
            {
              label: "Введение",
              to: "/docs/intro",
            },
            {
              label: "Архитектура",
              to: "/docs/Architecture/storage",
            },
            {
              label: "Процессы",
              to: "/docs/Processes/bpmn",
            },
            {
              label: "Требования",
              to: "/docs/Requirements/fr",
            },
            {
              label: "UI",
              to: "/docs/UI/mockups",
            },
            {
              label: "API спецификация",
              to: "/docs/API/finassist",
            },
          ],
        },
        {
          title: "Ссылки",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/maksimkh34/tbank29",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} FinAssist. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

