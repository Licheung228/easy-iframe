import type { Rule } from 'unocss'

const link: Rule[] = [
  [
    'linkPrimary',
    {
      color: 'var(--lic-color-primary)',
      'text-decoration': 'none',
      transition: 'color 0.3s ease'
    }
  ],
  [
    'linkHover',
    {
      color: 'var(--lic-color-primary-hover)'
    }
  ],
  [
    'linkActive',
    {
      color: 'var(--lic-color-primary-highlight)'
    }
  ],
  [
    'linkVisited',
    {
      color: 'var(--lic-color-primary-deep)',
      'text-decoration': 'underline'
    }
  ],
  [
    'linkDisabledHover',
    {
      color: 'var(--lic-color-text-muted)'
    }
  ],
  [
    'linkIsActive',
    {
      'text-decoration': 'underline',
      'text-decoration-style': 'double',
      'text-decoration-color': 'var(--lic-color-primary-highlight)'
    }
  ]
]

const btn: Rule[] = [
  [
    'btnPrimary',
    {
      /* 按钮的默认背景色为主题色 */
      'background-color': 'var(--lic-color-primary)',
      /* 文字颜色为白色，以保证在主题色背景上的可读性 */
      color: 'white',
      /* 去除默认边框 */
      border: 'none',
      /* 设置内边距，使按钮内容有合适的空间 */
      padding: '10px 20px',
      /* 设置按钮的圆角半径，使其外观更圆润 */
      'border-radius': '5px',
      /* 设置过渡效果，当按钮状态改变时（如悬停），背景色的变化会有平滑过渡 */
      transition: 'background-color 0.3s ease',
      /* 设置鼠标指针样式为手型，表示可点击 */
      cursor: 'pointer'
    }
  ],
  [
    'btnHover',
    {
      /* 当鼠标悬停在按钮上时，背景色变为主题色的悬停色调 */
      'background-color': 'var(--lic-color-primary-hover)'
    }
  ],
  [
    'btnActive',
    {
      /* 当按钮被按下时，背景色变为主题色的高亮色调 */
      'background-color': 'var(--lic-color-primary-highlight)'
    }
  ],
  [
    'btnDisabled',
    {
      /* 当按钮处于禁用状态时 */
      /* 背景色变为较浅的、用于表示禁用的色调 */
      'background-color': 'var(--lic-color-background-muted)',
      /* 文字颜色变为表示禁用的文本颜色 */
      color: 'var(--lic-color-text-disabled)',
      /* 鼠标指针变为不可用样式 */
      cursor: 'not-allowed'
    }
  ]
]

const success: Rule[] = [
  [
    'success',
    {
      'background-color': 'var(--lic-color-success)',
      color: 'var(--lic-color-text-inverse) !important'
    }
  ],
  [
    'successHover',
    {
      'background-color': 'var(--lic-color-success-hover)'
    }
  ]
]

const active: Rule[] = [
  [
    'active',
    {
      'background-color': 'var(--lic-color-primary-highlight)'
    }
  ]
]

const rules: Record<string, Rule[]> = {
  link,
  btn,
  success,
  active
}

export default rules
