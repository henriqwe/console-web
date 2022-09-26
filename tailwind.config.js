module.exports = {
  content: ['./src/**/*.{html,js,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          primary: '#f5f5f5'
        },
        text: {
          primary: '#ffffff',
          secondary: '#cccccc',
          tertiary: '#999999',
          highlight: '#ff6600'
        },
        bg: {
          page: '#18212f',
          navigation: '#111827'
        },
        menu: {
          primary: '#1e293b',
          secondary: '#3e557a'
        },
        menuItem: {
          primary: '#2e456b',
          secondary: '#5f82ba',
          ativo: '#111827',
          ativoEscuro: '#101623'
        },
        iconGreen: '#16a34a',
        ycodify: '#b1c901'
      },
      fontSize: {
        tiny: '.7rem',
        'super-tiny': '.55rem'
      }
    }
  },
  plugins: []
}
