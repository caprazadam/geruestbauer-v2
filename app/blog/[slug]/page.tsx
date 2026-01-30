"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, ArrowLeft, Share2, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = use(params);
  
  const post = blogPosts.find((p) => p.slug === slug && p.isPublished);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id && p.category === post.category && p.isPublished)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zum Blog
          </Button>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <Card className="overflow-hidden bg-white border-slate-100">
            <div className="relative h-64 md:h-96 bg-slate-100">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                  {post.category}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {post.title}
              </h1>
              
              <div className="flex items-center gap-4 text-slate-500 mb-8 pb-8 border-b border-slate-100">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.publishedAt).toLocaleDateString("de-DE")}
                </span>
              </div>

              <article className="prose prose-slate prose-lg max-w-none">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </article>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-slate-500">Tags:</span>
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <Button variant="outline" size="sm" className="border-slate-200">
                  <Share2 className="mr-2 h-4 w-4" />
                  Teilen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-1/4">
          {relatedPosts.length > 0 && (
            <Card className="bg-white border-slate-100">
              <CardHeader>
                <CardTitle className="text-slate-900">Ähnliche Artikel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="block hover:text-slate-600 transition-colors"
                    >
                      <h4 className="font-medium text-sm text-slate-900">{relatedPost.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(relatedPost.publishedAt).toLocaleDateString("de-DE")}
                      </p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className={`bg-white border-slate-100 ${relatedPosts.length > 0 ? 'mt-6' : ''}`}>
            <CardHeader>
              <CardTitle className="text-slate-900">Kontakt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Haben Sie Fragen zu diesem Artikel oder benötigen Sie Beratung?
              </p>
              <Link href="/contact">
                <Button className="w-full bg-slate-900 hover:bg-slate-800">
                  Kontakt aufnehmen
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="mt-6 bg-white border-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <FileText className="h-5 w-5" />
                Weitere Artikel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/blog">
                <Button variant="outline" className="w-full border-slate-200">
                  Alle Artikel anzeigen
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
