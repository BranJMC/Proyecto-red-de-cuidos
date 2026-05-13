import { useEffect, useState } from 'react'
import { SocialFeed } from '../../components/ui/SocialFeed'
import { mockApi } from '../../services/api'
import type { SocialPost } from '../../types'

export function CommunityPage() {
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([])

  useEffect(() => {
    mockApi.getSocialPosts().then(setSocialPosts)
  }, [])

  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <SocialFeed posts={socialPosts} title="Red social de cuidados" />
    </section>
  )
}
