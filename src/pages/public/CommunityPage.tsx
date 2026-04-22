import { SocialFeed } from '../../components/ui/SocialFeed'
import { socialPosts } from '../../services/mockData'

export function CommunityPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <SocialFeed posts={socialPosts} title="Red social de cuidados" />
    </section>
  )
}
