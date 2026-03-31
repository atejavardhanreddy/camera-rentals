import { getBlogPostBySlug } from "@/lib/data"
import { notFound } from "next/navigation"
import Breadcrumb from "@/components/breadcrumb"
import Link from "next/link"
import Script from "next/script"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      {/* Google Tag (gtag.js) */}
      {/* Google Tag (gtag.js) */}
      <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-P623CW7HNM" />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-P623CW7HNM');
          `,
        }}
      />
      <div className="bg-black min-h-screen">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

          <div className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-80 z-0"></div>
            <div
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${post.imageUrl}')`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="absolute inset-0 bg-zinc-900 -z-10"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-3xl">
                <div className="inline-block mb-4 px-3 py-1 border border-red-500 bg-black/50">
                  <span className="text-red-400 font-mono text-sm tracking-widest">{post.category.toUpperCase()}</span>
                </div>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6 tracking-wide leading-tight">
                  {post.title}
                </h1>
                <p className="text-xl text-zinc-300 mb-6 max-w-2xl font-body">{post.excerpt}</p>
                <p className="text-sm text-zinc-500 font-mono">
                  By {post.author} on{" "}
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="py-12">
            <div className="prose prose-invert max-w-none text-zinc-300 font-body leading-relaxed">
              {/* Render HTML content directly. Be cautious with untrusted HTML. */}
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className="inline-block bg-red-500 hover:bg-red-600 text-white px-8 py-3 font-heading transition-colors rounded-none"
              >
                BACK TO BLOG
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
