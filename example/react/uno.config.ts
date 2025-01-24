import {
  defineConfig,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

import rules from './config/uno/rules'

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  rules: Object.values(rules)
    .flat()
    .concat([
      [
        'animate-keyframes-rotate-y',
        {
          'animation-name': 'rotate-y'
        }
      ]
    ]),
  shortcuts: [
    {
      link: 'linkPrimary hover:linkHover active:linkActive disabled:hover:linkDisabledHover visited:linkVisited',
      'active-link': 'linkIsActive hover:linkHover',
      btn: 'btnPrimary active:btnActive disabled:btnDisabled hover:btnHover shadow-xl',
      'flex-center': 'flex justify-center items-center'
    },
    [
      /^success-([a-z]+)$/,
      ([, shortcut]) => `${shortcut} success hover:successHover`
    ],
    [
      /^active-([a-z]+)$/,
      ([, shortcut]) => `${shortcut} active hover:activeHover`
    ]
  ]
})
