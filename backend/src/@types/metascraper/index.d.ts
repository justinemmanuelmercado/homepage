declare module 'metascraper' {
    import { Dictionary } from 'lodash'
    interface rule { [key: string]: any }
    function metascraper(rules: rule[]): (options: {url?: string, html?: string, rules?: any, escape?: boolean, }) => Promise<Dictionary<any>>
    export = metascraper
}