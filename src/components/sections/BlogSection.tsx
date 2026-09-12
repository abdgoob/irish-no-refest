import { blogPosts } from "@/data/home.en";
import { SectionShell } from "@/components/layout/SectionShell";
import { MediaImage } from "@/components/ui/MediaImage";

export function BlogSection() {
  return (
    <SectionShell id="blog" theme="dark" className="sd-blog">
      <p className="p3">BLOG</p>
      <h2 className="h4" style={{ marginTop: "1rem" }}>
        LATEST NEWS AND UPDATES
      </h2>
      <div className="sd-blog__grid">
        {blogPosts.map((post) => (
          <article key={post.title}>
            <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
              <MediaImage src={post.image} alt="" sizes="33vw" />
            </div>
            <h3 className="p4" style={{ marginTop: "1rem" }}>
              {post.title}
            </h3>
            <p className="p5" style={{ marginTop: "0.75rem", textTransform: "none", letterSpacing: "0.02em", lineHeight: 1.5 }}>
              {post.excerpt}
            </p>
          </article>
        ))}
      </div>
      <p className="p5" style={{ marginTop: "2rem" }}>
        View all
      </p>
    </SectionShell>
  );
}
