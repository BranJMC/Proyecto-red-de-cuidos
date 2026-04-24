import type { SocialPost } from '../../types'

export function SocialFeed({ posts, title = 'Comunidad' }: { posts: SocialPost[]; title?: string }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-3xl text-slate-950 dark:text-white">{title}</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Publicaciones, novedades y resenas visibles para reforzar confianza.
        </p>
      </div>
      {posts.map((post) => (
        <article
          key={post.id}
          className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-lg shadow-slate-200/30 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none"
        >
          <div className="flex items-center gap-4">
            <img src={post.avatar} alt={post.author} className="size-12 rounded-2xl object-cover" />
            <div>
              <p className="font-medium text-slate-950 dark:text-white">{post.author}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {post.authorRole} • {post.time}
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">{post.content}</p>
          {post.image ? (
            <img src={post.image} alt={post.author} className="mt-5 h-64 w-full rounded-[28px] object-cover" />
          ) : null}
          <div className="mt-5 flex items-center gap-5 text-sm text-slate-500 dark:text-slate-400">
            <span>{post.likes} me gusta</span>
            <span>{post.comments} comentarios</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-800">{post.visibility}</span>
          </div>
        </article>
      ))}
    </section>
  )
}
