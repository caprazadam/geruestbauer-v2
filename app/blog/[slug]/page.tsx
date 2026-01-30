"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
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
    <div className="min-h-screen bg-gray-100">
      <div className="relative h-64 md:h-96">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-white/80">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString("de-DE")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="mb-6">
                  <Link href="/blog">
                    <Button variant="ghost" size="sm">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Zurück zum Blog
                    </Button>
                  </Link>
                </div>

                <article className="prose prose-lg max-w-none">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </article>

                <div className="mt-8 pt-6 border-t">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-gray-500">Tags:</span>
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Teilen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:w-1/4">
            {relatedPosts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Ähnliche Artikel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        href={`/blog/${relatedPost.slug}`}
                        className="block hover:text-blue-600 transition-colors"
                      >
                        <h4 className="font-medium text-sm">{relatedPost.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(relatedPost.publishedAt).toLocaleDateString("de-DE")}
                        </p>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Kontakt</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Haben Sie Fragen zu diesem Artikel oder benötigen Sie Beratung?
                </p>
                <Link href="/contact">
                  <Button className="w-full">Kontakt aufnehmen</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
