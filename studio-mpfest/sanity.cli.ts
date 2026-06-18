import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'zpmwzluo',
    dataset: 'production'
  },
  studioHost: 'mpfest',
  deployment: {
    appId: 'dhz77efglmrm9oxx51l12b40',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  }
})
