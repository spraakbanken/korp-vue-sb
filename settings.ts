// Simple:
// export { default } from '@instance/config.yml'

import settings from '@instance/config.yml'

// Changing some stuff for demo purposes
settings.default_language = 'sv'
settings.languages = [
  // I think we will use 2-letter codes now
  { value: 'en', label: 'English' },
  { value: 'sv', label: 'Svenska' },
  { value: 'de', label: 'Deutsch' }, // from instance
]

export default settings
