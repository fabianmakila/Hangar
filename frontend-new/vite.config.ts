import path from "path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Pages from "vite-plugin-pages";
import Layouts from "vite-plugin-vue-layouts";
import AutoImport from 'unplugin-auto-import/vite'
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Markdown from "vite-plugin-md";
import WindiCSS from "vite-plugin-windicss";
import { VitePWA } from "vite-plugin-pwa";
import VueI18n from "@intlify/vite-plugin-vue-i18n";
import Prism from "markdown-it-prism";
import LinkAttributes from 'markdown-it-link-attributes'
import viteSSR from "vite-ssr/plugin";
import EslintPlugin from 'vite-plugin-eslint';

const proxyHost = process.env.proxyHost || 'http://localhost:8080';
const authHost = process.env.authHost || 'http://localhost:3001';

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  plugins: [
    viteSSR(),

    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ["vue", "md"],
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/vite-plugin-md
    Markdown({
      wrapperClasses: "prose prose-sm m-auto text-left",
      headEnabled: true, // This relies on useHead
      markdownItSetup(md) {
        // https://prismjs.com/
        md.use(Prism);
        md.use(LinkAttributes, {
            pattern: /^https?:\/\//,
            attrs: {
                target: '_blank',
                rel: 'noopener',
            },
        });
      },
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
        imports: [
            'vue',
            'vue-router',
            'vue-i18n',
            '@vueuse/head',
            '@vueuse/core',
            'pinia',
            {
                'axios': [['default', 'axios'] ],
            },
        ],
        dts: 'src/types/auto-imports.d.ts',
        eslintrc: {
            enabled: true,
        },
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ["vue", "md"],

      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],

      // auto import icons
      resolvers: [
        // https://github.com/antfu/vite-plugin-icons
        IconsResolver({
          componentPrefix: "",
          // enabledCollections: ['carbon']
        }),
      ],
      dts: 'src/types/components.d.ts',
    }),

    // https://github.com/antfu/vite-plugin-icons
    Icons({
        autoInstall: true
    }),

    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS({
      safelist: "prose prose-sm m-auto",
    }),

    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      manifest: {
        name: "Hangar | PaperMC",
        short_name: "Hangar",
        description: "Plugin repository for Paper plugins and more!",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),

    // https://github.com/intlify/vite-plugin-vue-i18n
    VueI18n({
      include: [path.resolve(__dirname, "src/i18n/translations/**")],
    }),

    EslintPlugin({
        fix: true
    }),
  ],

  optimizeDeps: {
    include: ['vue', 'vue-router', '@vueuse/core', '@vueuse/head'],
    exclude: ['vue-demi'],
  },

  server: {
      proxy: {
          // backend
          "/api/": proxyHost,
          "/signup": proxyHost,
          "/login": proxyHost,
          "/logout": proxyHost,
          "/handle-logout": proxyHost,
          "/refresh": proxyHost,
          "/invalidate": proxyHost,
          "/v2/api-docs/": proxyHost,
          "/robots.txt": proxyHost,
          "/sitemap.xml": proxyHost,
          "/global-sitemap.xml": proxyHost,
          "/*/sitemap.xml": proxyHost,
          "/statusz": proxyHost,
          // auth
          "/avatar": authHost,
          "/oauth/logout": authHost,
          "/oauth2": authHost,
      },
  }
});