import { z, defineCollection, getCollection } from 'astro:content';
import client from '../utils/sanityClient.mjs';
import {toHTML} from '@portabletext/to-html'


const reports = defineCollection({
  loader: async () => {
      const reports = await client.fetch(`
          *[_type == "report"]{
  _id,
    reportRich,
    title,
    heroImage,
    "slug": slug.current
}
        `, {}, {perspective: 'published'});
        return reports.map((report) => {
            const html = toHTML(report.reportRich, {
              components: {
              types: {
                report: ({value}) => {
                  return (`<div style="border: 1px solid #ccc; overflow: auto; width: 100%">
<pre style="font-size:.85rem;">${value.reportText}</pre>
                    </div>`)
                }
              }
            }
            })

            return {
          id: report._id,
          ...report,
          html
        }})
  }
})

// Expose your defined collection to Astro
// with the `collections` export
export const collections = { reports };